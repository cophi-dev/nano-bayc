import React, { useState } from 'react';
import styled from 'styled-components';

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  font-size: 18px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value) {
      onSearch(value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchInput
        type="number"
        placeholder="Enter BAYC Token ID..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min="0"
        max="10000"
      />
    </form>
  );
};

export default SearchBar; 