import React from 'react';
import ImageDisplay from './components/ImageDisplay';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <ImageDisplay tokenId="3" />
    </>
  );
}

export default App;