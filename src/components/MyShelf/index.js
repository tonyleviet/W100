import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts, stateUpdate } from '../../services/shelf/actions';
import { FirebaseService } from '../../services/FirebaseService';

import { GoogleLogin } from 'react-google-login';

import Spinner from '../Spinner';
import ShelfHeader from './ShelfHeader';
import ProductList from './ProductList';
import InfiniteScroll from "react-infinite-scroll-component";
import './style.scss';

class MyShelf extends Component {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    filters: PropTypes.array,
    sort: PropTypes.string
  };

  state = {
    isLoading: false,
    loadMore: true,
    pageIndex: 1,
    pageSize: 10
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
    if (this.state.size * this.state.page >= this.state.total) return null;
    //const { loadMore } = this.state
    console.log('handleLoadMore');
    this.setState(
      (prevState, nextProps) => ({
        pageIndex: prevState.pageIndex + 1,
        loadMore: true
      }),
      () => {

        this.productsPage(this.state.pageIndex, this.state.pageSize,79, 0).then(products => {
          this.props.stateUpdate({ prop: 'products', value: products });
          this.wait(2000).then(() => { this.setLoadingMore(false); });
        });
      }
    );
  };
  setLoadingMore(loadMore) {

    //this.props.stateUpdate({ prop: 'refreshing', value: refresh });
    this.setState((prevState, nextProps) => ({
      loadMore: loadMore
    }));
  }
  handleFetchProducts = (
    filters = this.props.filters,
    sort = this.props.sort
  ) => {
    this.setState({ isLoading: true });
    this.props.fetchProducts(this.state.pageIndex, this.state.pageSize, filters, sort, () => {
      this.setState({ isLoading: false });
    });
  };
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
  /*
  loginByGoogle = () => {
    //alert("login By Google");
    GoogleService.signIn()
      .then(userInfo => {
        console.log('GoogleService.signIn userInfo: ', userInfo);
        //AuthService.onSignIn(userInfo);
        var userToken = GoogleService.getTokens();

        userToken.then(userTokens => {
          console.log('GoogleService.signIn userTokens: ', userTokens);
          FirebaseService.signIn(userTokens.idToken, userTokens.accessToken)
            .then(user => {
              console.log(user);
              //loginSuccess(dispatch, user);
            })
            .catch(error => {
              console.log('FirebaseService.signIn error ', error);
              //GoogleService.signOut();
              //loginFail(dispatch, error);
            });
        });

      })
      .catch(error => {
        //loginFail(dispatch, error);
      });
  };
  */


  render() {
    const { products } = this.props;
    const { isLoading } = this.state;
    return (
      <React.Fragment>
        {isLoading && <Spinner />}



        {/*   <GoogleLogin style={{width:100, height:200, backgroundColor:'red'}}
          clientId="462924586807-q4r0gtgpg81m5a3tckcnbm2ebfenkshh.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          cookiePolicy={'single_host_origin'}
        /> */}
        <div className="my-shelf-container">

          <ShelfHeader productsLength={products.length} />
          <InfiniteScroll
            dataLength={products.length}
            next={this.fetchMoreData}
            hasMore={this.state.loadMore}
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
  filters: state.filters.items,
  sort: state.sort.type,
  cities: state.shelf.cities,
  districts: state.shelf.districts,
  settings: state.shelf.settings,
});

export default connect(
  mapStateToProps,
  { fetchProducts, stateUpdate }
)(MyShelf);
