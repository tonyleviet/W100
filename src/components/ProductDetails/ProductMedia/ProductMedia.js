import React, { Component } from "react";
import { connect } from 'react-redux';

import { Carousel } from 'react-responsive-carousel';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import './ProductMedia.css';

class ProductMedia extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const product = this.props.product;
        if (!product.imageUrls) {
            product.imageUrls = [];
        }
        return (
            <Carousel>
                {product.imageUrls.map((imageUrl, index) => {
                    return (
                        <div className={'product-image-big'}>
                            <img  src={imageUrl} />
                        {/*     <p className="legend"></p> */}
                        </div>
                    )
                })}
            </Carousel>
        );
    }
}

const mapStateToProps = state => {
    return {
        filteredVariants: state.filteredVariants
    }
}

export default connect(mapStateToProps)(ProductMedia);
