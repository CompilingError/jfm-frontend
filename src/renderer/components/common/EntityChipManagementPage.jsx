import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from './toast/ToastProvider.jsx';
import { t } from '../../i18n/index.js';
import './EntityChipManagementPage.css';

function EntityChipManagementPage({
  title,
  description,
  createPlaceholder,
  emptyText,
  entityType,
  api,
}) {
  const navigate = useNavigate();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadItems() {
    setIsLoading(true);

    try {
      const loadedItems = await api.list();
      setItems(loadedItems);
    } catch (error) {
      console.error(`[${entityType} load failed]`, error);
      toast.error(t(`pages.${entityType}.loadFailed`));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate() {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      toast.warning(t(`pages.${entityType}.emptyName`));
      return;
    }

    setIsLoading(true);

    try {
      const createdItem = await api.create(trimmedName);

      setItems((currentItems) => [...currentItems, createdItem]);
      setNewName('');

      toast.success(
        t(`pages.${entityType}.createSuccess`, {
          name: createdItem.name,
        })
      );
    } catch (error) {
      console.error(`[${entityType} create failed]`, error);
      toast.error(t(`pages.${entityType}.createFailed`));
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartEdit(item) {
    setEditingItem(item);
    setEditingName(item.name);
    setContextMenu(null);
  }

  async function handleSaveEdit() {
    const trimmedName = editingName.trim();

    if (!editingItem || !trimmedName) {
      toast.warning(t(`pages.${entityType}.emptyName`));
      return;
    }

    setIsLoading(true);

    try {
      const updatedItem = await api.update(editingItem.id, {
        name: trimmedName,
      });

      setItems((currentItems) =>
        currentItems.map((item) => {
          if (item.id !== editingItem.id) {
            return item;
          }

          return updatedItem;
        })
      );

      setEditingItem(null);
      setEditingName('');

      toast.success(
        t(`pages.${entityType}.updateSuccess`, {
          name: updatedItem.name,
        })
      );
    } catch (error) {
      console.error(`[${entityType} update failed]`, error);
      toast.error(t(`pages.${entityType}.updateFailed`));
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenContextMenu(event, item) {
    event.preventDefault();

    setContextMenu({
      item,
      x: event.clientX,
      y: event.clientY,
    });
  }

  function handleSearchRelatedMovies() {
    if (!contextMenu?.item) {
      return;
    }

    const item = contextMenu.item;

    const searchParams = new URLSearchParams();

    if (entityType === 'tags') {
      searchParams.set('tagId', String(item.id));
      searchParams.set('tagName', item.name);
    }

    if (entityType === 'artists') {
      searchParams.set('artistId', String(item.id));
      searchParams.set('artistName', item.name);
    }

    setContextMenu(null);

    navigate(`/movies?${searchParams.toString()}`);
  }

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div
      className="entity-chip-page"
      onClick={() => setContextMenu(null)}
    >
      <header className="entity-chip-header">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <section className="entity-chip-create-card">
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleCreate();
            }
          }}
          placeholder={createPlaceholder}
        />

        <button
          className="primary-button"
          onClick={handleCreate}
          disabled={isLoading}
        >
          {t('common.add')}
        </button>
      </section>

      {items.length === 0 && !isLoading ? (
        <div className="entity-chip-empty">{emptyText}</div>
      ) : (
        <section className="entity-chip-list">
          {items.map((item) => (
            <button
              key={item.id}
              className="entity-chip"
              onClick={(event) => {
                event.stopPropagation();
                handleStartEdit(item);
              }}
              onContextMenu={(event) => handleOpenContextMenu(event, item)}
              title={item.name}
            >
              {item.name}
            </button>
          ))}
        </section>
      )}

      {editingItem && (
        <div
          className="entity-edit-backdrop"
          onClick={() => setEditingItem(null)}
        >
          <section
            className="entity-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>
              {t(`pages.${entityType}.editTitle`, {
                name: editingItem.name,
              })}
            </h2>

            <input
              value={editingName}
              onChange={(event) => setEditingName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSaveEdit();
                }
              }}
              autoFocus
            />

            <div className="entity-edit-actions">
              <button
                className="secondary-button"
                onClick={() => setEditingItem(null)}
              >
                {t('common.cancel')}
              </button>

              <button
                className="primary-button"
                onClick={handleSaveEdit}
                disabled={isLoading}
              >
                {t('common.save')}
              </button>
            </div>
          </section>
        </div>
      )}

      {contextMenu && (
        <div
          className="entity-context-menu"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button onClick={handleSearchRelatedMovies}>
            {t(`pages.${entityType}.searchRelatedMovies`)}
          </button>
        </div>
      )}
    </div>
  );
}

export default EntityChipManagementPage;