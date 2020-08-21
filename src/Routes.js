import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { GoogleLogin, GoogleLogout } from 'react-google-login';

import { FirebaseService } from './services/FirebaseService';
import { SettingService } from './services/SettingService';

import { FirebaseConfig } from './services/FirebaseApp';
import { AuthService } from './services/AuthService';
//import About from "./About/About";
//import Contact from "./Contact/Contact";
//import Products from "./Product/Products";
import App from './components/App';
import MyShelf from './components/MyShelf';
import ProductDetails from './components/ProductDetails';
import AddEditProduct from './components/AddEditProduct';
import GithubCorner from './components/github/Corner';
import FloatCart from './components/FloatCart';
import SafeLink from './components/SafeLink';
import { Nav } from 'react-bootstrap';
import Filter from './components/Shelf/Filter';
import i18n from './i18n';
import { Button } from "reactstrap";


/* Default
const PrivateRoute = ({ component: Component, ...rest }) => 
(  
  <Route {...rest} render={props => 
  (
    localStorage.getItem('user') ? <Component {...props} /> : <Redirect to={{pathname: '/login'}}/>
  )}/>
); */
const PrivateRoute = ({ component: Component, ...rest }) => {
  //alert('Need Login');
  //return (null);
  /* return (  
    <Route {...rest} render={props => 
      (
        AuthService.isSignedIn() ? <Component {...props} /> : <Redirect to={{pathname: '/'}}/>
      )}/>
  ); */
}




export default class Routes extends Component {
  constructor(props) {
    super(props)
    this.handleSetttings();
    this.state = {
      isUserLoggedIn: false
    };
    this.googleButton = React.createRef();
    // i18n.changeLanguage('vn');
  }
  handleSetttings() {
    FirebaseService.settingsCollection()
      .get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
          //console.log('FirebaseService.settingsCollection doc', doc);  
          const { ActiveAfter, ExpireAfter } = doc.data();
          if (doc.id == "AppSettings") {
            let appSettings = {
              ActiveAfter: ActiveAfter,
              ExpireAfter: ExpireAfter
            }
            console.log('FirebaseService.settingsCollection appSettings', appSettings);
            SettingService.storeAppSettings(appSettings);
            //props.stateUpdate({prop:"settings", value: appSettings})

          }
        });
      });



    FirebaseService.citiesCollection().get().then((querySnapshot) => {
      const cityData = [];

      querySnapshot.forEach((doc) => {
        const { CityID, City, Order } = doc.data();
        cityData.push({ value: CityID, label: City, Order });
      });
      console.log('FirebaseService.settingsCollection cityData', cityData);
      SettingService.storeCities(cityData);
      //props.stateUpdate({prop:"cities",value: cityData});
      //cities = cityData;
    });

    FirebaseService.districtsCollection()
      .get().then((querySnapshot) => {
        const districtData = [];

        querySnapshot.forEach((doc) => {
          const { CityID, City, DistrictID, District, Order } = doc.data();
          districtData.push({ CityID, City, value: DistrictID, label: District, Order });
        });
        console.log('FirebaseService.settingsCollection districtData', districtData);
        SettingService.storeDistricts(districtData);
        //props.stateUpdate({prop:"districts", value: districtData});
      });
  }

  responseGoogle = response => {
    console.log('this.responseGoogle ', response);
    AuthService.onSignIn({ Id: response.googleId, Name: response.profileObj.name, Email: response.profileObj.email });
    FirebaseService.signIn(response.wc.id_token, response.wc.access_token).then(rs => {
      console.log("FirebaseService.signIn", rs);
      this.setState({ isUserLoggedIn: true });

      FirebaseService.activeProductsCollection(1, 10, 79, 768).get()
        .then(querySnapshot => {
          // let { products } = res.data;
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
              id: doc.id, userId: null, imageUrls: imageUrls, title: name, price, phone, address, description: description,
              color, size, active, city, cityName, district, districtName, lastUpdate: lastUpdatedDate
            });
          });

          console.log("products", products);
          /* return dispatch({
            type: FETCH_PRODUCTS,
            payload: products
          }); */
        });
    });
  };

  logout = () => {
    this.setState({ isUserLoggedIn: false })
  };

  render() {
    return (
      <BrowserRouter>
        {!this.state.isUserLoggedIn && (
          <GoogleLogin className="google-login"
            clientId={FirebaseConfig.googleLoginKey}
            scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/photoslibrary"
            //scope="[https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/userinfo.profile, openid, https://www.googleapis.com/auth/drive.readonly]"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
          >
            <span ref={this.googleButton}> Login with Google</span>
          </GoogleLogin>

        )}
        {this.state.isUserLoggedIn && (
          <GoogleLogout
            render={renderProps => (
              <button
                className="logout-button"
                onClick={renderProps.onClick}
              >
                Log Out
              </button>
            )}
            onLogoutSuccess={this.logout}
          />
        )}
        <Button onClick={e => (console.log(this.googleButton))}>Test</Button>
        {/*    <Nav.Link href="/ProductDetails/1">Products</Nav.Link> */}
        <Link to="/"> Home</Link>
        <span>-</span>
        <Link to={{ pathname: '/ProductDetails/1', query: { the: 'query' } }} > InApp Products</Link>
        <SafeLink to={{ pathname: '/MyShelf', query: { the: 'query' } }} loginBtn={this.googleButton} requireAuth={true} > My Shelf</SafeLink>
        <SafeLink to={{ pathname: '/AddEdit/1', query: { the: 'query' } }} loginBtn={this.googleButton} requireAuth={true} > Add New</SafeLink>
        {/*   <GithubCorner /> */}
        <main>

          <Switch>
            <Route path="/" component={App} exact />
            <Route path="/MyShelf" component={MyShelf} exact />
            <Route path="/ProductDetails/:id" component={ProductDetails} exact />
            <Route path="/AddEdit/:id" component={AddEditProduct} rexact />
          </Switch>
        </main>

        <FloatCart />
      </BrowserRouter>
    )
  }
}

