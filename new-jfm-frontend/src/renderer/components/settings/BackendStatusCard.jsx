import { useEffect, useState } from 'react';
import { tagApi } from '../../api/tagApi.js';
import { t } from '../../i18n/index.js';
import './BackendStatusCard.css';

function BackendStatusCard() {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  async function checkBackendStatus() {
    setStatus('checking');
    setMessage('');

    try {
      await tagApi.list();

      setStatus('connected');
      setMessage(t('settings.backendStatus.connected'));
    } catch {
      setStatus('disconnected');
      setMessage(t('settings.backendStatus.disconnected'));
    }
  }

  useEffect(() => {
    checkBackendStatus();
  }, []);

  return (
    <section className="settings-section">
      <div className="backend-status-card">
        <div>
          <h2>{t('settings.backendStatus.title')}</h2>
          <p>{t('settings.backendStatus.description')}</p>
        </div>

        <div className={`backend-status-badge ${status}`}>
          {status === 'checking'
            ? t('settings.backendStatus.checking')
            : message}
        </div>

        <button className="primary-button" onClick={checkBackendStatus}>
          {t('settings.backendStatus.retry')}
        </button>
      </div>
    </section>
  );
}

export default BackendStatusCard;