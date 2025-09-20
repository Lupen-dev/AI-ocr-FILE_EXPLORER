import React, { useState } from 'react';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiMaximize } from 'react-icons/fi';

// PDF.js worker'ını ayarla
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewContainer = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 600px;
  display: flex;
  flex-direction: column;
`;

const PreviewHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
`;

const PreviewTitle = styled.div`
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PreviewControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ControlButton = styled.button`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0 8px;
`;

const PreviewContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  overflow: auto;
  background: #f3f4f6;
`;

const PDFContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #6b7280;
  font-size: 0.875rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 500px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TextPreview = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-height: 500px;
  overflow-y: auto;
`;

const UnsupportedPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #6b7280;
  text-align: center;
`;

function FilePreview({ file, onDownload, searchQuery }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!file) {
    return (
      <PreviewContainer>
        <PreviewContent>
          <LoadingMessage>Önizleme için bir dosya seçin</LoadingMessage>
        </PreviewContent>
      </PreviewContainer>
    );
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    setError('PDF yüklenemedi');
    setLoading(false);
    console.error('PDF Load Error:', error);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  const downloadFile = () => {
    if (onDownload) {
      onDownload(file);
    }
  };

  const getFileUrl = () => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${API_BASE_URL}/download/${file.id}`;
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

  const renderPreview = () => {
    switch (file.file_type) {
      case '.pdf':
        return (
          <PDFContainer>
            <Document
              file={getFileUrl()}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<LoadingMessage>PDF yükleniyor...</LoadingMessage>}
              error={<ErrorMessage>PDF yüklenemedi. Dosya bozuk olabilir.</ErrorMessage>}
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </PDFContainer>
        );

      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.bmp':
      case '.tiff':
        return (
          <ImagePreview 
            src={getFileUrl()} 
            alt={file.original_name}
            onError={() => setError('Resim yüklenemedi')}
          />
        );

      case '.xlsx':
      case '.xls':
      case '.csv':
        return (
          <TextPreview>
            <h4 style={{ margin: '0 0 16px 0', color: '#111827' }}>
              📊 {file.original_name}
            </h4>
            {file.ocr_content ? (
              <div>
                {highlightSearchText(file.ocr_content, searchQuery)}
              </div>
            ) : (
              <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                Excel/CSV içeriği işleniyor...
              </div>
            )}
          </TextPreview>
        );

      default:
        return (
          <UnsupportedPreview>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <div style={{ fontWeight: '500', marginBottom: '8px' }}>
              Önizleme desteklenmiyor
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              Bu dosya türü için önizleme mevcut değil
            </div>
            {file.ocr_content && (
              <div style={{ marginTop: '16px', maxWidth: '400px' }}>
                <div style={{ fontWeight: '500', marginBottom: '8px', color: '#374151' }}>
                  OCR İçeriği:
                </div>
                <TextPreview style={{ maxHeight: '150px', fontSize: '0.75rem' }}>
                  {highlightSearchText(file.ocr_content, searchQuery)}
                </TextPreview>
              </div>
            )}
          </UnsupportedPreview>
        );
    }
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>
          📄 {file.original_name}
        </PreviewTitle>
        
        <PreviewControls>
          {file.file_type === '.pdf' && numPages && (
            <>
              <ControlButton onClick={previousPage} disabled={pageNumber <= 1}>
                <FiChevronLeft size={16} />
              </ControlButton>
              
              <PageInfo>
                {pageNumber} / {numPages}
              </PageInfo>
              
              <ControlButton onClick={nextPage} disabled={pageNumber >= numPages}>
                <FiChevronRight size={16} />
              </ControlButton>
              
              <div style={{ width: '1px', height: '20px', background: '#d1d5db', margin: '0 8px' }} />
              
              <ControlButton onClick={zoomOut} disabled={scale <= 0.5}>
                <FiZoomOut size={16} />
              </ControlButton>
              
              <PageInfo>{Math.round(scale * 100)}%</PageInfo>
              
              <ControlButton onClick={zoomIn} disabled={scale >= 2.0}>
                <FiZoomIn size={16} />
              </ControlButton>
              
              <div style={{ width: '1px', height: '20px', background: '#d1d5db', margin: '0 8px' }} />
            </>
          )}
          
          <ControlButton onClick={downloadFile}>
            <FiDownload size={16} />
            İndir
          </ControlButton>
        </PreviewControls>
      </PreviewHeader>

      <PreviewContent>
        {error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          renderPreview()
        )}
      </PreviewContent>
    </PreviewContainer>
  );
}

export default FilePreview;