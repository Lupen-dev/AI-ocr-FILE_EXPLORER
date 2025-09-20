import React, { useState } from 'react';
import styled from 'styled-components';
import { FiFile, FiImage, FiFileText, FiGrid, FiList, FiFolder, FiChevronRight, FiChevronDown } from 'react-icons/fi';

const ExplorerContainer = styled.div`
  display: flex;
  height: 600px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: white;
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #e5e7eb;
  background: #f9fafb;
  overflow-y: auto;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
`;

const ViewButton = styled.button`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f3f4f6'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
`;

const ListView = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FileItem = styled.div`
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  }

  ${props => props.selected && `
    border-color: #3b82f6;
    background-color: #eff6ff;
  `}
`;

const ListFileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  ${props => props.selected && `
    background-color: #eff6ff;
    border-left: 3px solid #3b82f6;
  `}
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 20px;
`;

const FileName = styled.div`
  font-weight: 500;
  font-size: 0.875rem;
  color: #111827;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const FolderTree = styled.div`
  padding: 16px;
`;

const FolderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }

  ${props => props.selected && `
    background-color: #3b82f6;
    color: white;
  `}
`;

const FolderIcon = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
`;

const FolderName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const PreviewArea = styled.div`
  width: 300px;
  border-left: 1px solid #e5e7eb;
  background: #fafafa;
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
`;

const PreviewContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #6b7280;
`;

const BreadcrumbItem = styled.span`
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
  }
`;

function FileExplorer({ files, onFileSelect, selectedFile, searchQuery }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showPreview, setShowPreview] = useState(true);

  // Dosyaları türüne göre klasörle
  const organizeFiles = (files) => {
    const folders = {
      all: { name: 'Tüm Dosyalar', files: files, icon: '📁' },
      images: { name: 'Resimler', files: [], icon: '🖼️' },
      documents: { name: 'Belgeler', files: [], icon: '📄' },
      spreadsheets: { name: 'Tablolar', files: [], icon: '📊' }
    };

    files.forEach(file => {
      if (['.jpg', '.jpeg', '.png', '.bmp', '.tiff'].includes(file.file_type)) {
        folders.images.files.push(file);
      } else if (file.file_type === '.pdf') {
        folders.documents.files.push(file);
      } else if (['.xlsx', '.xls', '.csv'].includes(file.file_type)) {
        folders.spreadsheets.files.push(file);
      }
    });

    return folders;
  };

  const folders = organizeFiles(files);
  const currentFiles = folders[selectedFolder]?.files || [];

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case '.pdf':
        return <FiFileText color="#ef4444" size={24} />;
      case '.xlsx':
      case '.xls':
      case '.csv':
        return <FiFile color="#10b981" size={24} />;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.bmp':
      case '.tiff':
        return <FiImage color="#3b82f6" size={24} />;
      default:
        return <FiFile color="#6b7280" size={24} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const highlightSearchText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} style={{ backgroundColor: '#fef3c7', padding: '2px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <ExplorerContainer>
      {/* Sidebar - Folder Tree */}
      <Sidebar>
        <FolderTree>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
            Klasörler
          </h4>
          {Object.entries(folders).map(([key, folder]) => (
            <FolderItem
              key={key}
              selected={selectedFolder === key}
              onClick={() => setSelectedFolder(key)}
            >
              <FolderIcon>
                <span style={{ fontSize: '16px' }}>{folder.icon}</span>
              </FolderIcon>
              <FolderName>{folder.name}</FolderName>
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af' }}>
                {folder.files.length}
              </span>
            </FolderItem>
          ))}
        </FolderTree>
      </Sidebar>

      {/* Main Content Area */}
      <MainArea>
        {/* Toolbar */}
        <Toolbar>
          <div>
            <Breadcrumb>
              <BreadcrumbItem onClick={() => setSelectedFolder('all')}>
                Tüm Dosyalar
              </BreadcrumbItem>
              {selectedFolder !== 'all' && (
                <>
                  <FiChevronRight size={12} />
                  <BreadcrumbItem>{folders[selectedFolder]?.name}</BreadcrumbItem>
                </>
              )}
            </Breadcrumb>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {currentFiles.length} dosya
            </div>
          </div>
          
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewButton>
          </ViewToggle>
        </Toolbar>

        {/* Content Area */}
        <ContentArea>
          {viewMode === 'grid' ? (
            <GridView>
              {currentFiles.map((file) => (
                <FileItem
                  key={file.id}
                  selected={selectedFile?.id === file.id}
                  onClick={() => onFileSelect(file)}
                >
                  <FileIcon>
                    {getFileIcon(file.file_type)}
                  </FileIcon>
                  <FileName title={file.original_name}>
                    {highlightSearchText(file.original_name, searchQuery)}
                  </FileName>
                  <FileInfo>
                    {formatFileSize(file.file_size)} • {formatDate(file.upload_date)}
                  </FileInfo>
                </FileItem>
              ))}
            </GridView>
          ) : (
            <ListView>
              {currentFiles.map((file) => (
                <ListFileItem
                  key={file.id}
                  selected={selectedFile?.id === file.id}
                  onClick={() => onFileSelect(file)}
                >
                  <div style={{ marginRight: '12px' }}>
                    {getFileIcon(file.file_type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '2px' }}>
                      {highlightSearchText(file.original_name, searchQuery)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {formatFileSize(file.file_size)} • {formatDate(file.upload_date)} • {file.file_type}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {file.id}
                  </div>
                </ListFileItem>
              ))}
            </ListView>
          )}

          {currentFiles.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#9ca3af' 
            }}>
              <FiFolder size={48} />
              <p style={{ margin: '12px 0 0 0' }}>Bu klasörde dosya yok</p>
            </div>
          )}
        </ContentArea>
      </MainArea>

      {/* Preview Area */}
      {showPreview && selectedFile && (
        <PreviewArea>
          <PreviewHeader>
            <div style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '8px' }}>
              Önizleme
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
              {selectedFile.original_name}
            </div>
          </PreviewHeader>
          
          <PreviewContent>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>Dosya Bilgileri</h4>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.5' }}>
                <div>Boyut: {formatFileSize(selectedFile.file_size)}</div>
                <div>Tür: {selectedFile.file_type}</div>
                <div>Tarih: {formatDate(selectedFile.upload_date)}</div>
                <div>ID: {selectedFile.id}</div>
              </div>
            </div>

            {selectedFile.ocr_content && (
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>OCR İçeriği</h4>
                <div style={{ 
                  fontSize: '0.75rem', 
                  lineHeight: '1.5', 
                  background: '#f9fafb', 
                  padding: '12px', 
                  borderRadius: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {highlightSearchText(selectedFile.ocr_content, searchQuery)}
                </div>
              </div>
            )}
          </PreviewContent>
        </PreviewArea>
      )}
    </ExplorerContainer>
  );
}

export default FileExplorer;