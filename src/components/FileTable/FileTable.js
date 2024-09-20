import React, { useState, useEffect, useRef } from 'react';
import styles from './FileTable.module.css';

const files = [
  {
    name: 'smss.exe',
    device: 'Stark',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
    status: 'scheduled',
  },
  {
    name: 'netsh.exe',
    device: 'Targaryen',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
    status: 'available',
  },
  {
    name: 'uxtheme.dll',
    device: 'Lannister',
    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
    status: 'available',
  },
  {
    name: 'cryptbase.dll',
    device: 'Martell',
    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll',
    status: 'scheduled',
  },
  {
    name: '7za.exe',
    device: 'Baratheon',
    path: '\\Device\\HarddiskVolume1\\temp\\7za.exe',
    status: 'scheduled',
  },
];

const FileTable = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    const availableFilesCount = files.filter(
      (file) => file.status === 'available'
    ).length;

    if (selectedFiles.length === availableFilesCount) {
      setSelectAll(true);
      selectAllCheckboxRef.current.indeterminate = false;
    } else if (selectedFiles.length > 0) {
      setSelectAll(false);
      selectAllCheckboxRef.current.indeterminate = true;
    } else {
      setSelectAll(false);
      selectAllCheckboxRef.current.indeterminate = false;
    }
  }, [selectedFiles]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(
        files
          .map((_, index) =>
            files[index].status === 'available' ? index : null
          )
          .filter((index) => index !== null)
      );
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedFiles.includes(index)) {
      setSelectedFiles(selectedFiles.filter((id) => id !== index));
    } else {
      setSelectedFiles([...selectedFiles, index]);
    }
  };

  const handleDownload = () => {
    const selectedFilePaths = selectedFiles.map(
      (index) => `Path: ${files[index].path}, Device: ${files[index].device}`
    );
    alert(selectedFilePaths.join('\n'));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>
          {selectedFiles.length
            ? `Selected ${selectedFiles.length}`
            : 'None Selected'}
        </span>
        <button onClick={handleDownload} disabled={!selectedFiles.length}>
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
                checked={selectAll}
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
          {files.map((file, index) => (
            <tr
              key={`${file.name}-${index}`}
              className={selectedFiles.includes(index) ? styles.selected : ''}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(index)}
                  title={`select-${file.name}`}
                  onChange={() => handleCheckboxChange(index)}
                  disabled={file.status !== 'available'}
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
