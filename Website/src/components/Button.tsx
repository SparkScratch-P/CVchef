import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-white hover:bg-gray-50 text-blue-600 border border-gray-200 shadow-sm hover:shadow focus:ring-blue-500',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-500 hover:border-blue-600 focus:ring-blue-500',
    text: 'bg-transparent hover:bg-blue-50 text-blue-600 hover:text-blue-700 focus:ring-blue-500'
  };
  
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-lg px-6 py-3 gap-2.5'
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button className={combinedClassName} {...props}>
      {icon && iconPosition === 'left' && <span className="icon-left">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="icon-right">{icon}</span>}
    </button>
  );
};

export default Button;