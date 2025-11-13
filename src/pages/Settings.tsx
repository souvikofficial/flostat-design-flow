import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export default function Settings() {
  const [sumpThreshold, setSumpThreshold] = useState<number>(50);
  const [tankRange, setTankRange] = useState<number[]>([20, 80]);
  const [savedSump, setSavedSump] = useState(false);
  const [savedTank, setSavedTank] = useState(false);

  const saveSump = () => {
    console.log('Saving sump threshold', sumpThreshold);
    setSavedSump(true);
    setTimeout(() => setSavedSump(false), 3000);
  };
  const saveTank = () => {
    console.log('Saving tank threshold', tankRange);
    setSavedTank(true);
    setTimeout(() => setSavedTank(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold tracking-tight text-soft text-center">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
  {/* Sump Threshold */}
      <Card className="rounded-lg border border-border/50 bg-card shadow-soft-lg">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-medium">Sump Threshold</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-soft-muted">
            <span>Value: <span className="font-semibold text-soft">{sumpThreshold}%</span></span>
          </div>
          <Slider
            value={[sumpThreshold]}
            onValueChange={(v) => setSumpThreshold(v[0])}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span><span>100%</span>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={saveSump}
              className="h-8 px-4 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-hover))] text-white text-xs"
            >
              Save Sump
            </Button>
          </div>
          {savedSump && <p className="text-[10px] text-success text-right mt-1">Saved.</p>}
        </CardContent>
  </Card>

  {/* Tank Threshold */}
  <Card className="rounded-lg border border-border/50 bg-card shadow-soft-lg">
        <CardHeader className="border-b bg-muted/30 py-3">
          <CardTitle className="text-sm font-medium">Tank Threshold</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-soft-muted">
            <span>Range: <span className="font-semibold text-soft">{tankRange[0]}% - {tankRange[1]}%</span></span>
          </div>
          <Slider
            value={tankRange}
            onValueChange={(v) => setTankRange(v as number[])}
            min={0}
            max={100}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0%</span><span>100%</span>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={saveTank}
              className="h-8 px-4 bg-[hsl(var(--navy))] hover:bg-[hsl(var(--navy-hover))] text-white text-xs"
            >
              Save Tank
            </Button>
          </div>
          {savedTank && <p className="text-[10px] text-success text-right mt-1">Saved.</p>}
        </CardContent>
  </Card>
  </div>

      {/* Combined save removed; individual buttons per card */}
    </div>
  );
}
