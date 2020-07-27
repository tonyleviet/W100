import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchProducts, stateUpdate } from '../../services/shelf/actions';
import { FirebaseService } from '../../services/FirebaseService';

import { GoogleLogin } from 'react-google-login';

import Spinner from '../Spinner';
import ShelfHeader from './ShelfHeader';
import ProductList from './ProductList';

import './style.scss';

class Shelf extends Component {
  static propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    filters: PropTypes.array,
    sort: PropTypes.string
  };

  state = {
    isLoading: false
  };

  componentDidMount() {
    this.handleFetchProducts();
    //this.handleSetttings();
  }

  componentWillReceiveProps(nextProps) {
    const { filters: nextFilters, sort: nextSort } = nextProps;
    const { filters } = this.props;
    if (nextFilters.length !== filters.length) {
      this.handleFetchProducts(nextFilters, undefined);
    }

    if (nextSort !== this.props.sort) {
      this.handleFetchProducts(undefined, nextSort);
    }
  }

  handleFetchProducts = (
    filters = this.props.filters,
    sort = this.props.sort
  ) => {
    this.setState({ isLoading: true });
    this.props.fetchProducts(filters, sort, () => {
      this.setState({ isLoading: false });
    });
  };

  
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
        <div className="shelf-container">

          <ShelfHeader productsLength={products.length} />

          <ProductList products={products} />
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
)(Shelf);
