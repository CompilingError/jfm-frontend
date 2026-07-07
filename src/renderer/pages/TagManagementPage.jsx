import { tagApi } from '../api/tagApi.js';
import EntityChipManagementPage from '../components/common/EntityChipManagementPage.jsx';
import { t } from '../i18n/index.js';

function TagManagementPage() {
  return (
    <EntityChipManagementPage
      title={t('pages.tags.title')}
      description={t('pages.tags.description')}
      createPlaceholder={t('pages.tags.createPlaceholder')}
      emptyText={t('pages.tags.empty')}
      entityType="tags"
      api={tagApi}
    />
  );
}

export default TagManagementPage;