import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiDownload, FiTrash2, FiFile, FiEye } from 'react-icons/fi';
import { fileService } from '../services/api';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

const SearchButton = styled.button`
  padding: 12px 16px;
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #0056b3;
  }
`;

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

const FileCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const FileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const FileIcon = styled(FiFile)`
  margin-right: 12px;
  color: #6c757d;
  font-size: 24px;
`;

const FileName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInfo = styled.div`
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 12px;
`;

const FileActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &.primary {
    background-color: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background-color: #0056b3;
    }
  }

  &.danger {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

const OCRContent = styled.div`
  margin-top: 12px;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  color: #6c757d;
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LoadMore = styled.button`
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #5a6268;
  }

  &:disabled {
    background-color: #e9ecef;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
`;

function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const loadFiles = async (query = '', reset = false) => {
    setLoading(true);
    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fileService.getFiles(query, 50, currentOffset);
      
      if (reset) {
        setFiles(response.files);
        setOffset(50);
      } else {
        setFiles(prev => [...prev, ...response.files]);
        setOffset(prev => prev + 50);
      }
      
      setHasMore(response.files.length === 50);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles('', true);
  }, [refreshTrigger]);

  const handleSearch = () => {
    setOffset(0);
    loadFiles(searchQuery, true);
  };

  const handleDownload = async (file) => {
    try {
      await fileService.downloadFile(file.id);
    } catch (error) {
      console.error('Download error:', error);
      alert('Dosya indirme hatası: ' + error.message);
    }
  };

  const handleDelete = async (file) => {
    if (window.confirm(`"${file.original_name}" dosyasını silmek istediğinizden emin misiniz?`)) {
      try {
        await fileService.deleteFile(file.id);
        setFiles(prev => prev.filter(f => f.id !== file.id));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Dosya silme hatası: ' + error.message);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  return (
    <Container>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Dosya adı veya içeriğinde arama yapın..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SearchButton onClick={handleSearch}>
          <FiSearch />
        </SearchButton>
      </SearchContainer>

      {files.length === 0 && !loading ? (
        <EmptyState>
          <FiFile size={64} color="#ddd" />
          <h3>Henüz dosya yok</h3>
          <p>Yukarıdan dosya yükleyerek başlayın.</p>
        </EmptyState>
      ) : (
        <>
          <FileGrid>
            {files.map((file) => (
              <FileCard key={file.id}>
                <FileHeader>
                  <FileIcon />
                  <FileName title={file.original_name}>
                    {file.original_name}
                  </FileName>
                </FileHeader>
                
                <FileInfo>
                  <div>Boyut: {formatFileSize(file.file_size)}</div>
                  <div>Tür: {file.file_type}</div>
                  <div>Tarih: {formatDate(file.upload_date)}</div>
                  <div>ID: {file.id}</div>
                </FileInfo>

                {file.ocr_content && (
                  <OCRContent>
                    <strong>OCR İçeriği:</strong><br />
                    {file.ocr_content.substring(0, 100)}
                    {file.ocr_content.length > 100 && '...'}
                  </OCRContent>
                )}

                <FileActions>
                  <ActionButton 
                    className="primary"
                    onClick={() => handleDownload(file)}
                  >
                    <FiDownload size={14} />
                    İndir
                  </ActionButton>
                  
                  <ActionButton 
                    className="danger"
                    onClick={() => handleDelete(file)}
                  >
                    <FiTrash2 size={14} />
                    Sil
                  </ActionButton>
                </FileActions>
              </FileCard>
            ))}
          </FileGrid>

          {hasMore && (
            <LoadMore 
              onClick={() => loadFiles(searchQuery, false)}
              disabled={loading}
            >
              {loading ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
            </LoadMore>
          )}
        </>
      )}
    </Container>
  );
}

export default FileList;