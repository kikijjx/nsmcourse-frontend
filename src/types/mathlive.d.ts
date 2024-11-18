declare global {
    namespace JSX {
      interface IntrinsicElements {
        "math-field": React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
      }
    }
  
    interface MathfieldElement extends HTMLElement {
      setValue(value: string): void;
      getValue(): string;
    }
  }
  
  export {};
  