import React from 'react';
import FileTable from './components/FileTable';
import files from './data/files.json';

const App = () => {
  return (
    <div>
      <h1>File Selection Table</h1>
      <FileTable files={files} />
    </div>
  );
};

export default App;
