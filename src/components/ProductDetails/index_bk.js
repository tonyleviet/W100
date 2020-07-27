import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FirebaseService } from '../../services/FirebaseService';

class ProductDetails extends Component<Props> {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('this.props.match.params', this.props.match.params);
    let productId = this.props.match.params.id
    FirebaseService.getProduct(productId).get().then(querySnapshot => {
        const data = querySnapshot.data();
        console.log('getProduct(productId)', data);
    });
  }

  render() {
    return (
      <div>
        <h1>Product Details</h1>
      </div>
    )
  };
}

const mapStateToProps = state => ({
  /* products: state.shelf.products,
  filters: state.filters.items,
  sort: state.sort.type */
});
export default connect(null,
  //mapStateToProps,
  {}
)(ProductDetails);
