const transformedProductsByCMS = products => {
  return products.map(product => {
    const marginValue = product?.margin ?? 10;
    const margin = marginValue / 100;

    const price_currency_980_to_number = parseFloat(product.price_currency_980);

    const price_client = Math.ceil(
      price_currency_980_to_number + price_currency_980_to_number * margin,
    );

    return {
      _id: product._id,
      id: product.id,
      cid: product.cid,

      category: product.category,
      category_id: product.category_id,

      brand: product.brand,
      article: product.article,
      tecdoc_article: product.tecdoc_article,

      name: product.name,
      description: product.description,
      img: product.img ? [...product.img] : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,

      count_warehouse_3: product.count_warehouse_3,
      count_warehouse_4: product.count_warehouse_4,
      price_supplier: product.price_currency_980,
      price_client,
      price_promo: product.price_promo,
      banner: product.banner,
      sale: product.sale,
    };
  });
};

module.exports = transformedProductsByCMS;
