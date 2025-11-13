import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function Settings() {
  const [minThreshold, setMinThreshold] = useState("");
  const [maxThreshold, setMaxThreshold] = useState("");
  const [themeAccent, setThemeAccent] = useState("aqua");
  const [darkMode, setDarkMode] = useState(false);
  // Notifications removed per request
  const [thresholdError, setThresholdError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSaveThresholds = () => {
    setSaved(false);
    setThresholdError(null);
    const min = Number(minThreshold);
    const max = Number(maxThreshold);
    if (isNaN(min) || isNaN(max)) {
      setThresholdError("Both values must be numbers.");
      return;
    }
    if (min < 0 || max < 0) {
      setThresholdError("Values cannot be negative.");
      return;
    }
    if (min >= max) {
      setThresholdError("Min must be less than Max.");
      return;
    }
    console.log("Saving thresholds:", { min, max });
    setSaved(true);
  };

  const handleSaveTheme = () => {
    console.log("Saving theme settings:", { accent: themeAccent, darkMode });
    setSaved(true);
    // Dark mode toggle demo (simple add/remove class on document root)
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      {/* Theme Settings */}
      <Card className="shadow-soft-md border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-soft-muted">Toggle application dark theme</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label={darkMode ? 'Disable dark mode' : 'Enable dark mode'} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Accent Color</label>
            <Select value={themeAccent} onValueChange={setThemeAccent}>
              <SelectTrigger className="w-48 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="aqua">Aqua</SelectItem>
                <SelectItem value="success">Green</SelectItem>
                <SelectItem value="warning">Amber</SelectItem>
                <SelectItem value="destructive">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveTheme} className="h-9 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-hover))] text-white">Save Theme</Button>
        </CardContent>
      </Card>

      {/* Threshold Settings */}
      <Card className="shadow-soft-md border-border/50">
        <CardHeader className="pb-3 flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">Thresholds</CardTitle>
          {saved && !thresholdError && (
            <Badge className="bg-success/15 text-success border-success/20 flex items-center gap-1" variant="outline"><CheckCircle className="h-3 w-3" /> Saved</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="minThreshold" className="text-sm font-medium">Min</label>
              <Input
                id="minThreshold"
                type="number"
                aria-label="Minimum threshold"
                placeholder="0"
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                className="w-32 h-9"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="maxThreshold" className="text-sm font-medium">Max</label>
              <Input
                id="maxThreshold"
                type="number"
                aria-label="Maximum threshold"
                placeholder="100"
                value={maxThreshold}
                onChange={(e) => setMaxThreshold(e.target.value)}
                className="w-32 h-9"
              />
            </div>
            <Button onClick={handleSaveThresholds} className="h-9 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white">Save Thresholds</Button>
          </div>
          <div aria-live="polite" className="min-h-[20px] text-xs">
            {thresholdError && (
              <p className="text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {thresholdError}</p>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
