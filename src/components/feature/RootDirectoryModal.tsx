interface RootDirectoryModalProps {
  directories: string[];
  onAdd: () => void;
  onRemove: (path: string) => void;
  onScan: () => void;
  onClose: () => void;
}

export default function RootDirectoryModal({
  directories,
  onAdd,
  onRemove,
  onScan,
  onClose,
}: RootDirectoryModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 mx-auto mb-4">
          <i className="ri-folder-add-line text-2xl text-purple-500 dark:text-purple-400"></i>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-bold text-gray-800 dark:text-white text-center mb-1">
          Add Audiobook Directory
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
          Choose folders where your audiobooks are stored. You can add multiple directories.
        </p>

        {/* Directory list */}
        {directories.length > 0 && (
          <div className="mb-4 space-y-2 max-h-48 overflow-y-auto scrollbar-styled">
            {directories.map((dir) => (
              <div
                key={dir}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <i className="ri-folder-3-line text-purple-500 dark:text-purple-400 flex-shrink-0"></i>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1" title={dir}>
                  {dir}
                </span>
                <button
                  onClick={() => onRemove(dir)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer flex-shrink-0"
                >
                  <i className="ri-close-line text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onAdd}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <i className="ri-folder-add-line text-base"></i>
            Add Folder
          </button>
          {directories.length > 0 && (
            <button
              onClick={onScan}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <i className="ri-refresh-line text-base"></i>
              Scan Library
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full h-11 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {directories.length > 0 ? 'Done' : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
}
