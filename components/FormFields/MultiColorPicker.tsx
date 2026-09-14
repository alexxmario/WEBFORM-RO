import { Plus, X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function MultiColorPicker({ value, onChange }: Props) {
  // Ensure value is always an array (handle backward compatibility)
  const colors = Array.isArray(value) ? value : (value ? [value as string] : []);

  const addColor = () => {
    if (colors.length < 5) {
      onChange([...colors, "#000000"]);
    }
  };

  const removeColor = (index: number) => {
    onChange(colors.filter((_, i) => i !== index));
  };

  const updateColor = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors);
  };

  return (
    <div className="space-y-3">
      {colors.length === 0 && (
        <p className="text-sm text-muted-foreground">Nu ai adăugat culori. Poți lăsa alegerea în grija noastră.</p>
      )}

      {colors.map((color, index) => (
        <div key={index} className="flex items-center gap-3">
          <Input
            type="color"
            value={color}
            onChange={(e) => updateColor(index, e.target.value)}
            className="h-11 w-20 cursor-pointer p-1"
          />
          <Input
            value={color}
            onChange={(e) => updateColor(index, e.target.value)}
            className="flex-1"
            placeholder="#000000"
            aria-label={`Codul culorii ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeColor(index)}
            aria-label={`Elimină culoarea ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {colors.length < 5 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColor}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adaugă o culoare ({colors.length}/5)
        </Button>
      )}
    </div>
  );
}
