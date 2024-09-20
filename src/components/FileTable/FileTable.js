import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './FileTable.module.css';
import {
  formatPathAndDeviceInfo,
  getPathsForAllAvailableFiles,
  isFileAvailable,
} from './helpers';

const FileTable = ({ files }) => {
  const [pathsOfSelectedFiles, setPathsOfSelectedFiles] = useState([]);
  const [allAvailableFilesSelected, setAllAvailableFilesSelected] =
    useState(false);

  const selectAllCheckboxRef = useRef(null);

  const availableFilesCount = useMemo(
    () => files.filter((file) => isFileAvailable(file.status)).length,
    [files]
  );

  const filesByPaths = useMemo(
    () => new Map(files.map((file) => [file.path, file])),
    [files]
  );

  useEffect(() => {
    if (pathsOfSelectedFiles.length === availableFilesCount) {
      setAllAvailableFilesSelected(true);
      selectAllCheckboxRef.current.indeterminate = false;
    } else if (pathsOfSelectedFiles.length > 0) {
      setAllAvailableFilesSelected(false);
      selectAllCheckboxRef.current.indeterminate = true;
    } else {
      setAllAvailableFilesSelected(false);
      selectAllCheckboxRef.current.indeterminate = false;
    }
  }, [availableFilesCount, pathsOfSelectedFiles]);

  const handleSelectAll = () => {
    if (allAvailableFilesSelected) {
      setPathsOfSelectedFiles([]);
    } else {
      setPathsOfSelectedFiles(getPathsForAllAvailableFiles(files));
    }
  };

  const handleCheckboxChange = (path) => {
    setPathsOfSelectedFiles((prevSelected) =>
      prevSelected.includes(path)
        ? prevSelected.filter((currentPath) => currentPath !== path)
        : [...prevSelected, path]
    );
  };

  const handleDownload = () => {
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
                checked={allAvailableFilesSelected}
                title="select all"
                onChange={handleSelectAll}
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
                    onChange={() => handleCheckboxChange(file.path)}
                    disabled={isDisabled}
                    title={`select-${file.name}`}
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
