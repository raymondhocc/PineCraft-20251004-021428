import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Copy, Settings2, Code, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePineCraftActions, useInputScript, useParameters, useParameterValues, useOutputScript } from '@/hooks/usePineCraftStore';
import { PineParameter } from '@/lib/pine-parser';
const ParameterControl: React.FC<{ parameter: PineParameter }> = ({ parameter }) => {
  const { setParameterValue } = usePineCraftActions();
  const values = useParameterValues();
  const value = values[parameter.name] ?? parameter.defval;
  const renderControl = () => {
    switch (parameter.type) {
      case 'int':
      case 'float':
        return (
          <div className="flex items-center space-x-4">
            <Slider
              value={[value]}
              onValueChange={(val) => setParameterValue(parameter.name, val[0])}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step || (parameter.type === 'float' ? 0.01 : 1)}
              className="flex-grow"
            />
            <Input
              type="number"
              value={value}
              onChange={(e) => {
                const rawValue = e.target.value;
                if (rawValue === '') {
                  setParameterValue(parameter.name, parameter.defval);
                  return;
                }
                const numValue = parameter.type === 'float' ? parseFloat(rawValue) : parseInt(rawValue, 10);
                if (!isNaN(numValue)) {
                  setParameterValue(parameter.name, numValue);
                }
              }}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step || (parameter.type === 'float' ? 0.01 : 1)}
              className="w-24 h-9"
            />
          </div>
        );
      case 'bool':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={(checked) => setParameterValue(parameter.name, checked)}
              id={parameter.name}
            />
            <Label htmlFor={parameter.name}>{value ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );
      case 'string':
      case 'source':
        return (
          <Input
            value={value}
            onChange={(e) => setParameterValue(parameter.name, e.target.value)}
          />
        );
      default:
        return <p className="text-sm text-muted-foreground">Unsupported type: {parameter.type}</p>;
    }
  };
  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center space-x-2">
        <Label htmlFor={parameter.name} className="font-medium text-foreground">{parameter.title}</Label>
        {parameter.tooltip && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{parameter.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {renderControl()}
    </div>
  );
};
export function PineCraftCore() {
  const inputScript = useInputScript();
  const parameters = useParameters();
  const outputScript = useOutputScript();
  const { setInputScript } = usePineCraftActions();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputScript);
    toast.success('Copied to clipboard!', {
      description: 'You can now paste the script into TradingView.',
    });
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle>Input Script</CardTitle>
              <CardDescription>Paste your Pine Script™ code here.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={inputScript}
            onChange={(e) => setInputScript(e.target.value)}
            placeholder="//version=5..."
            className="h-96 lg:h-[calc(100vh-22rem)] font-mono text-sm resize-none"
          />
        </CardContent>
      </Card>
      <div className="space-y-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Settings2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle>Parameters</CardTitle>
                <CardDescription>Adjust your strategy inputs here.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-6">
                {parameters.length > 0 ? (
                  parameters.map((param) => <ParameterControl key={param.name} parameter={param} />)
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No input parameters found.</p>
                    <p className="text-sm">Paste a script with `input()` functions to begin.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                 <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <Code className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                 </div>
                <div>
                  <CardTitle>Output Code</CardTitle>
                  <CardDescription>Your modified script, ready to use.</CardDescription>
                </div>
              </div>
              <Button onClick={handleCopy} size="sm" className="bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95">
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 border rounded-md bg-muted/50 dark:bg-background">
              <pre className="p-4 text-sm font-mono whitespace-pre-wrap break-words">
                <code>{outputScript}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}