import React, { forwardRef } from 'react';

const Switch = forwardRef(({
  label,
  description,
  error,
  className = '',
  disabled = false,
  checked = false,
  onChange,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className={`text-sm font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {label}
              </label>
            )}
            {description && (
              <p className={`text-sm ${
                disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {description}
              </p>
            )}
          </div>
        )}
        
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange && onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'}
            ${className}
          `}
          {...props}
        >
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';
export default Switch;