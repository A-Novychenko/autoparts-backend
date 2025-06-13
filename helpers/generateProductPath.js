const generateSlugName = require('./generateSlugName');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const generateProductPath = ({ brand = '', name, _id }) => {
  let cleanedName = name;

  if (brand) {
    const safeBrand = escapeRegExp(brand);
    const brandPattern = new RegExp(`\\b${safeBrand}\\b`, 'i');
    if (brandPattern.test(name)) {
      cleanedName = name.replace(brandPattern, '').replace(/\s+/g, ' ').trim();
    }
  }

  const slugParts = [brand, cleanedName].filter(Boolean).map(generateSlugName);
  const slug = slugParts.join('-');

  return `/product/${slug}--${_id}`;
};

module.exports = generateProductPath;
