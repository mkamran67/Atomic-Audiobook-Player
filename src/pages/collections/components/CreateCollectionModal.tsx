import { useState } from 'react';
import { Collection } from '../../../types/collection';
import { LibraryBook } from '../../../types/library';
import CoverImage from '../../../components/base/CoverImage';

interface CreateCollectionModalProps {
  allBooks: LibraryBook[];
  onConfirm: (collection: Omit<Collection, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function CreateCollectionModal({ allBooks, onConfirm, onCancel }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filtered = allBooks.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBook = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim() || selectedIds.length === 0) return;
    onConfirm({ name: name.trim(), description: description.trim(), bookIds: selectedIds });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">New Collection</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 pb-4 flex-shrink-0 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Empyrean Series"
              maxLength={80}
              className="w-full h-10 px-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about this collection…"
              maxLength={200}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700 resize-none"
            />
          </div>
        </div>

        {/* Book picker */}
        <div className="px-6 pb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Books
            </label>
            {selectedIds.length > 0 && (
              <span className="text-xs text-amber-500 font-medium">{selectedIds.length} selected</span>
            )}
          </div>
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter books…"
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-700"
            />
          </div>
        </div>

        {/* Book list */}
        <div className="overflow-y-auto flex-1 px-6 pb-2">
          <div className="space-y-1 py-1">
            {filtered.map((book) => {
              const checked = selectedIds.includes(book.id);
              const order = selectedIds.indexOf(book.id) + 1;
              return (
                <div
                  key={book.id}
                  onClick={() => toggleBook(book.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    checked
                      ? 'bg-amber-50 dark:bg-amber-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Order badge or checkbox */}
                  <div className={`w-6 h-6 flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold transition-colors ${
                    checked
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {checked ? order : <i className="ri-add-line text-sm"></i>}
                  </div>
                  <div className="w-8 h-11 rounded-md overflow-hidden flex-shrink-0">
                    <CoverImage src={book.cover} alt={book.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">{book.title}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{book.author}</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                    book.status === 'completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' :
                    book.status === 'in-progress' ? 'bg-orange-50 text-orange-500 dark:bg-orange-900/20 dark:text-orange-400' :
                    'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                  }`}>
                    {book.status === 'completed' ? 'Done' : book.status === 'in-progress' ? 'Listening' : 'New'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || selectedIds.length === 0}
            className="flex-1 h-10 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Collection
          </button>
        </div>

      </div>
    </div>
  );
}
