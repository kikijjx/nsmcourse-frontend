import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}
import "//unpkg.com/mathlive";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FormulaInput: React.FC<FormulaInputProps> = ({ value, onChange }) => {
  const handleInput = (event: React.ChangeEvent<HTMLElement>) => {
    onChange(event.target.value);
  };

  return (
    <math-field
      onInput={handleInput}
    >
      {value}
    </math-field>
  );
};

export default FormulaInput;
