import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateNanoBAYC } from '../utils/imageProcessor';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xfAa0e99EF34Eae8b288CFEeAEa4BF4f5B5f2eaE7';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    padding-bottom: 0;
    background-size: 100% 100%;
  }
`;

const TopControls = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 15px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
    max-width: 300px;
    gap: 8px;
    padding: 10px;
  }
`;

const SearchInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: transparent;
  font-size: 14px;
  text-align: center;
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px;
  }
  
  &:focus {
    outline: none;
  }
`;

const Select = styled.select`
  padding: 8px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 14px;
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 16px;
    text-align: center;
  }
  
  &:focus {
    outline: none;
  }
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: #3498db;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  
  &:hover {
    background: #2980b9;
  }
`;

const ApeImage = styled.img`
  width: 250px;
  height: 250px;
  object-fit: contain;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  z-index: 5;
  
  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    bottom: 0;
  }
`;

const Credits = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: white;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
  pointer-events: none;

  @media (max-width: 768px) {
    font-size: 11px;
    bottom: 20px;
    left: 10px;
    padding: 6px 10px;
  }

  a {
    color: white;
    text-decoration: none;
    transition: opacity 0.2s;
    pointer-events: auto;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

const MintStatus = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 0.3px;
  background: ${props => props.$isMinted ? 'rgba(46, 204, 113, 0.95)' : 'rgba(231, 76, 60, 0.95)'};
  color: white;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  cursor: ${props => props.$isMinted ? 'default' : 'pointer'};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 14px 24px;
    right: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40%;
    width: auto;
    white-space: nowrap;
    background: ${props => props.$isMinted ? 
      'rgba(46, 204, 113, 0.98)' : 
      'rgba(231, 76, 60, 0.98)'
    };
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    text-align: center;
    
    ${props => !props.$isMinted && `
      font-weight: 700;
      padding: 16px 28px;
      background: linear-gradient(
        135deg, 
        rgba(231, 76, 60, 0.98) 0%,
        rgba(192, 57, 43, 0.98) 100%
      );
    `}
  }
  
  &:hover {
    transform: ${props => props.$isMinted ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$isMinted ? 
      '0 4px 12px rgba(0, 0, 0, 0.15)' : 
      '0 6px 16px rgba(0, 0, 0, 0.2)'
    };
    
    @media (max-width: 768px) {
      transform: translate(-50%, ${props => props.$isMinted ? '0' : '-4px'});
      box-shadow: ${props => !props.$isMinted && '0 8px 24px rgba(0, 0, 0, 0.3)'};
    }
  }
`;

const ImageDisplay = ({ tokenId: initialTokenId }) => {
  const [tokenId, setTokenId] = useState(initialTokenId || "3");
  const [apeImage, setApeImage] = useState(null);
  const [background, setBackground] = useState({ image: null });
  const [isMinted, setIsMinted] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("square");

  const fetchApeImage = async () => {
    try {
      const result = await generateNanoBAYC(tokenId);
      if (result.image) {
        setApeImage(result.image);
        setBackground(result.background);
      }
    } catch (error) {
      console.error('Error fetching ape image:', error);
    }
  };

  const checkMintStatus = async (id) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ['function ownerOf(uint256 tokenId) view returns (address)'],
        provider
      );
      
      try {
        await contract.ownerOf(id);
        setIsMinted(true);
      } catch (error) {
        setIsMinted(false);
      }
    } catch (error) {
      console.error('Error checking mint status:', error);
      setIsMinted(false);
    }
  };

  useEffect(() => {
    fetchApeImage();
    checkMintStatus(tokenId);
  }, [tokenId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value && !isNaN(value) && value >= 0 && value <= 9999) {
      setTokenId(value);
    }
  };

  const handleSave = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width, height;
      switch (aspectRatio) {
        case "twitter-header":
          width = 1500;
          height = 500;
          break;
        case "twitter-post":
          width = 1200;
          height = 675;
          break;
        default:
          width = 1200;
          height = 1200;
      }
      
      const scale = 4;
      canvas.width = width * scale;
      canvas.height = height * scale;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.scale(scale, scale);

      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = background.image;
      });

      ctx.drawImage(bgImg, 0, 0, width, height);

      const apeImg = new Image();
      apeImg.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        apeImg.onload = resolve;
        apeImg.onerror = reject;
        apeImg.src = apeImage;
      });
      
      const apeHeight = Math.min(height * 0.85, 250);
      const apeWidth = apeHeight;
      const apeX = (width - apeWidth) / 2;
      const apeY = height - apeHeight;
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(apeImg, apeX, apeY, apeWidth, apeHeight);

      const link = document.createElement('a');
      link.download = `nano-bayc-${tokenId}-${aspectRatio.replace('twitter', 'x')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  return (
    <Container $bgImage={background.image}>
      <TopControls>
        <SearchInput
          type="number"
          placeholder="#"
          min="0"
          max="9999"
          onChange={handleSearch}
          value={tokenId}
        />
        <Select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
          <option value="square">Square (1200×1200)</option>
          <option value="twitter-header">X Header (1500×500)</option>
          <option value="twitter-post">X Post (1200×675)</option>
        </Select>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </TopControls>
      {apeImage && (
        <ApeImage 
          src={apeImage} 
          alt={`Nano BAYC #${tokenId}`}
        />
      )}
      <Credits>
        <div>Idea by <a href="https://x.com/F1reDragon_" target="_blank" rel="noopener noreferrer">@F1reDragon_</a></div>
        <div>Built by <a href="https://x.com/_cophi_" target="_blank" rel="noopener noreferrer">@_cophi_</a></div>
      </Credits>
      {isMinted ? (
        <MintStatus $isMinted={true}>
          AFA Minted 👍
        </MintStatus>
      ) : (
        <MintStatus 
          as="a" 
          href="https://www.apefacingapes.com/claim" 
          target="_blank"
          rel="noopener noreferrer"
          $isMinted={false}
        >
          ApeFacingApe not claimed yet - Mint Now! 🚀
        </MintStatus>
      )}
    </Container>
  );
};

export default ImageDisplay;