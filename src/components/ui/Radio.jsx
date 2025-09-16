import React, { forwardRef } from 'react';

const RadioGroup = ({ children, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {children}
  </div>
);

const Radio = forwardRef(({
  label,
  description,
  error,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            disabled={disabled}
            className={`
              h-4 w-4 border-gray-300 text-primary-600 
              focus:ring-primary-500 focus:ring-2 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:border-gray-600 dark:bg-gray-700
              ${className}
            `}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3 text-sm">
            {label && (
              <label className={`font-medium ${
                disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {label}
              </label>
            )}
            {description && (
              <p className={`${
                disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 ml-7">{error}</p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';
Radio.Group = RadioGroup;

export default Radio;