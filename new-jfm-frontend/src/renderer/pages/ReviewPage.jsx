import { useState } from 'react';
import FileCard from '../components/file/FileCard.jsx';
import ReviewBatchActionBar from '../components/review/ReviewBatchActionBar.jsx';
import { t } from '../i18n/index.js';
import './ReviewPage.css';
import ReviewEditModal from '../components/review/ReviewEditModal.jsx';
import { importPendingFileToBackend } from '../services/reviewImportService.js';
import { useToast } from '../components/common/toast/ToastProvider.jsx';

function ReviewPage() {
  const [pendingFiles, setPendingFiles] = useState([]);
  const [expandedFileId, setExpandedFileId] = useState(null);
  const [selectedFileIds, setSelectedFileIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingFile, setEditingFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const toast = useToast();

  async function handleScanPendingFiles(event) {
    event?.stopPropagation?.();

    setIsScanning(true);
    setErrorMessage('');
    setExpandedFileId(null);
    setSelectedFileIds([]);

    try {
      const scannedFiles = await window.reviewAPI.scanPendingFiles();
      setPendingFiles(scannedFiles);

      toast.success(
        t('pages.review.scanSuccess', {
          count: scannedFiles.length,
        })
      );
    } catch {
      setErrorMessage(t('pages.review.scanFailed'));
      toast.error(t('pages.review.scanFailed'));
    } finally {
      setIsScanning(false);
    }
  }

  function handlePageClick() {
    setExpandedFileId(null);
  }

  function handleCardToggle(fileId) {
    if (isSelectionMode) {
      handleToggleSelected(fileId);
      return;
    }

    setExpandedFileId((currentId) => {
      if (currentId === fileId) {
        return null;
      }

      return fileId;
    });
  }

  function handleLikeChange(fileId, nextLikeValue) {
    setPendingFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (file.id !== fileId) {
          return file;
        }

        return {
          ...file,
          like: nextLikeValue,
        };
      })
    );
  }

  function handleSaveEditedFile(updatedFile) {
    setPendingFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (file.id !== updatedFile.id) {
          return file;
        }

        return updatedFile;
      })
    );

    setEditingFile(null);
    toast.success(t('pages.review.editSuccess'));
  }

  async function handleApproveFile(file) {
    setIsImporting(true);
    setErrorMessage('');

    try {
      await importPendingFileToBackend(file);

      setPendingFiles((currentFiles) =>
        currentFiles.filter((currentFile) => currentFile.id !== file.id)
      );

      setSelectedFileIds((currentIds) =>
        currentIds.filter((id) => id !== file.id)
      );

      setExpandedFileId(null);

      toast.success(
        t('pages.review.importSuccess', {
          name: file.name,
        })
      );
    } catch {
      setErrorMessage(t('pages.review.importFailed'));
      toast.error(t('pages.review.importFailed'));
    } finally {
      setIsImporting(false);
    }
  }

  async function handleApproveSelectedFiles() {
    if (selectedFileIds.length === 0) {
      toast.warning(t('pages.review.noSelection'));
      return;
    }

    setIsImporting(true);
    setErrorMessage('');

    const selectedFiles = pendingFiles.filter((file) =>
      selectedFileIds.includes(file.id)
    );

    const importedFileIds = [];

    try {
      for (const file of selectedFiles) {
        await importPendingFileToBackend(file);
        importedFileIds.push(file.id);
      }

      setPendingFiles((currentFiles) =>
        currentFiles.filter((file) => !importedFileIds.includes(file.id))
      );

      setSelectedFileIds([]);
      setExpandedFileId(null);

      toast.success(
        t('pages.review.batchImportSuccess', {
          count: importedFileIds.length,
        })
      );
    } catch {
      if (importedFileIds.length > 0) {
        setPendingFiles((currentFiles) =>
          currentFiles.filter((file) => !importedFileIds.includes(file.id))
        );

        setSelectedFileIds((currentIds) =>
          currentIds.filter((id) => !importedFileIds.includes(id))
        );

        toast.warning(
          t('pages.review.batchImportPartialSuccess', {
            count: importedFileIds.length,
          })
        );
      } else {
        toast.error(t('pages.review.importFailed'));
      }

      setErrorMessage(t('pages.review.importFailed'));
    } finally {
      setIsImporting(false);
    }
  }

  function mergeByIdOrName(currentItems = [], newItem) {
    const alreadyExists = currentItems.some((item) => {
      if (newItem.id && item.id) {
        return item.id === newItem.id;
      }

      return item.name === newItem.name;
    });

    if (alreadyExists) {
      return currentItems;
    }

    return [...currentItems, newItem];
  }

  function handleAssignTagToSelectedFiles(tag) {
    if (selectedFileIds.length === 0) {
      toast.warning(t('pages.review.noSelection'));
      return;
    }

    setPendingFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (!selectedFileIds.includes(file.id)) {
          return file;
        }

        return {
          ...file,
          tags: mergeByIdOrName(file.tags, tag),
          defaultTagNames: Array.isArray(file.defaultTagNames)
            ? file.defaultTagNames.filter((tagName) => tagName !== tag.name)
            : [],
        };
      })
    );

    toast.success(
      t('pages.review.assignTagSuccess', {
        name: tag.name,
        count: selectedFileIds.length,
      })
    );
  }

  function handleAssignArtistToSelectedFiles(artist) {
    if (selectedFileIds.length === 0) {
      toast.warning(t('pages.review.noSelection'));
      return;
    }

    setPendingFiles((currentFiles) =>
      currentFiles.map((file) => {
        if (!selectedFileIds.includes(file.id)) {
          return file;
        }

        return {
          ...file,
          artists: mergeByIdOrName(file.artists, artist),
        };
      })
    );

    toast.success(
      t('pages.review.assignArtistSuccess', {
        name: artist.name,
        count: selectedFileIds.length,
      })
    );
  }

  function handleToggleSelectionMode(event) {
    event.stopPropagation();

    setExpandedFileId(null);

    setIsSelectionMode((currentValue) => {
      const nextValue = !currentValue;

      if (!nextValue) {
        setSelectedFileIds([]);
      }

      return nextValue;
    });
  }

  function handleToggleSelected(fileId) {
    setSelectedFileIds((currentIds) => {
      if (currentIds.includes(fileId)) {
        return currentIds.filter((id) => id !== fileId);
      }

      return [...currentIds, fileId];
    });
  }

  function handleSelectAll(event) {
    event.stopPropagation();

    const allFileIds = pendingFiles.map((file) => file.id);
    setSelectedFileIds(allFileIds);
  }

  function handleClearSelection(event) {
    event.stopPropagation();
    setSelectedFileIds([]);
  }

  const hasPendingFiles = pendingFiles.length > 0;
  const selectedCount = selectedFileIds.length;

  return (
    <div className="review-page" onClick={handlePageClick}>
      <header className="review-page-header">
        <div>
          <h1>{t('pages.review.title')}</h1>
          <p>{t('pages.review.description')}</p>
        </div>

        <div className="review-header-actions">
          {hasPendingFiles && (
            <button
              className="secondary-button"
              onClick={handleToggleSelectionMode}
            >
              {isSelectionMode
                ? t('pages.review.exitSelectionMode')
                : t('pages.review.enterSelectionMode')}
            </button>
          )}

          <button
            className="primary-button"
            onClick={handleScanPendingFiles}
            disabled={isScanning}
          >
            {isScanning
              ? t('pages.review.scanning')
              : t('pages.review.scanButton')}
          </button>
        </div>
      </header>

      {errorMessage && <p className="review-error">{errorMessage}</p>}

      <p className="review-count">
        {t('pages.review.pendingCount', {
          count: pendingFiles.length,
        })}
        {isImporting && (
          <p className="review-importing">
            {t('pages.review.importing')}
          </p>
        )}
      </p>



      {isSelectionMode && (
        <ReviewBatchActionBar
          selectedCount={selectedCount}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onAssignTag={handleAssignTagToSelectedFiles}
          onAssignArtist={handleAssignArtistToSelectedFiles}
          onApproveSelected={handleApproveSelectedFiles}
        />
      )}

      {pendingFiles.length === 0 ? (
        <div className="review-empty">{t('pages.review.empty')}</div>
      ) : (
        <div className="file-card-grid">
          {pendingFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              isExpanded={expandedFileId === file.id}
              isSelectionMode={isSelectionMode}
              isSelected={selectedFileIds.includes(file.id)}
              onToggle={() => handleCardToggle(file.id)}
              onSelectionChange={() => handleToggleSelected(file.id)}
              onLikeChange={(nextLikeValue) =>
                handleLikeChange(file.id, nextLikeValue)
              }
              onEdit={setEditingFile}
              onApprove={handleApproveFile}
            />
          ))}
        </div>
      )}

      {editingFile && (
        <ReviewEditModal
          file={editingFile}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveEditedFile}
        />
      )}
    </div>
  );
}

export default ReviewPage;