import { useMemo, useState } from 'react';
import './SearchableChipInput.css';

function getDefaultId(item) {
  return item.id;
}

function getDefaultLabel(item) {
  return item.name;
}

function SearchableChipInput({
  label,
  placeholder,
  options,
  selectedItems,
  onChange,
  onCreate,
  maxResults = 6,
  getOptionId = getDefaultId,
  getOptionLabel = getDefaultLabel,
}) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();

  const selectedIds = useMemo(() => {
    return new Set(selectedItems.map((item) => String(getOptionId(item))));
  }, [selectedItems, getOptionId]);

  const filteredOptions = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return options
      .filter((option) => {
        const id = String(getOptionId(option));

        if (selectedIds.has(id)) {
          return false;
        }

        return getOptionLabel(option).toLowerCase().includes(normalizedQuery);
      })
      .slice(0, maxResults);
  }, [
    options,
    normalizedQuery,
    selectedIds,
    maxResults,
    getOptionId,
    getOptionLabel,
  ]);

  function addItem(item) {
    onChange([...selectedItems, item]);
    setQuery('');
    setIsFocused(true);
  }

  function removeItem(targetItem) {
    const targetId = String(getOptionId(targetItem));

    onChange(
      selectedItems.filter((item) => String(getOptionId(item)) !== targetId)
    );
  }

  async function createItem() {
    if (!onCreate || !query.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      const createdItem = await onCreate(query.trim());
      onChange([...selectedItems, createdItem]);
      setQuery('');
    } finally {
      setIsCreating(false);
    }
  }

  async function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (filteredOptions.length > 0) {
        addItem(filteredOptions[0]);
        return;
      }

      if (onCreate && query.trim()) {
        await createItem();
      }

      return;
    }

    if (event.key === 'Backspace' && !query && selectedItems.length > 0) {
      onChange(selectedItems.slice(0, -1));
    }

    if (event.key === 'Escape') {
      setIsFocused(false);
    }
  }

  const shouldShowDropdown =
    isFocused && normalizedQuery && (filteredOptions.length > 0 || onCreate);

  return (
    <label className="searchable-chip-input">
      {label && <span className="searchable-chip-label">{label}</span>}

      <div className="searchable-chip-box">
        {selectedItems.map((item) => (
          <button
            key={getOptionId(item)}
            type="button"
            className="searchable-chip"
            onClick={() => removeItem(item)}
            title={getOptionLabel(item)}
          >
            <span>{getOptionLabel(item)}</span>
            <strong>×</strong>
          </button>
        ))}

        <input
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedItems.length === 0 ? placeholder : ''}
        />
      </div>

      {shouldShowDropdown && (
        <div className="searchable-chip-dropdown">
          {filteredOptions.map((option) => (
            <button
              key={getOptionId(option)}
              type="button"
              className="searchable-chip-result"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => addItem(option)}
            >
              {getOptionLabel(option)}
            </button>
          ))}

          {filteredOptions.length === 0 && onCreate && (
            <button
              type="button"
              className="searchable-chip-result create"
              onMouseDown={(event) => event.preventDefault()}
              onClick={createItem}
              disabled={isCreating}
            >
              {isCreating ? '创建中...' : `新建：${query.trim()}`}
            </button>
          )}
        </div>
      )}
    </label>
  );
}

export default SearchableChipInput;