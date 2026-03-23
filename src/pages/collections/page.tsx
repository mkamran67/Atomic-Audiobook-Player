import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarCollapsed } from '../../hooks/useSidebarCollapsed';
import Sidebar from '../../components/feature/Sidebar';
import { mockCollections, Collection } from '../../mocks/collections';
import { libraryBooks } from '../../mocks/library';
import CollectionCard from './components/CollectionCard';
import CollectionDetail from './components/CollectionDetail';
import CreateCollectionModal from './components/CreateCollectionModal';

export default function CollectionsPage() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed();
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'home')      { navigate('/');            return; }
    if (tab === 'library')   { navigate('/library');     return; }
    if (tab === 'bookmarks') { navigate('/bookmarks');   return; }
    if (tab === 'settings')  { navigate('/settings');    return; }
  };

  const selectedCollection = selectedId ? collections.find((c) => c.id === selectedId) ?? null : null;

  function handleCreate(data: Omit<Collection, 'id' | 'createdAt'>) {
    const newCol: Collection = {
      ...data,
      id: `col-${Date.now()}`,
      createdAt: Date.now(),
    };
    setCollections((prev) => [newCol, ...prev]);
    setShowCreate(false);
    setSelectedId(newCol.id);
  }

  function handleUpdate(updated: Collection) {
    setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleDelete(id: string) {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setSelectedId(null);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <Sidebar
        activeTab="collections"
        onTabChange={handleTabChange}
        isCollapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-20 md:pt-8 min-w-0 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-52'
        }`}
      >
        {selectedCollection ? (
          /* ── Detail view ── */
          <CollectionDetail
            collection={selectedCollection}
            allBooks={libraryBooks}
            onBack={() => setSelectedId(null)}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ) : (
          /* ── List view ── */
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Collections</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Group books into series and play them end-to-end
                </p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="h-10 px-4 flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-add-line text-base"></i>
                </div>
                New Collection
              </button>
            </div>

            {/* How it works callout */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl px-5 py-4 mb-6 flex items-start gap-4">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                <i className="ri-information-line text-amber-500 dark:text-amber-400 text-base"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-0.5">How Collections work</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                  Group books into a series and press <strong className="text-gray-600 dark:text-gray-300">Play Collection</strong> to queue them in order.
                  The player will show <strong className="text-gray-600 dark:text-gray-300">Next in Queue</strong> as you finish each book.
                  Rename, reorder, or add books at any time.
                </p>
              </div>
            </div>

            {collections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-gray-900 rounded-2xl">
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20 mb-4">
                  <i className="ri-headphone-line text-3xl text-amber-300 dark:text-amber-700"></i>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">No collections yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  Create one to group your books into a playable series
                </p>
                <button
                  onClick={() => setShowCreate(true)}
                  className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Create your first collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {collections.map((col) => (
                  <CollectionCard
                    key={col.id}
                    collection={col}
                    allBooks={libraryBooks}
                    onOpen={() => setSelectedId(col.id)}
                    onPlay={() => setSelectedId(col.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showCreate && (
        <CreateCollectionModal
          allBooks={libraryBooks}
          onConfirm={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}
