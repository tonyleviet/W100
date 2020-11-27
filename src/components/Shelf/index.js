import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts, stateUpdate } from '../../services/shelf/actions';
import { CACHE_FILTER_KEY } from '../../services/Constants';
import { FirebaseService } from '../../services/FirebaseService';

import { AuthService } from '../../services/AuthService';
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
  mounted = false;
  state = {
    isLoading: false,
    loadMore: true,
    hasMore: true,
    selectedCity: 0, 
    selectedDistrict: 0,
    pageIndex: 1,
    pageSize: 8,
    totalProduct: 0,
    mounted: false
  };
  constructor(props) {
    super(props);
    console.log('constructor index shelf props', props);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleChooseLocation = this.handleChooseLocation.bind(this);

  }
  componentDidMount() {
    this.mounted = true;

    if (this.mounted == true) {
      if ((this.props.defaultCity && this.props.defaultCity != this.state.selectedCity) ||
        (this.props.defaultDistrict && this.props.defaultDistrict != this.state.selectedDistrict)) {
        this.setState({ selectedCity: this.props.defaultCity });
        this.setState({ selectedDistrict: this.props.defaultDistrict });

        this.wait(1000).then(() => {
          console.log('componentDidMount fetchProducts');
          this.fetchProducts();
        });
      }
    }
    
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log('Shelf componentWillReceiveProps', nextProps);
  }
  fetchProducts = () => {
    console.log('fetchProducts begin');
    this.productsTotal(this.state.selectedCity, this.state.selectedDistrict).then(r => {
      console.log('productsTotal', r, ' currentTotal', this.state.pageSize * this.state.pageIndex);
      this.setState({ totalProduct: r });
      if (this.state.pageSize * this.state.pageIndex > r) {
        this.setState({ hasMore: false });
        return null;
      }

    });
    this.props.fetchProducts(this.state.pageIndex, this.state.pageSize, this.state.selectedCity, this.state.selectedDistrict, () => {
      //this.setState({ isLoading: false });
    });
  }
  refreshProducts = () => {
    const filterRaw = localStorage.getItem(CACHE_FILTER_KEY);
    console.log('refreshProducts update filter', JSON.parse(filterRaw));
    const filters = JSON.parse(filterRaw);


    this.setState({ pageIndex: 1 });

    this.setState({ hasMore: true });
    console.log('refreshProducts begin');
    this.productsTotal(filters.selectedCity, filters.selectedDistrict).then(r => {
      console.log('productsTotal', r, ' currentTotal', this.state.pageSize);
      this.setState({ totalProduct: r });
      if (this.state.pageSize > r) {
        this.setState({ hasMore: false });
        return null;
      }

    });
    this.props.fetchProducts(1, this.state.pageSize, filters.selectedCity, filters.selectedDistrict, () => {
      this.setState({ selectedCity: filters.selectedCity });
      this.setState({ selectedDistrict: filters.selectedDistrict });
      //this.setState({ isLoading: false });
    });

  }
  productsPage = (pageIndex, pageSize, cityID, districtID) => {
    console.log('productsPage querySnapshot', pageIndex, '--', pageSize, 'cityID:', cityID, ' districtID: ', districtID);
    return new Promise((resolve, reject) => {
      FirebaseService.activeProductsCollection(pageIndex, pageSize, cityID, districtID)
        .get()
        .then((querySnapshot) => {
          let products = [];
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
    cityID = parseInt(cityID);
    districtID = parseInt(districtID);
    districtID = 0;
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
    if ((this.state.pageSize * (this.state.pageIndex)) > this.state.totalProduct) {
      console.log('handleLoadMore NoLoadMore currentTotal', (this.state.pageSize * (this.state.pageIndex)), ' totalProduct - ', this.state.totalProduct);
      this.setState({ hasMore: false });
      return null;
    }
    else {
      this.setState(
        (prevState, nextProps) => ({
          pageIndex: prevState.pageIndex + 1,
          hasMore: true
        }),
        () => {
          console.log('fetchMoreData fetchProducts');
          this.fetchProducts();
        }
      );
    }
  };
  setLoadingMore(loadMore) {
    this.setState((prevState, nextProps) => ({
      loadMore: loadMore
    }));
  }

  setLocation(cityID, districtID) {
    if (cityID) {
      localStorage.setItem('selectedCity', cityID);
    }
    if (districtID) {
      localStorage.setItem('selectedDistrict', districtID);
    }

    AuthService.updateUser(cityID, districtID, null, null);
  }

  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }


  /* responseGoogle = (response) => {
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
  }; */
  handleFilter(newfilters) {
    console.log('handleFilter newfilters', newfilters, this.state);
    if (newfilters.selectedCity != this.state.selectedCity || newfilters.selectedDistrict != this.state.selectedDistrict) {
      if (newfilters.selectedCity) {
        this.setState({ selectedCity: newfilters.selectedCity });
        console.log('newfilters selectedCity', newfilters.selectedCity);
      }
      if (newfilters.selectedDistrict) {
        //this.setState({ selectedDistrict: parseInt(newfilters.selectedDistrict.value )});
        console.log('newfilters selectedDistrict', newfilters.selectedDistrict);
      }
      this.setLocation(newfilters.selectedCity, newfilters.selectedDistrict)
      this.setState({ pageIndex: 1 });
      this.wait(1000).then(() => {
        console.log('handleFilter fetchProducts');
        this.fetchProducts();
      });
    }
  }
  handleChooseLocation(newfilters) {
    console.log('handleChooseLocation newfilters', newfilters);
    if (newfilters.selectedCity != this.state.selectedCity || newfilters.selectedDistrict != this.state.selectedDistrict) {
      if (newfilters.selectedCity) {
        this.setState({ selectedCity: newfilters.selectedCity });
        console.log('handleChooseLocation selectedCity', newfilters.selectedCity);
      }
      if (newfilters.selectedDistrict) {
        //this.setState({ selectedDistrict: parseInt(newfilters.selectedDistrict )});
        console.log('handleChooseLocation selectedDistrict', newfilters.selectedDistrict);
      }
      this.setLocation(newfilters.selectedCity, newfilters.selectedDistrict);
      this.setState({ pageIndex: 1 });

      this.wait(1000).then(() => {
        console.log('handleChooseLocation fetchProducts');
        this.fetchProducts();
      });
    }

  }



  render() {
    const { products } = this.props;
    const { isLoading, selectedCity, selectedDistrict, totalProduct, hasMore } = this.state;
    return (
      <React.Fragment>
        {/*  {isLoading && <Spinner />} */}

        {/* <Filter handleFilter={this.handleFilter} defaultCity={selectedCity} defaultDistrict={selectedDistrict} /> */}
        <div className="shelf-container" id="scrollableDiv">
          {/* <ChooseLocation handleChooseLocation={this.handleChooseLocation} defaultCity={selectedCity} defaultDistrict={selectedDistrict} /> */}
          <ShelfHeader productsLength={totalProduct} />
          <button id="btn-refresh" onClick={this.refreshProducts} style={{ visibility: "hidden" }}> Refresh </button>
          <InfiniteScroll
            dataLength={products.length}
            next={this.fetchMoreData}
            hasMore={hasMore}
            refreshFunction={this.refreshProducts}
            loader={<h4>Loading...</h4>}
            scrollThreshold="200px"
            className={'infinite-scroll-component-outer'}
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
