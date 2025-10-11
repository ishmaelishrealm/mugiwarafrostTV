import { forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';

interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}, ref) => {
  const baseClasses = 'w-full px-4 py-3 bg-background border border-border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  
  const errorClasses = error ? 'border-error focus:ring-error' : '';
  const iconClasses = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';
  
  const inputClasses = clsx(
    baseClasses,
    errorClasses,
    iconClasses,
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted ${
              onLeftIconClick ? 'cursor-pointer hover:text-foreground' : ''
            }`}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          className={inputClasses}
        />
        
        {rightIcon && (
          <div 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted ${
              onRightIconClick ? 'cursor-pointer hover:text-foreground' : ''
            }`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-foreground-secondary">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
