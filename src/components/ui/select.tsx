import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = '', children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <select
        ref={ref}
        className={cn(
          'appearance-none block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200',
          'pr-10',
          className
        )}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <ChevronDown 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
        />
      </span>
    </div>
  );
});
Select.displayName = 'Select'; 