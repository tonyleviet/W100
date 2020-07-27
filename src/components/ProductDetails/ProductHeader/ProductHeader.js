import React from 'react';
import StarRatings from 'react-star-ratings';
import { isArray } from 'util';

import './ProductHeader.css';

const header = (props) => {

    const product = props.product;
    console.log('header', product);
    let minPrice = 0.00, maxPrice = 0.00;

    /* if (isArray(product.baremList)) {
       const priceList = [...product.baremList.map(range => range.price)]
       minPrice = Math.min(...priceList);
       maxPrice = Math.max(...priceList);
   } */

    return (
        <header className="product-header">
            <h2>{product.name}</h2>
            {/*   <div className="mb-16">
                <div className="product-star-container">
                    <StarRatings
                        rating={4.5}
                        starDimension="20px"
                        starSpacing="2px"
                        starRatedColor="#ffc107"
                    />
                </div>                
                <a href="/" style={{ margin: '0 8px' }}>23 Yorum</a>
            </div> */}
            <h4>{product.phone}</h4>
            <h4>{product.address}, {product.districtName}</h4>
            <h4 className="mb-0">
                <span>{product.price}</span>
                <span className="subheader" style={{ padding: '0 2px' }}> VND</span>
            </h4>

            <div>
                <span className="subheader">{product.description}</span>
            </div>
        </header>
    )
};

export default header;