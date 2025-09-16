import React, { forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  leftIcon: LeftIcon,
  className = '',
  disabled = false,
  required = false,
  multiple = false,
  ...props
}, ref) => {
  const baseClasses = `
    w-full px-4 py-2.5 text-sm border rounded-lg transition-colors duration-200 appearance-none
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white
    dark:focus:ring-primary-500 dark:focus:border-transparent
  `;

  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
    : 'border-gray-300 dark:border-gray-600';

  const paddingClasses = `
    ${LeftIcon ? 'pl-10' : 'pl-4'}
    pr-10
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}

        <select
          ref={ref}
          disabled={disabled}
          multiple={multiple}
          className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
          {...props}
        >
          {placeholder && !multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value || option} 
              value={option.value || option}
            >
              {option.label || option}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;