import React from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Thumb from '../../../Thumb';
import { formatPrice } from '../../../../services/util';
import { addProduct } from '../../../../services/cart/actions';

const Product = ({ product, addProduct }) => {
  product.quantity = 1;
  /* let formattedPrice = formatPrice(product.price, product.currencyId);

  let productInstallment;

  if (!!product.installments) {
    const installmentPrice = product.price / product.installments;

    productInstallment = (
      <div className="installment">
        <span>or {product.installments} x</span>
        <b>
          {product.currencyFormat}
          {formatPrice(installmentPrice, product.currencyId)}
        </b>
      </div>
    );
  } */

  return (
    <div
      className="shelf-item"
      onClick={() => {
        var link = document.getElementById(product.id);
        link.click();
      }}
      //onClick={() => navigation.navigate('ProductDetails')}

      data-id={product.id}
    >
      {/*  {product.isFreeShipping && (
        <div className="shelf-stopper">Free shipping</div>
      )} */}
      <Thumb
        classes="shelf-item__thumb"
        src={product.imageUrls[0]}
        alt={product.name}
      />
      <p className="shelf-item__title">{product.name}</p>
      <div className="shelf-item__price">
        <div className="val">
          {product.price}
          {/*  <small>{product.currencyFormat}</small>
          <b>{formattedPrice.substr(0, formattedPrice.length - 3)}</b>
          <span>{formattedPrice.substr(formattedPrice.length - 3, 3)}</span> */}
        </div>
        {/*   {productInstallment} */}
      </div>
      <div className="shelf-item__location">
        {product.cityName}
        {product.districtName != null && (
          <span>, {product.districtName}</span>
        )}
      </div>
      {/* <div className="shelf-item__buy-btn">Add to cart</div> */}
      <Link to={{ pathname: '/AddEdit/' + product.id, product: product }} id={product.id} style={{display:'none'}} > Xem chi tiết</Link>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  addProduct: PropTypes.func.isRequired
};

export default connect(
  null,
  { addProduct }
)(Product);
