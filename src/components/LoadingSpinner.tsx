import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({
  size = 'md',
  text,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-3',
    lg: 'w-10 h-10 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div
        className={`${sizeClasses} border-teal-200 border-t-teal-600 rounded-full animate-spin`}
        role="status"
        aria-label="Memuat data..."
      />
      {text && <p className="mt-3 text-sm text-slate-500 font-medium">{text}</p>}
    </div>
  );
};

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}> = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="text-center py-10 px-4 max-w-sm mx-auto">
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
