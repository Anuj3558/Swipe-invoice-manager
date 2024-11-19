import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { processFile } from './redux/fileSlice';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);

    // Process each file
    for (const file of uploadedFiles) {
      dispatch(processFile(file));
    }
  };

  return (
    <div className="file-upload">
      <input 
        type="file" 
        multiple 
        accept=".pdf,.xlsx,.xls,.csv,image/*"
        onChange={handleFileUpload}
      />
      <div>
        {files.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;