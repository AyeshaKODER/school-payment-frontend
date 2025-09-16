import React, { forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  showPasswordToggle = false,
  className = '',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  const baseClasses = `
    w-full px-4 py-2.5 text-sm border rounded-lg transition-colors duration-200
    focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
    dark:focus:ring-primary-500 dark:focus:border-transparent
  `;

  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
    : 'border-gray-300 dark:border-gray-600';

  const paddingClasses = `
    ${LeftIcon ? 'pl-10' : 'pl-4'}
    ${RightIcon || showPasswordToggle ? 'pr-10' : 'pr-4'}
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

        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${paddingClasses} ${className}`}
          {...props}
        />

        {(RightIcon || showPasswordToggle) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            ) : RightIcon ? (
              <RightIcon className="h-5 w-5 text-gray-400" />
            ) : null}
          </div>
        )}
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

Input.displayName = 'Input';
export default Input;