import Tesseract from 'tesseract.js';
import { v4 as uuidv4 } from 'uuid';

// Process OCR using Tesseract.js with enhanced options for meter reading
export const processOCR = async (fileBuffer, fileName) => {
  try {
    console.log(`Processing OCR for file: ${fileName}`);
    
    // Use Tesseract.js with enhanced options for better meter reading recognition
    const { data: { text } } = await Tesseract.recognize(
      fileBuffer,
      'eng',
      { 
        logger: info => console.log(`OCR Progress: ${info.status} - ${Math.round(info.progress * 100)}%`),
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,-: /',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: '6' // Assume a single uniform block of text
      }
    );
    
    // Clean up the text
    const cleanedText = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable characters
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase
      .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2') // Add space in camelCase-like patterns
      .trim();
    
    console.log('Cleaned OCR text:', cleanedText);
    
    // Parse the text into structured data with special attention to meter readings
    const lines = cleanedText.split('\n').filter(line => line.trim() !== '');
    const items = [];
    
    lines.forEach((line, index) => {
      // Look for key-value pairs (e.g., "Key: Value")
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const label = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        items.push({
          id: uuidv4(),
          label: label,
          value: value,
          confidence: Math.floor(Math.random() * 20) + 80 // Mock confidence
        });
      } else {
        // Look for meter reading patterns
        const patterns = [
          // Volume readings with units
          { regex: /(\d+(?:\.\d+)?)\s*(m3|m³|L|gallons|liters|cu\.?\s*ft|meter\s*reading|m\.?\s*r\.?)/i, label: "Volume Reading" },
          // Flow rates
          { regex: /(\d+(?:\.\d+)?)\s*(m3|hL|L|min|hr)/i, label: "Flow Rate" },
          // Pressure readings
          { regex: /(\d+(?:\.\d+)?)\s*(bar|psi|kPa)/i, label: "Pressure" },
          // Temperature readings
          { regex: /(\d+(?:\.\d+)?)\s*([°º]\s*[CF])/i, label: "Temperature" },
          // Model identifiers
          { regex: /(MULTICAL[®©]?\s*\d+[A-Z]*)/i, label: "Model" },
          // Standalone 5+ digit numbers (likely meter readings like 00735)
          { regex: /\b(\d{5,})\b/, label: "Current Reading" }
        ];
        
        let matched = false;
        for (const { regex, label } of patterns) {
          const match = line.match(regex);
          if (match) {
            items.push({
              id: uuidv4(),
              label: label,
              value: match[1],
              confidence: label === "Model" ? 98 : 
                         label === "Current Reading" ? 92 : 95
            });
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          // Look for serial numbers or device IDs
          const serialPatterns = [
            { regex: /([A-Z0-9]{5,})/i, label: "Serial Number" },
            { regex: /\b([A-Z]\s*\d{3,})\b/i, label: "Device ID" },
            { regex: /\b(\d{2,}[A-Z]\d{2,})\b/i, label: "Model Number" },
            { regex: /\b([A-Z]\s*\d+[A-Z]?\d*)\b/i, label: "Meter Number" } // For patterns like "B83"
          ];
          
          for (const { regex, label } of serialPatterns) {
            const serialMatch = line.match(regex);
            if (serialMatch) {
              // Clean up spaces in the match
              const cleanValue = serialMatch[1].replace(/\s+/g, '');
              if (cleanValue.length >= 2) {
                items.push({
                  id: uuidv4(),
                  label: label,
                  value: cleanValue,
                  confidence: label === "Meter Number" ? 92 : 90
                });
                matched = true;
                break;
              }
            }
          }
          
          if (!matched) {
            // Look for date/time patterns
            if (line.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})|(\d{1,2}[-/]\d{1,2}[-/]\d{4})|(\d{1,2}:\d{2}(?::\d{2})?)/)) {
              items.push({
                id: uuidv4(),
                label: "Date/Time",
                value: line.trim(),
                confidence: 85
              });
            }
            // For other lines, treat as generic items
            else if (line.trim().length > 0) {
              items.push({
                id: uuidv4(),
                label: `Line ${index + 1}`,
                value: line.trim(),
                confidence: Math.floor(Math.random() * 20) + 70 // Lower confidence for generic lines
              });
            }
          }
        }
      }
    });
    
    return {
      success: true,
      text: cleanedText,
      items: items
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const extractText = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    console.log('Received file for OCR:', req.file.originalname);
    
    // Process the image with OCR
    const result = await processOCR(req.file.buffer, req.file.originalname);
    
    if (result.success) {
      return res.status(200).json({
        success: true,
        text: result.text,
        items: result.items
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'OCR processing failed',
        error: result.error
      });
    }
  } catch (error) {
    console.error('OCR extraction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to extract text from image',
      error: error.message
    });
  }
};