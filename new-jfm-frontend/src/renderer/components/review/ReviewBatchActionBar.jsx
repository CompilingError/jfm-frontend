import { useEffect, useState } from 'react';
import { artistApi } from '../../api/artistApi.js';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './ReviewBatchActionBar.css';
import { useToast } from '../common/toast/ToastProvider.jsx';

function ReviewBatchActionBar({
    selectedCount,
    onSelectAll,
    onClearSelection,
    onAssignTag,
    onAssignArtist,
    onApproveSelected,
}) {
    const [tags, setTags] = useState([]);
    const [artists, setArtists] = useState([]);

    const [selectedTagId, setSelectedTagId] = useState('');
    const [selectedArtistId, setSelectedArtistId] = useState('');

    const [newTagName, setNewTagName] = useState('');
    const [newArtistName, setNewArtistName] = useState('');
    const toast = useToast();

    async function loadOptions() {
        try {
            const [loadedTags, loadedArtists] = await Promise.all([
                tagApi.list(),
                artistApi.list(),
            ]);

            setTags(loadedTags);
            setArtists(loadedArtists);
        } catch {
            toast.error(t('pages.review.batch.loadOptionsFailed'));
        }
    }

    async function handleAssignExistingTag() {
        if (!selectedTagId) {
            return;
        }

        const tag = tags.find((item) => String(item.id) === selectedTagId);

        if (!tag) {
            return;
        }

        onAssignTag(tag);
    }

    async function handleCreateAndAssignTag() {
        const trimmedName = newTagName.trim();

        if (!trimmedName) {
            return;
        }

        try {
            const createdTag = await tagApi.create(trimmedName);

            setTags((currentTags) => [...currentTags, createdTag]);
            setNewTagName('');
            onAssignTag(createdTag);
        } catch {
            toast.error(t('pages.review.batch.createTagFailed'));
        }
    }

    async function handleAssignExistingArtist() {
        if (!selectedArtistId) {
            return;
        }

        const artist = artists.find((item) => String(item.id) === selectedArtistId);

        if (!artist) {
            return;
        }

        onAssignArtist(artist);
    }

    async function handleCreateAndAssignArtist() {
        const trimmedName = newArtistName.trim();

        if (!trimmedName) {
            return;
        }

        try {
            const createdArtist = await artistApi.create(trimmedName);

            setArtists((currentArtists) => [...currentArtists, createdArtist]);
            setNewArtistName('');
            onAssignArtist(createdArtist);
        } catch {
            toast.error(t('pages.review.batch.createArtistFailed'));
        }
    }

    useEffect(() => {
        loadOptions();
    }, []);

    return (
        <section
            className="review-batch-action-bar"
            onClick={(event) => event.stopPropagation()}
        >
            <div className="review-batch-summary">
                <strong>
                    {t('pages.review.selectedCount', {
                        count: selectedCount,
                    })}
                </strong>

                <div className="review-batch-selection-buttons">
                    <button className="secondary-button" onClick={onSelectAll}>
                        {t('pages.review.selectAll')}
                    </button>

                    <button className="secondary-button" onClick={onClearSelection}>
                        {t('pages.review.clearSelection')}
                    </button>

                    <button
                        className="primary-button"
                        onClick={onApproveSelected}
                        disabled={selectedCount === 0}
                    >
                        {t('pages.review.batch.approveSelected')}
                    </button>
                </div>
            </div>

            <div className="review-batch-groups">
                <div className="review-batch-group">
                    <label>{t('pages.review.batch.tagLabel')}</label>

                    <div className="review-batch-row">
                        <select
                            value={selectedTagId}
                            onChange={(event) => setSelectedTagId(event.target.value)}
                        >
                            <option value="">
                                {t('pages.review.batch.selectExistingTag')}
                            </option>

                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.id}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>

                        <button
                            className="secondary-button"
                            onClick={handleAssignExistingTag}
                            disabled={selectedCount === 0}
                        >
                            {t('pages.review.batch.assign')}
                        </button>
                    </div>

                    <div className="review-batch-row">
                        <input
                            value={newTagName}
                            onChange={(event) => setNewTagName(event.target.value)}
                            placeholder={t('pages.review.batch.newTagPlaceholder')}
                        />

                        <button
                            className="secondary-button"
                            onClick={handleCreateAndAssignTag}
                            disabled={selectedCount === 0}
                        >
                            {t('pages.review.batch.createAndAssign')}
                        </button>
                    </div>
                </div>

                <div className="review-batch-group">
                    <label>{t('pages.review.batch.artistLabel')}</label>

                    <div className="review-batch-row">
                        <select
                            value={selectedArtistId}
                            onChange={(event) => setSelectedArtistId(event.target.value)}
                        >
                            <option value="">
                                {t('pages.review.batch.selectExistingArtist')}
                            </option>

                            {artists.map((artist) => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>

                        <button
                            className="secondary-button"
                            onClick={handleAssignExistingArtist}
                            disabled={selectedCount === 0}
                        >
                            {t('pages.review.batch.assign')}
                        </button>
                    </div>

                    <div className="review-batch-row">
                        <input
                            value={newArtistName}
                            onChange={(event) => setNewArtistName(event.target.value)}
                            placeholder={t('pages.review.batch.newArtistPlaceholder')}
                        />

                        <button
                            className="secondary-button"
                            onClick={handleCreateAndAssignArtist}
                            disabled={selectedCount === 0}
                        >
                            {t('pages.review.batch.createAndAssign')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ReviewBatchActionBar;