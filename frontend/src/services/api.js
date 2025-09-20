import axios from 'axios';

// Backend API base URL - LAN erişimi için değiştirilebilir
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 saniye timeout
});

export const fileService = {
  // Dosya yükle
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });
    
    return response.data;
  },

  // Dosyaları listele/ara
  getFiles: async (query = '', limit = 50, offset = 0) => {
    const params = { limit, offset };
    if (query) {
      params.query = query;
    }
    
    const response = await api.get('/files', { params });
    return response.data;
  },

  // Dosya bilgilerini al
  getFileInfo: async (fileId) => {
    const response = await api.get(`/files/${fileId}`);
    return response.data;
  },

  // Dosya indir
  downloadFile: async (fileId) => {
    const response = await api.get(`/download/${fileId}`, {
      responseType: 'blob',
    });
    
    // Blob'dan dosya indirme
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Dosya adını response header'dan al
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'download';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  },

  // Dosya sil
  deleteFile: async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
};

export default api;