import React, { createContext, useContext, useRef } from 'react';

// Utility for merging classes
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

type InputOTPContextValue = {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  slots: React.RefObject<HTMLInputElement>[];
};

const InputOTPContext = createContext<InputOTPContextValue | null>(null);

const useInputOTP = () => {
  const context = useContext(InputOTPContext);
  if (!context) {
    throw new Error('useInputOTP must be used within an InputOTP component');
  }
  return context;
};

// Main component
const InputOTP = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onChange?: (value: string) => void;
    maxLength: number;
  }
>(({ value = '', onChange, maxLength, children, className, ...props }, ref) => {
  const slots = Array.from({ length: maxLength }, () => useRef<HTMLInputElement>(null));

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, maxLength);
    onChange?.(pastedData);
  };

  const contextValue: InputOTPContextValue = {
    value,
    onChange: (newValue) => onChange?.(newValue),
    maxLength,
    slots,
  };

  return (
    <InputOTPContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        onPaste={handlePaste}
        {...props}
      >
        {children}
      </div>
    </InputOTPContext.Provider>
  );
});
InputOTP.displayName = 'InputOTP';

// Group component
const InputOTPGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />;
});
InputOTPGroup.displayName = 'InputOTPGroup';

// Separator component
const InputOTPSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return (
    <div ref={ref} role="separator" {...props}>
      <div className="h-6 w-px bg-slate-300" />
    </div>
  );
});
InputOTPSeparator.displayName = 'InputOTPSeparator';

// Slot component
const InputOTPSlot = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { index: number }
>(({ index, className, ...props }, ref) => {
  const { value, onChange, maxLength, slots } = useInputOTP();
  const char = value[index] || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChar = e.target.value.slice(0, 1);
      const newValueArr = value.split('');
      newValueArr[index] = newChar;
      const newValue = newValueArr.join('').slice(0, maxLength);
      onChange(newValue);

      if (newChar && index < maxLength - 1) {
          slots[index + 1].current?.focus();
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !char && index > 0) {
          slots[index - 1].current?.focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          slots[index - 1].current?.focus();
      } else if (e.key === 'ArrowRight' && index < maxLength - 1) {
          e.preventDefault();
          slots[index + 1].current?.focus();
      }
  };


  return (
    <input
      ref={slots[index]}
      value={char}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={1}
      className={cn(
        'relative flex h-14 w-12 items-center justify-center border border-slate-300/50 bg-slate-100/50 text-center text-2xl font-semibold transition-all rounded-lg',
        'focus:relative focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        char && 'text-indigo-800',
        className
      )}
      {...props}
    />
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };