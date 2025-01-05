import { getBaycMetadata } from '../data/baycMetadata';
import { backgrounds } from '../data/backgrounds';

export const generateNanoBAYC = async (tokenId) => {
  try {
    const metadata = getBaycMetadata(tokenId);
    if (!metadata?.image) {
      throw new Error('No metadata found for token');
    }

    const imageUrl = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
    const backgroundAttr = metadata.attributes.find(attr => attr.trait_type === 'Background');
    const backgroundImage = backgrounds[backgroundAttr?.value || 'Aquamarine'];

    const result = {
      image: imageUrl,
      background: {
        image: backgroundImage
      }
    };
    
    console.log('Generated Nano BAYC:', result);
    return result;

  } catch (error) {
    console.error('Error generating Nano BAYC:', error);
    return {
      image: null,
      background: {
        image: backgrounds['Aquamarine']
      }
    };
  }
}; 