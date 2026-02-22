// Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', isLoading = false, children, className = '', disabled, ...props }: ButtonProps) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  const sizes: Record<string, string> = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {children}
    </button>
  );
};

// Card.tsx
export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>{children}</div>
);
export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>
);
export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

// Badge.tsx
// export const Badge = ({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'; size?: 'sm' | 'md'; className?: string }) => {
//   const variants: Record<string, string> = { default: 'bg-gray-100 text-gray-800', success: 'bg-green-100 text-green-800', warning: 'bg-yellow-100 text-yellow-800', danger: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800' };
//     const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };

//   return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
// };


interface BadgeProps { children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; size?: 'sm' | 'md'; className?: string; }

export const Badge = ({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) => {
  const variants = { default: 'bg-gray-100 text-gray-800', success: 'bg-green-100 text-green-800', warning: 'bg-yellow-100 text-yellow-800', danger: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800', purple: 'bg-purple-100 text-purple-800' };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-sm' };
  return <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};


// Input.tsx
export const Input = ({ label, error, className = '', ...props }: { label?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
    <input className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'} ${className}`} {...props} />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Select.tsx
export const Select = ({ label, options, placeholder, className = '', ...props }: { label?: string; options: { value: string | number; label: string }[]; placeholder?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}{props.required && <span className="text-red-500 ml-1">*</span>}</label>}
    <select className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-200 focus:border-blue-500 bg-white ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// Loading.tsx
export const Loading = ({ text = 'Loading...' }: { text?: string }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 h-10 w-10" />
    {text && <p className="mt-4 text-gray-500">{text}</p>}
  </div>
);

// Modal.tsx
import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : 'unset'; return () => { document.body.style.overflow = 'unset'; }; }, [isOpen]);
  if (!isOpen) return null;
  const sizes: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"><div className="flex min-h-screen items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="text-lg font-semibold text-gray-900">{title}</h3><button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div></div>
  );
};

// Alert.tsx
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Alert = ({ children, variant = 'info', title }: { children: ReactNode; variant?: 'info' | 'success' | 'warning' | 'error'; title?: string }) => {
  const config: Record<string, { bg: string; icon: any }> = {
    info: { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: Info },
    success: { bg: 'bg-green-50 border-green-200 text-green-800', icon: CheckCircle },
    warning: { bg: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: AlertCircle },
    error: { bg: 'bg-red-50 border-red-200 text-red-800', icon: AlertCircle },
  };
  const { bg, icon: Icon } = config[variant];
  return (<div className={`p-4 rounded-lg border ${bg}`}><div className="flex items-start"><Icon className="w-5 h-5 flex-shrink-0 mt-0.5" /><div className="ml-3">{title && <h4 className="font-medium">{title}</h4>}<div className={`text-sm ${title ? 'mt-1' : ''}`}>{children}</div></div></div></div>);
};
export const EmptyState = ({ icon: Icon, title, description }: { icon?: any; title: string; description?: string }) => (
  <div className="py-12 text-center">
    {Icon && <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />}
    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
);