import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const SearchContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SearchTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`;

const SearchInputContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 18px;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#3b82f6' : '#d1d5db'};
  background-color: ${props => props.active ? '#3b82f6' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: #3b82f6;
    ${props => !props.active && 'background-color: #f8fafc;'}
  }
`;

const QuickSearchButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const QuickSearchButton = styled.button`
  padding: 4px 8px;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
    color: #374151;
  }
`;

const SearchStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #6b7280;
`;

function SearchBar({ onSearch, onFilterChange, searchStats, isLoading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [searchIn, setSearchIn] = useState(['fileName', 'ocrContent']);

  const fileTypes = [
    { value: '.pdf', label: 'PDF', icon: '📄' },
    { value: '.xlsx', label: 'Excel', icon: '📊' },
    { value: '.csv', label: 'CSV', icon: '📈' },
    { value: '.jpg', label: 'Resim', icon: '🖼️' },
    { value: '.png', label: 'PNG', icon: '🖼️' },
  ];

  const searchInOptions = [
    { value: 'fileName', label: 'Dosya Adı' },
    { value: 'ocrContent', label: 'OCR İçeriği' },
  ];

  const quickSearches = [
    'fatura', 'rapor', 'belge', 'sözleşme', 'form', 
    '2024', '2023', 'toplam', 'tutar', 'tarih'
  ];

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms debounce

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, selectedFileTypes, searchIn]);

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      fileTypes: selectedFileTypes,
      searchIn: searchIn
    });
  };

  const toggleFileType = (fileType) => {
    setSelectedFileTypes(prev => 
      prev.includes(fileType) 
        ? prev.filter(type => type !== fileType)
        : [...prev, fileType]
    );
  };

  const toggleSearchIn = (option) => {
    setSearchIn(prev => 
      prev.includes(option)
        ? prev.filter(opt => opt !== option)
        : [...prev, option]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedFileTypes([]);
    setSearchIn(['fileName', 'ocrContent']);
  };

  const handleQuickSearch = (term) => {
    setSearchQuery(term);
  };

  return (
    <SearchContainer>
      <SearchTitle>🔍 Gelişmiş Arama</SearchTitle>
      
      <SearchInputContainer>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="Dosya adı veya içeriğinde arama yapın..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <ClearButton onClick={clearSearch}>
            <FiX size={16} />
          </ClearButton>
        )}
      </SearchInputContainer>

      <FilterSection>
        <FilterLabel>
          <FiFilter size={14} />
          Dosya Türü:
        </FilterLabel>
        <FilterGroup>
          {fileTypes.map((type) => (
            <FilterChip
              key={type.value}
              active={selectedFileTypes.includes(type.value)}
              onClick={() => toggleFileType(type.value)}
            >
              {type.icon} {type.label}
            </FilterChip>
          ))}
        </FilterGroup>
      </FilterSection>

      <FilterSection style={{ marginTop: '12px' }}>
        <FilterLabel>Arama Yeri:</FilterLabel>
        <FilterGroup>
          {searchInOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={searchIn.includes(option.value)}
              onClick={() => toggleSearchIn(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </FilterGroup>
      </FilterSection>

      <QuickSearchButtons>
        <span style={{ fontSize: '0.75rem', color: '#6b7280', marginRight: '8px' }}>
          Hızlı Arama:
        </span>
        {quickSearches.map((term) => (
          <QuickSearchButton
            key={term}
            onClick={() => handleQuickSearch(term)}
          >
            {term}
          </QuickSearchButton>
        ))}
      </QuickSearchButtons>

      <SearchStats>
        <span>
          {isLoading ? 'Aranıyor...' : 
           searchStats ? `${searchStats.total} dosyadan ${searchStats.found} sonuç` : 
           'Arama yapmak için yukarıdaki alana yazın'}
        </span>
        {searchQuery && (
          <button onClick={clearSearch} style={{ 
            background: 'none', 
            border: 'none', 
            color: '#3b82f6', 
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}>
            Temizle
          </button>
        )}
      </SearchStats>
    </SearchContainer>
  );
}

export default SearchBar;