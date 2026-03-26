import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/feature/Sidebar';
import CoverImage from '../../components/base/CoverImage';
import Toast from '../../components/base/Toast';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import { useAppDispatch, useAppSelector } from '../../store';
import { bulkUpdateBooks } from '../../store/librarySlice';
import type { LibraryBook } from '../../types/library';

type EditableField = 'author' | 'genre' | 'year' | 'narrator';

const FIELDS: { key: EditableField; label: string; type: 'text' | 'number' }[] = [
  { key: 'author',   label: 'Author',   type: 'text'   },
  { key: 'genre',    label: 'Genre',    type: 'text'   },
  { key: 'year',     label: 'Year',     type: 'number' },
  { key: 'narrator', label: 'Narrator', type: 'text'   },
];

export default function BulkEdit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const books = useAppSelector((s) => s.library.books);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  // Edit fields
  const [enabledFields, setEnabledFields] = useState<Record<EditableField, boolean>>({
    author: false, genre: false, year: false, narrator: false,
  });
  const [values, setValues] = useState<Record<EditableField, string>>({
    author: '', genre: '', year: '', narrator: '',
  });

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const handleTabChange = (tab: string) => {
    if (tab === 'home')        { navigate('/');            return; }
    if (tab === 'library')     { navigate('/library');     return; }
    if (tab === 'settings')    { navigate('/settings');    return; }
    if (tab === 'bookmarks')   { navigate('/bookmarks');   return; }
    if (tab === 'collections') { navigate('/collections'); return; }
  };

  // Filtered books
  const filtered = useMemo(() => {
    if (!search.trim()) return books;
    const q = search.toLowerCase();
    return books.filter(
      (b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q),
    );
  }, [books, search]);

  // Toggle selection
  const toggleBook = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => setSelectedIds(new Set(filtered.map((b) => b.id)));
  const deselectAll = () => setSelectedIds(new Set());

  // Toggle field enabled
  const toggleField = (key: EditableField) => {
    setEnabledFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setFieldValue = (key: EditableField, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Apply
  const anyFieldEnabled = Object.values(enabledFields).some(Boolean);
  const canApply = selectedIds.size > 0 && anyFieldEnabled;

  const handleApply = async () => {
    const updates: Partial<Pick<LibraryBook, 'author' | 'genre' | 'year' | 'narrator'>> = {};
    if (enabledFields.author)   updates.author   = values.author;
    if (enabledFields.genre)    updates.genre    = values.genre;
    if (enabledFields.year)     updates.year     = parseInt(values.year, 10) || 0;
    if (enabledFields.narrator) updates.narrator = values.narrator;

    const ids = Array.from(selectedIds);
    dispatch(bulkUpdateBooks({ ids, updates }));

    // Compute the updated array for persistence
    const updatedBooks = books.map((book) => {
      if (selectedIds.has(book.id)) return { ...book, ...updates };
      return book;
    });

    try {
      await window.electronAPI.saveLibrary(updatedBooks);
    } catch {
      // ignore persist failure
    }

    setToast(`Updated ${ids.length} book${ids.length === 1 ? '' : 's'}`);
    setSelectedIds(new Set());
    setEnabledFields({ author: false, genre: false, year: false, narrator: false });
    setValues({ author: '', genre: '', year: '', narrator: '' });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab="bulk-edit"
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={`flex-1 pt-20 md:pt-8 px-4 sm:px-6 lg:px-10 pb-12 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Edit</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select books and edit their metadata in bulk
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Book Selection ──────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Search + actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <button
                onClick={selectAll}
                className="px-3 py-2.5 text-xs font-medium rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-2.5 text-xs font-medium rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
              >
                Deselect
              </button>
            </div>

            {/* Selection count */}
            {selectedIds.size > 0 && (
              <div className="mb-3 text-sm font-medium text-purple-600 dark:text-purple-400">
                {selectedIds.size} book{selectedIds.size === 1 ? '' : 's'} selected
              </div>
            )}

            {/* Book list */}
            <div className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">
                  {books.length === 0 ? 'No books in library' : 'No books match your search'}
                </div>
              )}
              {filtered.map((book) => {
                const isSelected = selectedIds.has(book.id);
                return (
                  <button
                    key={book.id}
                    onClick={() => toggleBook(book.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                      isSelected
                        ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-400 dark:ring-purple-600'
                        : 'bg-white dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-purple-500 border-purple-500 text-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isSelected && <i className="ri-check-line text-xs"></i>}
                    </div>

                    {/* Cover */}
                    <CoverImage
                      src={book.cover}
                      alt={book.title}
                      className="w-10 h-10 rounded-lg flex-shrink-0 object-cover"
                    />

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {book.author || 'Unknown author'}
                        {book.genre ? ` \u00B7 ${book.genre}` : ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Edit Fields Panel ──────────────────────────────── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-8 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                Edit Fields
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                Enable a field and set its value. Only enabled fields will be updated.
              </p>

              <div className="space-y-4">
                {FIELDS.map(({ key, label, type }) => (
                  <div key={key}>
                    <label className="flex items-center gap-2 mb-1.5 cursor-pointer select-none">
                      <button
                        onClick={() => toggleField(key)}
                        className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                          enabledFields[key]
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {enabledFields[key] && <i className="ri-check-line text-[10px]"></i>}
                      </button>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </label>
                    <input
                      type={type}
                      value={values[key]}
                      onChange={(e) => setFieldValue(key, e.target.value)}
                      disabled={!enabledFields[key]}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors ${
                        enabledFields[key]
                          ? 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-purple-400`}
                    />
                  </div>
                ))}
              </div>

              {/* Apply button */}
              <button
                onClick={handleApply}
                disabled={!canApply}
                className={`w-full mt-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  canApply
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedIds.size > 0
                  ? `Apply to ${selectedIds.size} book${selectedIds.size === 1 ? '' : 's'}`
                  : 'Select books to edit'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
