const { generateSitemapFunc } = require('../../helpers');

const generateSitemapCtrl = async (req, res) => {
  const result = await generateSitemapFunc();

  res.send(`✅ Sitemaps сгенерированы: ${result} файлов.`);
};

module.exports = generateSitemapCtrl;
