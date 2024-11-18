import React from "react";

import "//unpkg.com/mathlive";

interface FormulaInputProps {
  value: string;
  onChange: (value: string) => void;
}

const FormulaForm: React.FC<FormulaInputProps> = ({ value, onChange }) => {
    const handleInput = (event: React.FormEvent<MathfieldElement>) => {
        onChange((event.target as MathfieldElement).getValue());
      };

  return (
    <math-field
      onInput={handleInput}
    >
      {value}
    </math-field>
  );
};

export default FormulaForm;
