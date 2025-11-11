import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle } from "lucide-react";

const extractedData = [
  { label: "Device ID", value: "PUMP-A1-2024", confidence: 98 },
  { label: "Serial Number", value: "SN-45782-XY", confidence: 95 },
  { label: "Pressure Reading", value: "3.2 Bar", confidence: 99 },
  { label: "Temperature", value: "68°C", confidence: 97 },
  { label: "Flow Rate", value: "450 L/min", confidence: 96 },
  { label: "Timestamp", value: "2024-01-15 14:23", confidence: 99 },
];

export default function OCR() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Text Extractor (OCR)</h1>
        <p className="text-muted-foreground mt-1">Extract and digitize data from images and documents</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-elevation-2">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-aqua" />
              Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-aqua hover:bg-aqua/5 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: JPG, PNG, PDF (Max 10MB)
              </p>
              <Button variant="aqua">
                Select Files
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold">Recent Uploads</h4>
              {["gauge_reading_jan15.jpg", "meter_display.png", "sensor_output.pdf"].map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-aqua" />
                    <div>
                      <p className="text-sm font-medium">{file}</p>
                      <p className="text-xs text-muted-foreground">Processed 2 min ago</p>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation-2">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-aqua" />
              Extracted Data
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {extractedData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.confidence}% confidence
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                    <span className="font-mono text-sm font-semibold">{item.value}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success transition-all"
                      style={{ width: `${item.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <Button variant="aqua" className="flex-1">
                Save to Database
              </Button>
              <Button variant="outline" className="flex-1">
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
