import { useState, useMemo } from 'react';
import { isFileAvailable, getPathsForAllAvailableFiles } from './helpers';

const useFileSelection = (files) => {
  const [pathsOfSelectedFiles, setPathsOfSelectedFiles] = useState([]);

  const availableFilesCount = useMemo(
    () => files.filter((file) => isFileAvailable(file.status)).length,
    [files]
  );

  const toggleFileSelection = (path) => {
    setPathsOfSelectedFiles((prevSelected) =>
      prevSelected.includes(path)
        ? prevSelected.filter((currentPath) => currentPath !== path)
        : [...prevSelected, path]
    );
  };

  const selectAllAvailableFiles = () => {
    setPathsOfSelectedFiles(getPathsForAllAvailableFiles(files));
  };

  const deselectAllFiles = () => {
    setPathsOfSelectedFiles([]);
  };

  return {
    pathsOfSelectedFiles,
    availableFilesCount,
    toggleFileSelection,
    selectAllAvailableFiles,
    deselectAllFiles,
  };
};

export default useFileSelection;
