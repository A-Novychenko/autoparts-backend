const ASGProduct = require('../../models/asg/products');
const fetchImgs = require('../../helpers/fetchASGImgs');

const getProductsByTecDocArticle = async (req, res) => {
  const { article } = req.body;

  console.log('article', article);

  const productsTecdocArticle = await ASGProduct.find({
    tecdoc_article: article,
  });
  const productsArticle = await ASGProduct.find({ article });

  const allProducts = [...productsTecdocArticle, ...productsArticle];

  const products = allProducts.filter((value, index, self) => {
    return (
      index ===
      self.findIndex(
        t => t.id === value.id, // Перевіряємо на однакові id
      )
    );
  });

  // const productsWithImg =
  const productsIds = products.map(({ id }) => id);
  const data = await fetchImgs(productsIds);
  const imgs = data.data;

  const productsWithImg = products.map(product => {
    const imgIdx = imgs.findIndex(
      ({ product_id }) => product_id === product.id,
    );

    if (imgIdx === -1) {
      return product;
    }

    const img = imgs[imgIdx].images[0];
    return { ...product._doc, img };
  });

  console.log('products', products);

  res.json({
    status: 'OK',
    code: 200,
    products: productsWithImg,
  });
};

module.exports = getProductsByTecDocArticle;
