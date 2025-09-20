import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FiUpload, FiFile, FiCheck, FiX } from 'react-icons/fi';
import { fileService } from '../services/api';

const DropzoneContainer = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#007bff' : '#ddd'};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background-color: ${props => props.isDragActive ? '#f8f9fa' : 'white'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    border-color: #007bff;
    background-color: #f8f9fa;
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 48px;
  color: #6c757d;
  margin-bottom: 16px;
`;

const UploadText = styled.p`
  font-size: 16px;
  color: #6c757d;
  margin: 0;
`;

const FileList = styled.div`
  margin-top: 20px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: white;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const FileIcon = styled(FiFile)`
  margin-right: 12px;
  color: #6c757d;
`;

const FileName = styled.span`
  font-weight: 500;
  margin-right: 12px;
`;

const FileSize = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
`;

const StatusIcon = styled.div`
  margin-left: 12px;
`;

const ProgressBar = styled.div`
  width: 100px;
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-left: 12px;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #007bff;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

function FileUpload({ onUploadComplete }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0,
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);

    // Her dosyayı ayrı ayrı yükle
    for (const fileItem of newFiles) {
      try {
        // Upload başlat
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileItem.id ? { ...f, progress: 10 } : f)
        );

        const result = await fileService.uploadFile(fileItem.file);

        // Upload tamamlandı
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileItem.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            result 
          } : f)
        );

        // Ana bileşene bildir
        if (onUploadComplete) {
          onUploadComplete(result);
        }

      } catch (error) {
        console.error('Upload error:', error);
        setUploadingFiles(prev => 
          prev.map(f => f.id === fileItem.id ? { 
            ...f, 
            status: 'error', 
            error: error.message 
          } : f)
        );
      }
    }
  }, [onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (id) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div>
      <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <UploadIcon />
        {isDragActive ? (
          <UploadText>Dosyaları buraya bırakın...</UploadText>
        ) : (
          <UploadText>
            Dosyaları yüklemek için buraya sürükleyin veya tıklayın
            <br />
            <small>Desteklenen formatlar: Resim, PDF, Excel, CSV</small>
          </UploadText>
        )}
      </DropzoneContainer>

      {uploadingFiles.length > 0 && (
        <FileList>
          {uploadingFiles.map((fileItem) => (
            <FileItem key={fileItem.id}>
              <FileInfo>
                <FileIcon />
                <FileName>{fileItem.file.name}</FileName>
                <FileSize>{formatFileSize(fileItem.file.size)}</FileSize>
              </FileInfo>
              
              <FileStatus>
                {fileItem.status === 'uploading' && (
                  <ProgressBar>
                    <Progress progress={fileItem.progress} />
                  </ProgressBar>
                )}
                
                <StatusIcon>
                  {fileItem.status === 'completed' && (
                    <FiCheck color="#28a745" size={20} />
                  )}
                  {fileItem.status === 'error' && (
                    <FiX color="#dc3545" size={20} />
                  )}
                  {fileItem.status === 'uploading' && (
                    <div>%{fileItem.progress}</div>
                  )}
                </StatusIcon>

                {fileItem.status !== 'uploading' && (
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    style={{
                      marginLeft: '8px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6c757d',
                    }}
                  >
                    <FiX size={16} />
                  </button>
                )}
              </FileStatus>
            </FileItem>
          ))}
        </FileList>
      )}
    </div>
  );
}

export default FileUpload;