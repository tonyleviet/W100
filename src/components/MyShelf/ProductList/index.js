import React from 'react';

import Product from './Product';

const ProductList = ({ products }) => {
  console.log('ProductList', products);
  return products.map(p => {
    return <Product product={p} key={p.id} />;
  });
};

export default ProductList;
