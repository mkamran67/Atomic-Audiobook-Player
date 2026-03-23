interface Props {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-sm mx-4 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">

        {/* Icon + header */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4 text-center">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 mb-4">
            <i className="ri-alert-line text-2xl text-red-400"></i>
          </div>
          <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-all cursor-pointer whitespace-nowrap"
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
