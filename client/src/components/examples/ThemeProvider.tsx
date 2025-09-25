import { ThemeProvider } from '../ThemeProvider';
import { Button } from "@/components/ui/button";

function ThemeExample() {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium">Theme Provider Example</h3>
      <div className="flex gap-2">
        <Button variant="default">Primary Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>
      <div className="p-4 bg-card border rounded-md">
        <p className="text-card-foreground">This content adapts to the theme.</p>
      </div>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <ThemeExample />
    </ThemeProvider>
  );
}