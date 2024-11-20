import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setExtractedData } from '../../redux/dashboardSlice';
import Card from './Card';

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
      setError(null);
    }
  };

  const validateFiles = (files) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/pdf',
      'image/jpeg',
      'image/png',
    ];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setError(`Unsupported file format(s): ${invalidFiles.map(f => f.name).join(', ')}`);
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select files to upload');
      return;
    }

    if (!validateFiles(files)) {
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await axios.post('http://localhost:5000/api/upload/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      setUploading(false);
      setExtracting(true);

      if (response.data.success) {
        const newExtractedData = {
          customers: [],
          invoices: [],
          products: [],
          processedFiles: [],
        };

        response.data.data.forEach((fileData) => {
          if (fileData.extractedData) {
            newExtractedData.customers.push(...(fileData.extractedData.customers || []));
            newExtractedData.invoices.push(...(fileData.extractedData.invoices || []));
            newExtractedData.products.push(...(fileData.extractedData.products || []));
            newExtractedData.processedFiles.push(fileData.filename);
          }
        });

        dispatch(setExtractedData(newExtractedData));
        setSuccess(`Extracted data from ${response.data.filesProcessed} file(s)`);
      }

      setExtracting(false);
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || 'An error occurred during file upload or extraction');
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Upload Files for AI Extraction</h2>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".xlsx,.pdf,.jpg,.jpeg,.png"
            className="hidden"
            id="file-upload"
            disabled={uploading || extracting}
          />
          <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
            Choose files to upload
          </label>
          {files.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {files.map((file) => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          )}
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        {uploading ? (
          <div className="text-blue-500">Uploading...</div>
        ) : (
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={extracting || uploading}
          >
            Upload Files
          </button>
        )}
        {extracting && <div className="text-blue-500">Extracting data...</div>}
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default FileUpload;