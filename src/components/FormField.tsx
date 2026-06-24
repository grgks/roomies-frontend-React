import type { ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    error?: string;
    htmlFor?: string;
    labelClassName?: string;
    children: ReactNode;
}

const FormField = ({ label, error, htmlFor, labelClassName, children }: FormFieldProps) => (
    <div className="flex flex-col gap-1">
        <label htmlFor={htmlFor} className={labelClassName ?? "text-sm font-medium text-slate-700"}>
            {label}
        </label>
        {children}
        {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
);

export default FormField;