import React from 'react';
import { cn } from '@/lib/utils';

export const TextField = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
      'placeholder:text-gray-400',
      'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors duration-200',
      'resize-vertical min-h-[80px]',
      className
    )}
    {...props}
  />
));
TextField.displayName = 'TextField'; 