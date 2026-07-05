import { useEffect, useState } from 'react';
import { t } from '../i18n/index.js';
import './SettingsPage.css';

function SettingsPage() {
  const [config, setConfig] = useState({
    watchedFolders: [],
    allowedExtensions: [],
    pendingReviewOnNewFile: true,
  });

  const [newExtension, setNewExtension] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function loadConfig() {
    const loadedConfig = await window.settingsAPI.getConfig();
    setConfig(loadedConfig);
  }

  async function handleAddFolder() {
    const updatedConfig = await window.settingsAPI.addWatchedFolder();
    setConfig(updatedConfig);
  }

  async function handleRemoveFolder(folderPath) {
    const updatedConfig = await window.settingsAPI.removeWatchedFolder(
      folderPath
    );

    setConfig(updatedConfig);
  }

  async function handleAddExtension(event) {
    event.preventDefault();

    setErrorMessage('');

    try {
      const updatedConfig = await window.settingsAPI.addAllowedExtension(
        newExtension
      );

      setConfig(updatedConfig);
      setNewExtension('');
    } catch {
      setErrorMessage(t('settings.allowedExtensions.invalidMessage'));
    }
  }

  async function handleRemoveExtension(extension) {
    const updatedConfig = await window.settingsAPI.removeAllowedExtension(
      extension
    );

    setConfig(updatedConfig);
  }

  async function handlePendingReviewChange(event) {
    const updatedConfig =
      await window.settingsAPI.updatePendingReviewOnNewFile(
        event.target.checked
      );

    setConfig(updatedConfig);
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

      <section className="settings-section">
        <div className="settings-section-header">
          <div>
            <h2>{t('settings.watchedFolders.title')}</h2>
            <p>{t('settings.watchedFolders.description')}</p>
          </div>

          <button className="primary-button" onClick={handleAddFolder}>
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
                  onClick={() => handleRemoveFolder(folderPath)}
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

        <form className="extension-form" onSubmit={handleAddExtension}>
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
                onClick={() => handleRemoveExtension(extension)}
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