// Simple test script for OCR functionality
import { processOCR } from './controllers/OCR.js';

// Test OCR with a sample image buffer
// In a real scenario, this would be an actual image file buffer
async function testOCR() {
  console.log('Testing OCR functionality...');
  
  try {
    // This is just a placeholder test since we don't have an actual image
    console.log('OCR module loaded successfully');
    console.log('To test with actual images, use the /api/v1/ocr/extract endpoint');
  } catch (error) {
    console.error('OCR test failed:', error);
  }
}

testOCR();