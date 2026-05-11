import { clsx } from "clsx";

interface FieldProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      {label && (
        <label>
          {label}
          {required && <span className="req">*</span>}
          {hint && <span className="hint">{hint}</span>}
        </label>
      )}
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  small?: boolean;
}

export function Input({ small, className, ...props }: InputProps) {
  return (
    <input
      className={clsx("input", small && "sm", className)}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={clsx("textarea", className)} {...props} />;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
  return (
    <select className={clsx("select", className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
