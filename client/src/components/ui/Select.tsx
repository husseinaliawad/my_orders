import { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = "", ...props }, ref) => <select ref={ref} {...props} className={`field ${className}`} />
);

Select.displayName = "Select";
