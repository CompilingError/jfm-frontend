import { artistApi } from '../api/artistApi.js';
import EntityChipManagementPage from '../components/common/EntityChipManagementPage.jsx';
import { t } from '../i18n/index.js';

function ArtistManagementPage() {
  return (
    <EntityChipManagementPage
      title={t('pages.artists.title')}
      description={t('pages.artists.description')}
      createPlaceholder={t('pages.artists.createPlaceholder')}
      emptyText={t('pages.artists.empty')}
      entityType="artists"
      api={artistApi}
    />
  );
}

export default ArtistManagementPage;