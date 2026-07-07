import { useEffect, useState } from 'react';
import { t } from '../i18n/index.js';
import './SettingsPage.css';
import BackendStatusCard from '../components/settings/BackendStatusCard.jsx';
import { useToast } from '../components/common/toast/ToastProvider.jsx';

function SettingsPage() {
  const [config, setConfig] = useState({
    watchedFolders: [],
    allowedExtensions: [],
    pendingReviewOnNewFile: true,
  });

  const [newExtension, setNewExtension] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toast = useToast();

  async function loadConfig() {
    try {
      const loadedConfig = await window.settingsAPI.getConfig();
      setConfig(loadedConfig);
    } catch {
      toast.error(t('settings.messages.loadFailed'));
    }
  }

  async function handleAddWatchedFolder() {
    try {
      const updatedConfig = await window.settingsAPI.addWatchedFolder();

      if (!updatedConfig) {
        return;
      }

      setConfig(updatedConfig);
      toast.success(t('settings.messages.addFolderSuccess'));
    } catch {
      toast.error(t('settings.messages.addFolderFailed'));
    }
  }

  async function handleRemoveWatchedFolder(folderPath) {
    try {
      const updatedConfig = await window.settingsAPI.removeWatchedFolder(
        folderPath
      );

      setConfig(updatedConfig);
      toast.success(t('settings.messages.removeFolderSuccess'));
    } catch {
      toast.error(t('settings.messages.removeFolderFailed'));
    }
  }

  async function handleAddAllowedExtension() {
    const trimmedExtension = newExtension.trim().toLowerCase();

    if (!trimmedExtension.startsWith('.')) {
      toast.warning(t('settings.allowedExtensions.invalidMessage'));
      return;
    }

    try {
      const updatedConfig = await window.settingsAPI.addAllowedExtension(
        trimmedExtension
      );

      setConfig(updatedConfig);
      setNewExtension('');
      toast.success(t('settings.messages.addExtensionSuccess'));
    } catch (error) {
      console.error('[settings add extension failed]', error);
      toast.error(t('settings.messages.addExtensionFailed'));
    }
  }

  async function handleRemoveAllowedExtension(extension) {
    try {
      const updatedConfig = await window.settingsAPI.removeAllowedExtension(
        extension
      );

      setConfig(updatedConfig);
      toast.success(t('settings.messages.removeExtensionSuccess'));
    } catch {
      toast.error(t('settings.messages.removeExtensionFailed'));
    }
  }

  async function handlePendingReviewChange(event) {
    const nextValue = event.target.checked;

    try {
      const updatedConfig =
        await window.settingsAPI.updatePendingReviewOnNewFile(nextValue);

      setConfig(updatedConfig);
      toast.success(t('settings.messages.pendingReviewUpdateSuccess'));
    } catch {
      toast.error(t('settings.messages.pendingReviewUpdateFailed'));
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.description')}</p>
      </header>

      <BackendStatusCard />

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>{t('settings.watchedFolders.title')}</h2>
            <p>{t('settings.watchedFolders.description')}</p>
          </div>

          <button className="primary-button" onClick={handleAddWatchedFolder}>
            {t('settings.watchedFolders.addButton')}
          </button>
        </div>

        {config.watchedFolders.length === 0 ? (
          <p className="empty-text">{t('settings.watchedFolders.empty')}</p>
        ) : (
          <ul className="folder-list">
            {config.watchedFolders.map((folderPath) => (
              <li className="folder-item" key={folderPath}>
                <span className="folder-path">{folderPath}</span>

                <button
                  className="danger-button"
                  onClick={() => handleRemoveWatchedFolder(folderPath)}
                >
                  {t('common.remove')}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>{t('settings.allowedExtensions.title')}</h2>
            <p>{t('settings.allowedExtensions.description')}</p>
          </div>
        </div>

        <form className="extension-form" onSubmit={handleAddAllowedExtension}>
          <input
            value={newExtension}
            onChange={(event) => setNewExtension(event.target.value)}
            placeholder={t('settings.allowedExtensions.inputPlaceholder')}
          />

          <button className="primary-button" type="submit">
            {t('settings.allowedExtensions.addButton')}
          </button>
        </form>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <div className="extension-list">
          {config.allowedExtensions.map((extension) => (
            <span className="extension-chip" key={extension}>
              {extension}

              <button
                className="chip-remove-button"
                onClick={() => handleRemoveAllowedExtension(extension)}
                aria-label={t(
                  'settings.allowedExtensions.removeAriaLabel',
                  { extension }
                )}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2>{t('settings.pendingReview.title')}</h2>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={config.pendingReviewOnNewFile}
            onChange={handlePendingReviewChange}
          />

          <span>{t('settings.pendingReview.checkboxLabel')}</span>
        </label>

        <p className="hint-text">{t('settings.pendingReview.hint')}</p>
      </section>
    </div>
  );
}

export default SettingsPage;