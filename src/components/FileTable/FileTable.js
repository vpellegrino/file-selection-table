import React, { useEffect, useRef } from 'react';
import styles from './FileTable.module.css';
import useFileSelection from './useFileSelection'; // Import the custom hook
import { formatPathAndDeviceInfo, isFileAvailable } from './helpers';

const FileTable = ({ files }) => {
  const selectAllCheckboxRef = useRef(null);

  const {
    pathsOfSelectedFiles,
    availableFilesCount,
    toggleFileSelection,
    selectAllAvailableFiles,
    deselectAllFiles,
  } = useFileSelection(files);

  useEffect(() => {
    if (pathsOfSelectedFiles.length === availableFilesCount) {
      selectAllCheckboxRef.current.checked = true;
      selectAllCheckboxRef.current.indeterminate = false;
    } else if (pathsOfSelectedFiles.length > 0) {
      selectAllCheckboxRef.current.checked = false;
      selectAllCheckboxRef.current.indeterminate = true;
    } else {
      selectAllCheckboxRef.current.checked = false;
      selectAllCheckboxRef.current.indeterminate = false;
    }
  }, [availableFilesCount, pathsOfSelectedFiles]);

  const handleSelectAll = () => {
    if (pathsOfSelectedFiles.length === availableFilesCount) {
      deselectAllFiles();
    } else {
      selectAllAvailableFiles();
    }
  };

  const handleDownload = () => {
    const filesByPaths = new Map(files.map((file) => [file.path, file]));
    const selectedFilePaths = pathsOfSelectedFiles.map((currentPath) =>
      formatPathAndDeviceInfo(filesByPaths, currentPath)
    );
    alert(selectedFilePaths.join('\n'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>
          {pathsOfSelectedFiles.length
            ? `Selected ${pathsOfSelectedFiles.length}`
            : 'None Selected'}
        </span>
        <button
          onClick={handleDownload}
          disabled={!pathsOfSelectedFiles.length}
        >
          Download Selected
        </button>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                ref={selectAllCheckboxRef}
                onChange={handleSelectAll}
                aria-label="select all available files"
              />
            </th>
            <th>Name</th>
            <th>Device</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const isSelected = pathsOfSelectedFiles.includes(file.path);
            const isDisabled = !isFileAvailable(file.status);

            return (
              <tr key={file.path} className={isSelected ? styles.selected : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFileSelection(file.path)}
                    disabled={isDisabled}
                    aria-label={`select the file ${file.name}`}
                  />
                </td>
                <td>{file.name}</td>
                <td>{file.device}</td>
                <td>{file.path}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
