import { Navigate, Route, Routes } from 'react-router';

import HomePage from './pages/HomePage.jsx';
import MovieListPage from './pages/MovieListPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import TagManagementPage from './pages/TagManagementPage.jsx';
import ArtistManagementPage from './pages/ArtistManagementPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ToastProvider from './components/common/toast/ToastProvider.jsx';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Navigate to="movies" replace />} />
          <Route path="movies" element={<MovieListPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="tags" element={<TagManagementPage />} />
          <Route path="artists" element={<ArtistManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;