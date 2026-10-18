import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldClasses =
  "font-outfit w-full bg-ink-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-paper-100 placeholder:text-paper-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-violet focus:border-neon-violet/40 transition-colors";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Highest-leverage file in the admin redesign — every form (Work,
 * Episode, Journal, Homepage, Announcement, Settings) builds its
 * inputs from this one file, so restyling it here cascades everywhere
 * without touching each form's own markup.
 */
export function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-outfit text-sm font-medium text-paper-200">
        {label}
      </label>
      {children}
      {hint && <span className="font-outfit text-xs text-paper-500">{hint}</span>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClasses} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClasses} ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClasses} ${props.className ?? ""}`} />;
}
