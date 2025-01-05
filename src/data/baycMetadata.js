import mappingData from './mapping.json';
import { backgrounds } from './backgrounds';

// Convert the array into an object indexed by token ID
const baycMapping = mappingData.reduce((acc, item) => {
  acc[item.id] = item.metadata;
  return acc;
}, {});

export const getBaycMetadata = (tokenId) => {
  const metadata = baycMapping[tokenId];
  if (!metadata) return null;

  const backgroundAttr = metadata.attributes.find(attr => attr.trait_type === 'Background');
  const backgroundImage = backgroundAttr ? backgrounds[backgroundAttr.value] : backgrounds['Aquamarine'];

  return {
    image: metadata.image,
    attributes: metadata.attributes,
    background: backgroundImage
  };
};
