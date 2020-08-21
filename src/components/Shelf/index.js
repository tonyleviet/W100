import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts, stateUpdate } from '../../services/shelf/actions';
import { FirebaseService } from '../../services/FirebaseService';
import InfiniteScroll from "react-infinite-scroll-component";
import { GoogleLogin } from 'react-google-login';
import { Button, Modal } from "react-bootstrap";
import Spinner from '../Spinner';
import ShelfHeader from './ShelfHeader';
import Filter from './Filter';
import ProductList from './ProductList';
import ChooseLocation from '../ChooseLocation';

import './style.scss';

class Shelf extends Component {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    filters: PropTypes.array,
    sort: PropTypes.string
  };

  state = {
    isLoading: false,
    loadMore: true,
    hasMore: true,
    selectedCity: 0,
    selectedDistrict: 0,
    pageIndex: 1,
    pageSize: 10,
    totalProduct: 0,
  };
  constructor(props) {
    super(props);
    console.log('constructor index shelf props', props);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChooseLocation = this.handleChooseLocation.bind(this);
  }
  componentDidMount() {
    this.fetchProducts();
  }

  componentWillReceiveProps(nextProps) {
    /* const { filters: nextFilters, sort: nextSort } = nextProps;
    console.log('filters', nextFilters);
    const { filters } = this.props;
    if (nextFilters.length !== filters.length) {
      this.handleFetchProducts(this.state.pageIndex, this.state.pageSize, nextFilters, undefined);
    }

    if (nextSort !== this.props.sort) {
      this.handleFetchProducts(this.state.pageIndex, this.state.pageSize, undefined, nextSort);
    } */
  }
  fetchProducts = () => {
    console.log('fetchProducts begin');

    this.props.fetchProducts(this.state.pageIndex, this.state.pageSize, this.state.selectedCity, this.state.selectedDistrict, () => {
      //this.setState({ isLoading: false });
    });
    this.productsTotal(this.state.selectedCity, this.state.selectedDistrict).then(r => {
      console.log('productsTotal', r);
      this.setState({ totalProduct: r });
      if (this.state.pageSize * this.state.pageIndex >= r) {
        this.setState({ hasMore: false });
        return null;
      }

    });
    /*  this.productsPage(this.state.pageIndex, this.state.pageSize, this.state.selectedCity, this.state.selectedDistrict).then(products => {
       this.props.stateUpdate({ prop: 'products', value: products });
       //this.wait(2000).then(() => { this.setLoadingMore(false); });
     }); */
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
  productsTotal = (cityID, districtID) => {
    return new Promise((resolve, reject) => {
      var ref = null
      if (!districtID && districtID != null && districtID !== 0) {
        ref = FirebaseService.productsCollection()
          .where("active", "==", true)
          .where("city", "==", cityID)
          .where("district", "==", districtID);
      }
      else {
        ref = FirebaseService.productsCollection()
          .where("active", "==", true)
          .where("city", "==", cityID);
      }

      ref.get().then((querySnapshot) => {
        resolve(querySnapshot.docs.length);
      });
    });
  };
  fetchMoreData = () => {
    console.log('handleLoadMore pageSize', this.state.pageSize, ' pageIndex-', this.state.pageIndex, ' totalProduct - ', this.state.totalProduct);
    if (this.state.pageSize * this.state.pageIndex >= this.state.totalProduct) {
      return null;
    }
    else {
      //const { loadMore } = this.state

      this.setState(
        (prevState, nextProps) => ({
          pageIndex: prevState.pageIndex + 1,
          hasMore: true
        }),
        () => {
          this.fetchProducts();
        }
      );
    }
  };
  setLoadingMore(loadMore) {

    //this.props.stateUpdate({ prop: 'refreshing', value: refresh });
    this.setState((prevState, nextProps) => ({
      loadMore: loadMore
    }));
  }
  /* handleFetchProducts = (
    pageIndex,
    pageSize,
    filters = this.props.filters,
    sort = this.props.sort
  ) => {
    this.setState({ isLoading: true });
    this.props.fetchProducts(pageIndex, pageSize, filters, sort, () => {
      this.setState({ isLoading: false });
    });
  }; */
  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }


  responseGoogle = (response) => {
    console.log(response);
    FirebaseService.signIn(response.wc.id_token, response.wc.access_token);
  };
  renderReactGoogle = () => {

    return (
      <div>
        <GoogleLogin
          clientId="462924586807-q4r0gtgpg81m5a3tckcnbm2ebfenkshh.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        />aaaaaaaaaaa</div>,
      document.getElementById('googleButton')
    );
  };
  handleFilter(newfilters) {
    if (newfilters.selectedCity) {
      this.setState({ selectedCity: parseInt(newfilters.selectedCity.value) });
      console.log('newfilters selectedCity', newfilters.selectedCity.value);
    }
    if (newfilters.selectedDistrict) {
      //this.setState({ selectedDistrict: parseInt(newfilters.selectedDistrict.value )});
      console.log('newfilters selectedDistrict', newfilters.selectedDistrict.value);
    }
    this.setState({ pageIndex: 1 });
    this.wait(1000).then(() => { this.fetchProducts(); });

  }
  handleChooseLocation(newfilters) {
    console.log('handleChooseLocation newfilters', newfilters);
    if (newfilters.selectedCity) {
      this.setState({ selectedCity: newfilters.selectedCity });
      console.log('handleChooseLocation selectedCity', newfilters.selectedCity);
    }
    if (newfilters.selectedDistrict) {
      //this.setState({ selectedDistrict: parseInt(newfilters.selectedDistrict )});
      console.log('handleChooseLocation selectedDistrict', newfilters.selectedDistrict);
    }
    this.setState({ pageIndex: 1 });
    this.wait(1000).then(() => { this.fetchProducts(); });

  }
  render() {
    //console.log('render', this.state)
    const { products } = this.props;
    const { isLoading, selectedCity, selectedDistrict, totalProduct, hasMore } = this.state;
    return (
      <React.Fragment>
        {/*  {isLoading && <Spinner />} */}

        <Filter handleFilter={this.handleFilter} defaultCity={selectedCity} defaultDistrict={selectedDistrict} />
        <div className="shelf-container">
          <ChooseLocation handleChooseLocation={this.handleChooseLocation} defaultCity={selectedCity} defaultDistrict={selectedDistrict} />
          <ShelfHeader productsLength={totalProduct} />

          <InfiniteScroll
            dataLength={totalProduct}
            next={this.fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            <ProductList products={products} />
          </InfiniteScroll>

        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => ({
  products: state.shelf.products,
  selectedCity: state.shelf.selectedCity,
  cities: state.shelf.cities,
  districts: state.shelf.districts,
  settings: state.shelf.settings,
});

export default connect(
  mapStateToProps,
  { fetchProducts, stateUpdate }
)(Shelf);
