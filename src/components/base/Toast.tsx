import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export default function Toast({ message, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter  = setTimeout(() => setVisible(true),  10);
    const exit   = setTimeout(() => setVisible(false), 2400);
    const remove = setTimeout(() => onDismiss(),       2800);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
      clearTimeout(remove);
    };
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gray-900 dark:bg-white rounded-2xl text-sm font-medium pointer-events-none transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div className="w-4 h-4 flex items-center justify-center text-amber-400 dark:text-amber-500 flex-shrink-0">
        <i className="ri-checkbox-circle-fill text-base"></i>
      </div>
      <span className="text-white dark:text-gray-900 whitespace-nowrap">{message}</span>
    </div>
  );
}
