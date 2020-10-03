import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { myProductsFetch, myStateUpdate } from '../../services/myShelf/actions';
import { FirebaseService } from '../../services/FirebaseService';

import { GoogleLogin } from 'react-google-login';

import Spinner from '../Spinner';
import ShelfHeader from './ShelfHeader';
import ProductList from './ProductList';
import InfiniteScroll from "react-infinite-scroll-component";
import './style.scss';

class MyShelf extends Component {
  static propTypes = {
    myProductsFetch: PropTypes.func.isRequired,
    myproducts: PropTypes.array.isRequired,
    filters: PropTypes.array,
    sort: PropTypes.string
  };

  state = {
    isLoading: false,
    loadMore: true,
    pageIndex: 1,
    pageSize: 100
  };

  componentDidMount() {
    this.handleFetchProducts();
    //this.handleSetttings();
  }

  componentWillReceiveProps(nextProps) {
    const { filters: nextFilters, sort: nextSort } = nextProps;
    const { filters } = this.props;
    if (nextFilters.length !== filters.length) {
      this.handleFetchProducts(this.state.pageIndex, this.state.pageSize, nextFilters, undefined);
    }

    if (nextSort !== this.props.sort) {
      this.handleFetchProducts(this.state.pageIndex, this.state.pageSize, undefined, nextSort);
    }
  }
  productsPage = (pageIndex, pageSize, cityID, districtID) => {
    console.log('productsPage querySnapshot', pageIndex, '--', pageSize, 'cityID:', cityID, ' districtID: ', districtID);
    return new Promise((resolve, reject) => {
      FirebaseService.activeProductsCollection(pageIndex, pageSize, cityID, districtID)
        .get()
        .then((querySnapshot) => {
          //.onSnapshot((querySnapshot) => {
          //console.log('querySnapshot', querySnapshot);

          let products = [];
          //if(currentProducts){
          //  products=currentProducts
          //}
          //if(this.props)
          querySnapshot.forEach((doc) => {
            const { userId, imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate } = doc.data();
            //console.log('product querySnapshot.forEach', doc.data());
            let lastUpdatedDate = lastUpdate ? lastUpdate.toDate() : new Date();
            products.push({
              id: doc.id, userId: null, imageUrls: imageUrls, name, price, phone, address, description,
              color, size, active, city, cityName, district, districtName, lastUpdate: lastUpdatedDate
            });


          });
          resolve(products);
        });
    });
  };
  productsTotal = () => {
    return new Promise((resolve, reject) => {
      FirebaseService.productsCollection().get().then((querySnapshot) => {
        resolve(querySnapshot.docs.length);
      });
    });
  };
  fetchMoreData = () => {
    if ((this.state.pageSize * (this.state.pageIndex)) > this.state.totalProduct) {
      console.log('handleLoadMore NoLoadMore currentTotal', (this.state.pageSize * (this.state.pageIndex)), ' totalProduct - ', this.state.totalProduct);
      this.setState({ hasMore: false });
      return null;
    } else {
      //const { loadMore } = this.state
      console.log('handleLoadMore currentTotal', (this.state.pageSize * (this.state.pageIndex)), ' totalProduct - ', this.state.totalProduct);
      this.setState(
        (prevState, nextProps) => ({
          pageIndex: prevState.pageIndex + 1,
          loadMore: true
        }),
        () => {

          this.productsPage(this.state.pageIndex, this.state.pageSize, 79, 0).then(products => {
            this.props.myStateUpdate({ prop: 'products', value: products });
            this.wait(2000).then(() => { this.setLoadingMore(false); });
          });
        }
      );
    }
  };
  setLoadingMore(loadMore) {

    //this.props.myStateUpdate({ prop: 'refreshing', value: refresh });
    this.setState((prevState, nextProps) => ({
      loadMore: loadMore
    }));
  }
  handleFetchProducts() {
      this.props.myProductsFetch(this.state.pageIndex, this.state.pageSize);
  };
  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }


  render() {
    const { myproducts } = this.props;
    const { isLoading } = this.state;
    return (
      <React.Fragment>
        {isLoading && <Spinner />}
        <div className="my-shelf-container">

          <ShelfHeader productsLength={myproducts.length} />
          <InfiniteScroll
            dataLength={myproducts.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            scrollThreshold="200px"
          >
            <ProductList products={myproducts} />
          </InfiniteScroll>

        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  myproducts: state.myShelf.myproducts,
  filters: state.filters.items,
  sort: state.sort.type,
  cities: state.shelf.cities,
  districts: state.shelf.districts,
  settings: state.shelf.settings,
});

export default connect(
  mapStateToProps,
  { myProductsFetch, myStateUpdate }
)(MyShelf);
