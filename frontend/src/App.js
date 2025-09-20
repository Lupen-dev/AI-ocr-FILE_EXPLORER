import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import FileExplorer from './components/FileExplorer';
import FilePreview from './components/FilePreview';
import SearchBar from './components/SearchBar';
import { fileService } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: white;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 300;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1.1rem;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const ViewButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  background: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #3b82f6;
    ${props => !props.active && 'background-color: #f8fafc;'}
  }
`;

const ExplorerLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const NetworkInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
`;

const NetworkTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #007bff;
`;

const NetworkText = styled.p`
  margin: 5px 0;
  color: #6c757d;
  font-size: 14px;
`;

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentView, setCurrentView] = useState('explorer'); // 'explorer' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUploadComplete = (result) => {
    console.log('Upload completed:', result);
    // FileList'i yenilemek için trigger'ı güncelle
    setRefreshTrigger(prev => prev + 1);
    loadFiles();
  };

  const loadFiles = async (searchParams = { query: '', fileTypes: [], searchIn: ['fileName', 'ocrContent'] }) => {
    setLoading(true);
    try {
      const response = await fileService.getFiles(searchParams.query, 100, 0);
      setFiles(response.files);
      setSearchQuery(searchParams.query);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDownload = async (file) => {
    try {
      await fileService.downloadFile(file.id);
    } catch (error) {
      console.error('Download error:', error);
      alert('Dosya indirme hatası: ' + error.message);
    }
  };

  React.useEffect(() => {
    loadFiles();
  }, [refreshTrigger]);

  // Network bilgilerini al
  const getNetworkInfo = () => {
    const hostname = window.location.hostname;
    const port = window.location.port || '3000';
    const protocol = window.location.protocol;
    
    return {
      currentUrl: `${protocol}//${hostname}:${port}`,
      localUrl: `${protocol}//localhost:${port}`,
      lanUrl: `${protocol}//${hostname}:${port}`,
    };
  };

  const networkInfo = getNetworkInfo();

  return (
    <AppContainer>
      <Header>
        <Title>AI OCR File Explorer</Title>
        <Subtitle>
          Dosyalarınızı yükleyin, OCR ile metinleri okuyun ve kolayca arayın
        </Subtitle>
      </Header>

      <MainContent>
        <Section>
          <SectionTitle>📊 Sistem Bilgileri</SectionTitle>
          
          <Stats>
            <StatCard>
              <StatNumber>🔍</StatNumber>
              <StatLabel>OCR Destekli Arama</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>📁</StatNumber>
              <StatLabel>Çoklu Dosya Türü</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>🌐</StatNumber>
              <StatLabel>LAN Erişimi</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>💾</StatNumber>
              <StatLabel>Offline Çalışma</StatLabel>
            </StatCard>
          </Stats>

          <NetworkInfo>
            <NetworkTitle>🌐 Ağ Erişim Bilgileri</NetworkTitle>
            <NetworkText>
              <strong>Mevcut URL:</strong> {networkInfo.currentUrl}
            </NetworkText>
            <NetworkText>
              <strong>Lokal Erişim:</strong> {networkInfo.localUrl}
            </NetworkText>
            <NetworkText>
              <strong>LAN Erişimi:</strong> Aynı ağdaki diğer cihazlar bu IP adresi üzerinden erişebilir
            </NetworkText>
            <NetworkText>
              <small>
                💡 LAN'daki diğer cihazlardan erişim için bilgisayarınızın IP adresini kullanın.
                Backend: port 8000, Frontend: port 3000
              </small>
            </NetworkText>
          </NetworkInfo>
        </Section>

        <Section>
          <SectionTitle>📤 Dosya Yükleme</SectionTitle>
          <FileUpload onUploadComplete={handleUploadComplete} />
        </Section>

        <Section>
          <SectionTitle>� Gelişmiş Arama ve Dosya Yönetimi</SectionTitle>
          <SearchBar 
            onSearch={loadFiles}
            searchStats={{ total: files.length, found: files.length }}
            isLoading={loading}
          />

          <ViewToggle>
            <ViewButton 
              active={currentView === 'explorer'} 
              onClick={() => setCurrentView('explorer')}
            >
              🗂️ Dosya Gezgini
            </ViewButton>
            <ViewButton 
              active={currentView === 'list'} 
              onClick={() => setCurrentView('list')}
            >
              📋 Liste Görünümü
            </ViewButton>
          </ViewToggle>

          {currentView === 'explorer' ? (
            <ExplorerLayout>
              <FileExplorer 
                files={files}
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                searchQuery={searchQuery}
              />
              <FilePreview 
                file={selectedFile}
                onDownload={handleDownload}
                searchQuery={searchQuery}
              />
            </ExplorerLayout>
          ) : (
            <FileList refreshTrigger={refreshTrigger} />
          )}
        </Section>
      </MainContent>
    </AppContainer>
  );
}

export default App;