import React, { Component } from 'react';
import { connect } from 'react-redux';

import productData from '../../static/product-data.json';
import { fetchProduct } from '../../services/productDetails/productDetailsActions';
import './Product.css';
import { withRouter } from 'react-router-dom';
import ProductMedia from './ProductMedia/ProductMedia';
import ProductHeader from './ProductHeader/ProductHeader';
import ProductFilters from './ProductFilters/ProductFilters';
import ProductPricing from './ProductPricing/ProductPricing';
import ProductFooter from './ProductFooter/ProductFooter';
import { createStore } from 'redux';
import reducer from '../../services/productDetails/productDetailsReducer';
import { FirebaseService } from '../../services/FirebaseService';


const store = createStore(reducer);
type Props = {};
class Product extends Component<Props> {
    constructor(props) {
        super(props)
        console.log('this.props.match.params', this.props.match.params);
        let productId = this.props.match.params.id
        FirebaseService.getProduct(productId).get().then(querySnapshot => {
            const data = querySnapshot.data();
            console.log('getProduct(productId)', data);
            this.props.fetchProduct(data);
        });
    }
    componentDidMount() {

    }

    render() {
        return (
            <div className="product">
                <button className="button icon-left" onClick={() => this.props.history.goBack()}>
                    Back
                </button>
                <section className="media-section">
                    <ProductMedia product={this.props.product} />
                </section>
                <section className="details-section">
                    <ProductHeader product={this.props.product} />
                  {/*   <ProductFilters /> */}
                  {/*   <ProductPricing /> */}
                  {/*   <ProductFooter
                        summary={this.props.summary}
                        currency={this.props.product.currency}
                        priceRange={this.props.priceRange}
                        products={this.props.products}
                        optionsSelectedCount={this.props.filters.length}
                        optionsCount={this.props.options.length}
                    /> */}
                </section>
            </div>
        )
    }
};

const mapStateToProps = state => {
    console.log('mapStateToProps state.productDetails', state.productDetails);
    /*  return {
         productDetails: state.productDetails,
         summary: state.summary,
         priceRange: state.priceRange,
         filters: state.filters,
         options: state.selectableAttributes,
         products: state.filteredVariants
     } */
    return state.productDetails;


}

const mapDispatchToProps = dispatch => {

    return {
        fetchProduct: (product) => dispatch(fetchProduct(product))
    }
};

//export default connect(mapStateToProps, mapDispatchToProps)(Product);
export default connect(mapStateToProps, { fetchProduct })(Product);