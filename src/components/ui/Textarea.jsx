import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  label,
  placeholder,
  error,
  helperText,
  className = '',
  disabled = false,
  required = false,
  rows = 4,
  ...props
}, ref) => {
  const baseClasses = `
    w-full px-4 py-2.5 text-sm border rounded-lg transition-colors duration-200 resize-vertical
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
    dark:focus:ring-primary-500 dark:focus:border-transparent
  `;

  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
    : 'border-gray-300 dark:border-gray-600';

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
