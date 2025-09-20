import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

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

  const handleUploadComplete = (result) => {
    console.log('Upload completed:', result);
    // FileList'i yenilemek için trigger'ı güncelle
    setRefreshTrigger(prev => prev + 1);
  };

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
          <SectionTitle>📋 Dosya Listesi</SectionTitle>
          <FileList refreshTrigger={refreshTrigger} />
        </Section>
      </MainContent>
    </AppContainer>
  );
}

export default App;