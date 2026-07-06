import { useEffect, useState } from 'react';

export function useCover(file) {
  const [coverUrl, setCoverUrl] = useState('');
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [coverStatus, setCoverStatus] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadCover() {
      if (!file?.path || !window.coverAPI) {
        setCoverUrl('');
        setCoverStatus('unavailable');
        return;
      }

      setIsLoadingCover(true);

      try {
        const result = await window.coverAPI.getCover({
          filePath: file.path,
          extension: file.extension,
          size: file.size,
          modifiedTime: file.modifiedTime,
        });

        if (!isCancelled) {
          setCoverUrl(result.coverUrl ?? '');
          setCoverStatus(result.status ?? '');
        }
      } catch {
        if (!isCancelled) {
          setCoverUrl('');
          setCoverStatus('failed');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingCover(false);
        }
      }
    }

    loadCover();

    return () => {
      isCancelled = true;
    };
  }, [file?.path, file?.size, file?.modifiedTime, file?.extension]);

  return {
    coverUrl,
    isLoadingCover,
    coverStatus,
  };
}