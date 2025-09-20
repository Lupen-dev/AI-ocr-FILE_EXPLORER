import React from 'react';
import styled from 'styled-components';
import { FiX, FiDownload, FiFile, FiCalendar, FiHardDrive } from 'react-icons/fi';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FileInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
`;

const InfoTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoValue = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  word-break: break-all;
`;

const OCRSection = styled.div`
  margin-top: 24px;
`;

const OCRTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
`;

const OCRContent = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const NoOCRMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
`;

const ActionButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &.primary {
    background-color: #3b82f6;
    color: white;

    &:hover {
      background-color: #2563eb;
    }
  }

  &.secondary {
    background-color: #f3f4f6;
    color: #374151;

    &:hover {
      background-color: #e5e7eb;
    }
  }
`;

const HighlightedText = styled.span`
  background-color: #fef3c7;
  padding: 2px 4px;
  border-radius: 3px;
`;

function FileDetailModal({ file, onClose, onDownload, searchQuery = '' }) {
  if (!file) return null;

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

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case '.pdf':
        return '📄';
      case '.xlsx':
      case '.xls':
        return '📊';
      case '.csv':
        return '📈';
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.bmp':
      case '.tiff':
        return '🖼️';
      default:
        return '📁';
    }
  };

  const highlightSearchText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <HighlightedText key={index}>{part}</HighlightedText>
      ) : (
        part
      )
    );
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <span>{getFileTypeIcon(file.file_type)}</span>
            {file.original_name}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <FileInfoGrid>
            <InfoCard>
              <InfoTitle>
                <FiFile size={16} />
                Dosya Bilgileri
              </InfoTitle>
              <InfoValue><strong>Orijinal Ad:</strong> {file.original_name}</InfoValue>
              <InfoValue><strong>Sistem Adı:</strong> {file.file_name}</InfoValue>
              <InfoValue><strong>Dosya Türü:</strong> {file.file_type}</InfoValue>
              <InfoValue><strong>İşlem ID:</strong> {file.id}</InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoTitle>
                <FiHardDrive size={16} />
                Teknik Detaylar
              </InfoTitle>
              <InfoValue><strong>Boyut:</strong> {formatFileSize(file.file_size)}</InfoValue>
              <InfoValue><strong>Yüklenme Tarihi:</strong> {formatDate(file.upload_date)}</InfoValue>
            </InfoCard>
          </FileInfoGrid>

          <OCRSection>
            <OCRTitle>📝 OCR İçeriği</OCRTitle>
            {file.ocr_content ? (
              <OCRContent>
                {highlightSearchText(file.ocr_content, searchQuery)}
              </OCRContent>
            ) : (
              <NoOCRMessage>
                <FiFile size={48} color="#d1d5db" />
                <p>Bu dosya için OCR içeriği bulunamadı</p>
                <small>
                  {file.file_type === '.pdf' ? 'PDF metin içeriği mevcut olabilir' :
                   file.file_type.includes('.xls') || file.file_type === '.csv' ? 'Excel/CSV içeriği işlenmiş olabilir' :
                   'Resim dosyası için OCR işlemi gerekli'}
                </small>
              </NoOCRMessage>
            )}
          </OCRSection>

          <ActionButtons>
            <ActionButton className="primary" onClick={() => onDownload(file)}>
              <FiDownload size={16} />
              Dosyayı İndir
            </ActionButton>
            <ActionButton className="secondary" onClick={onClose}>
              Kapat
            </ActionButton>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
}

export default FileDetailModal;