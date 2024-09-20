import React, { useState, useEffect, useRef } from 'react';
import styles from './FileTable.module.css';
import { isFileAvailable } from './helper';

const FileTable = ({ files }) => {
  const [pathsOfSelectedFiles, setPathsOfSelectedFiles] = useState([]);
  const [allAvailableFilesSelected, setAllAvailableFilesSelected] =
    useState(false);

  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    const availableFilesCount = files.filter((file) =>
      isFileAvailable(file.status)
    ).length;

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
  }, [files, pathsOfSelectedFiles]);

  const handleSelectAll = () => {
    if (allAvailableFilesSelected) {
      setPathsOfSelectedFiles([]);
    } else {
      setPathsOfSelectedFiles(
        files.reduce((acc, file) => {
          if (isFileAvailable(file.status)) {
            acc.push(file.path);
          }
          return acc;
        }, [])
      );
    }
  };

  const handleCheckboxChange = (path) => {
    if (pathsOfSelectedFiles.includes(path)) {
      setPathsOfSelectedFiles(
        pathsOfSelectedFiles.filter((currentPath) => currentPath !== path)
      );
    } else {
      setPathsOfSelectedFiles([...pathsOfSelectedFiles, path]);
    }
  };

  const handleDownload = () => {
    const filesByPaths = new Map(files.map((file) => [file.path, file]));

    const selectedFilePaths = pathsOfSelectedFiles.map((currentPath) => {
      const { path, device } = filesByPaths.get(currentPath);
      return `Path: ${path}, Device: ${device}`;
    });
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
          {files.map((file) => (
            <tr
              key={`${file.path}`}
              className={
                pathsOfSelectedFiles.includes(file.path) ? styles.selected : ''
              }
            >
              <td>
                <input
                  type="checkbox"
                  checked={pathsOfSelectedFiles.includes(file.path)}
                  title={`select-${file.name}`}
                  onChange={() => handleCheckboxChange(file.path)}
                  disabled={!isFileAvailable(file.status)}
                />
              </td>
              <td>{file.name}</td>
              <td>{file.device}</td>
              <td>{file.path}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
