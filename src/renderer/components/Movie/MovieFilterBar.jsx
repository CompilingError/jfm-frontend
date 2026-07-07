import { useEffect, useMemo, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import CollapsibleFilterPanel from '../common/CollapsibleFilterPanel.jsx';
import SearchableChipInput from '../common/SearchableChipInput.jsx';
import SortSelect from '../common/SortSelect.jsx';
import { t } from '../../i18n/index.js';
import './MovieFilterBar.css';

const DEFAULT_LOCAL_FILTERS = {
  name: '',
  tagMode: 'ALL',
  artistMode: 'ANY',
  like: '',
  minFreshVal: '',
  maxFreshVal: '',
  sort: 'id,desc',
};

function normalizeFilters(localFilters, selectedTags, selectedArtists) {
  return {
    name: localFilters.name.trim() || undefined,
    tagIds: selectedTags.map((tag) => tag.id),
    tagMode: localFilters.tagMode,
    artistIds: selectedArtists.map((artist) => artist.id),
    artistMode: localFilters.artistMode,
    like:
      localFilters.like === ''
        ? undefined
        : localFilters.like === 'true',
    minFreshVal:
      localFilters.minFreshVal === ''
        ? undefined
        : Number(localFilters.minFreshVal),
    maxFreshVal:
      localFilters.maxFreshVal === ''
        ? undefined
        : Number(localFilters.maxFreshVal),
    sort: localFilters.sort,
  };
}

function MovieFilterBar({ isLoading, filterSeed, onApply, onClear }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [tags, setTags] = useState([]);
  const [artists, setArtists] = useState([]);

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);

  const [localFilters, setLocalFilters] = useState(DEFAULT_LOCAL_FILTERS);

  const sortOptions = useMemo(
    () => [
      { value: 'id,desc', label: t('movieFilter.sortNewest') },
      { value: 'id,asc', label: t('movieFilter.sortOldest') },
      { value: 'name,asc', label: t('movieFilter.sortNameAsc') },
      { value: 'name,desc', label: t('movieFilter.sortNameDesc') },
      { value: 'freshVal,desc', label: t('movieFilter.sortFreshHigh') },
      { value: 'freshVal,asc', label: t('movieFilter.sortFreshLow') },
      { value: 'like,desc', label: t('movieFilter.sortLikedFirst') },
    ],
    []
  );

  async function loadOptions() {
    const [loadedTags, loadedArtists] = await Promise.all([
      tagApi.list(),
      artistApi.list(),
    ]);

    setTags(loadedTags);
    setArtists(loadedArtists);
  }

  function updateField(fieldName, value) {
    setLocalFilters((currentFilters) => ({
      ...currentFilters,
      [fieldName]: value,
    }));
  }

  function handleApply() {
    onApply(normalizeFilters(localFilters, selectedTags, selectedArtists));
  }

  function handleClear() {
    setLocalFilters(DEFAULT_LOCAL_FILTERS);
    setSelectedTags([]);
    setSelectedArtists([]);
    onClear();
  }

  function handleSortChange(value) {
    const nextFilters = {
      ...localFilters,
      sort: value,
    };

    setLocalFilters(nextFilters);
    onApply(normalizeFilters(nextFilters, selectedTags, selectedArtists));
  }

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (!filterSeed) {
      return;
    }

    setSelectedTags(filterSeed.selectedTags ?? []);
    setSelectedArtists(filterSeed.selectedArtists ?? []);
  }, [filterSeed]);

  return (
    <CollapsibleFilterPanel
      isExpanded={isExpanded}
      leftContent={
        <SortSelect
          label={t('movieFilter.sort')}
          value={localFilters.sort}
          options={sortOptions}
          onChange={handleSortChange}
          disabled={isLoading}
        />
      }
      rightContent={
        <button
          className="secondary-button"
          onClick={() => setIsExpanded((currentValue) => !currentValue)}
        >
          {isExpanded ? t('movieFilter.collapse') : t('movieFilter.expand')}
        </button>
      }
    >
      <div className="movie-filter-primary-row">
        <label className="movie-filter-field name-field">
          <span>{t('movieFilter.name')}</span>
          <input
            value={localFilters.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder={t('movieFilter.namePlaceholder')}
          />
        </label>

        <SearchableChipInput
          label={t('movieFilter.tags')}
          placeholder={t('movieFilter.tagPlaceholder')}
          options={tags}
          selectedItems={selectedTags}
          onChange={setSelectedTags}
        />

        <SearchableChipInput
          label={t('movieFilter.artists')}
          placeholder={t('movieFilter.artistPlaceholder')}
          options={artists}
          selectedItems={selectedArtists}
          onChange={setSelectedArtists}
        />

        <label className="movie-filter-field like-field">
          <span>{t('movieFilter.like')}</span>
          <select
            value={localFilters.like}
            onChange={(event) => updateField('like', event.target.value)}
          >
            <option value="">{t('movieFilter.likeAll')}</option>
            <option value="true">{t('common.yes')}</option>
            <option value="false">{t('common.no')}</option>
          </select>
        </label>
      </div>

      <div className="movie-filter-advanced-row">
        <label className="movie-filter-field">
          <span>{t('movieFilter.tagMode')}</span>
          <select
            value={localFilters.tagMode}
            onChange={(event) => updateField('tagMode', event.target.value)}
          >
            <option value="ALL">{t('movieFilter.modeAll')}</option>
            <option value="ANY">{t('movieFilter.modeAny')}</option>
          </select>
        </label>

        <label className="movie-filter-field">
          <span>{t('movieFilter.artistMode')}</span>
          <select
            value={localFilters.artistMode}
            onChange={(event) => updateField('artistMode', event.target.value)}
          >
            <option value="ALL">{t('movieFilter.modeAll')}</option>
            <option value="ANY">{t('movieFilter.modeAny')}</option>
          </select>
        </label>

        <label className="movie-filter-field">
          <span>{t('movieFilter.minFreshVal')}</span>
          <input
            type="number"
            value={localFilters.minFreshVal}
            onChange={(event) => updateField('minFreshVal', event.target.value)}
          />
        </label>

        <label className="movie-filter-field">
          <span>{t('movieFilter.maxFreshVal')}</span>
          <input
            type="number"
            value={localFilters.maxFreshVal}
            onChange={(event) => updateField('maxFreshVal', event.target.value)}
          />
        </label>

        <div className="movie-filter-actions">
          <button
            className="secondary-button"
            onClick={handleClear}
            disabled={isLoading}
          >
            {t('movieFilter.clear')}
          </button>

          <button
            className="primary-button"
            onClick={handleApply}
            disabled={isLoading}
          >
            {t('movieFilter.apply')}
          </button>
        </div>
      </div>
    </CollapsibleFilterPanel>
  );
}

export default MovieFilterBar;