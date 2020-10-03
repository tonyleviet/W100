import React, { Component } from "react";
import { connect } from 'react-redux';
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
import Shelf from './components/Shelf';
import ProductDetails from './components/ProductDetails';
import AddEditProduct from './components/AddEditProduct';
import GithubCorner from './components/github/Corner';
import FloatCart from './components/FloatCart';
import SafeLink from './components/SafeLink';
import { Nav } from 'react-bootstrap';
import Filter from './components/Shelf/Filter';
import { stateUpdate } from './services/shelf/actions';
import i18n from './i18n';
import { Button } from "reactstrap";
import { use } from "chai";


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




class Routes extends Component {
  mounted = false;
  constructor(props) {
    super(props)
    this.handleSetttings();
    this.state = {
      isUserLoggedIn: false,
      currentUser: {},
      pageSize: 10,
      pageIndex: 1,
      defaultProducts: [],
      selectedCity: 0,
      selectedDistrict: 0,
      mounted: false,
    };
    this.googleButton = React.createRef();
    // i18n.changeLanguage('vn');
    console.log('Routes Component', props);
  }
  componentWillMount() {
    this.mounted = true;
    if (this.mounted == true) {
      //this.fetchProducts();
      AuthService.currentUser().then(user => {
        if (user) {
          console.log('Routes componentWillMount ', user)
          this.setState({ isUserLoggedIn: true });
          this.setState({ currentUser: user });
        }
      });
      const selectedCity = localStorage.getItem('selectedCity');
      const selectedDistrict = localStorage.getItem('selectedDistrict');
      if (selectedCity) {
        console.log('constructor index shelf selectedCity ', selectedCity, ' selectedDistrict ', selectedDistrict);

        this.setState({ selectedCity: selectedCity });
      }
      if (selectedDistrict) {
        this.setState({ selectedDistrict: selectedDistrict });
      }
    }
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  handleSetttings() {
    SettingService.getAppSettings().then(results => {
      if (!results) {
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
      }
    });
    SettingService.getCities().then(results => {
      if (!results) {
        FirebaseService.citiesCollection().get().then((querySnapshot) => {
          const cityData = [];
          cityData.push({ value: 0, label: 'Select a city', Order: 0 });
          querySnapshot.forEach((doc) => {
            const { CityID, City, Order } = doc.data();
            cityData.push({ value: CityID, label: City, Order });
          });
          console.log('FirebaseService.settingsCollection cityData', cityData);
          SettingService.storeCities(cityData);
          //props.stateUpdate({prop:"cities",value: cityData});
          //cities = cityData;
        });
      }
    });

    SettingService.getDistricts().then(results => {
      if (!results) {
        FirebaseService.districtsCollection()
          .get().then((querySnapshot) => {
            const districtData = [];
            districtData.push({ CityID: 0, City: '', value: 0, label: 'Select a city first', Order: 0 });
            querySnapshot.forEach((doc) => {
              const { CityID, City, DistrictID, District, Order } = doc.data();
              districtData.push({ CityID, City, value: DistrictID, label: District, Order });
            });
            console.log('FirebaseService.settingsCollection districtData', districtData);
            SettingService.storeDistricts(districtData);
            //props.stateUpdate({prop:"districts", value: districtData});
          });
      }
    });
  }
  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  responseGoogle = response => {
    console.log('this.responseGoogle ', response);

    AuthService.onSignIn({ Id: response.googleId, Name: response.profileObj.name, Email: response.profileObj.email }).then(rsSign => {
      console.log("AuthService.onSignIn rsSign", rsSign);

      AuthService.currentUser().then(user => {
        if (user) {
          this.setState({ isUserLoggedIn: true });
          this.setState({ currentUser: user });
        }
      });

      this.setState({ selectedCity: rsSign.cityID });

      if (rsSign.cityID) {
        localStorage.setItem('selectedCity', rsSign.cityID);
      }
      if (rsSign.districtID) {
        localStorage.setItem('selectedDistrict', rsSign.districtID);
      }

      FirebaseService.signIn(response.wc.id_token, response.wc.access_token).then(rs => {
        console.log("FirebaseService.signIn rs", rs);
        this.setState({ isUserLoggedIn: true });

        //stateUpdate({ prop: 'selectedCity', value: rsSign.cityID}); 
        /* FirebaseService.activeProductsCollection(this.state.pageIndex, this.state.pageSize, rsSign.cityID, rsSign.districtID).get()
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
  
            console.log("defaultProducts:", products);
            this.setState({ defaultProducts: products });
            
          });*/
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
                Log Out {this.state.currentUser.Name}
              </button>
            )}
            onLogoutSuccess={this.logout}
          />
        )}
        <Button onClick={e => (console.log(this.googleButton))}>Test</Button>
        {/*    <Nav.Link href="/ProductDetails/1">Products</Nav.Link> */}
        <Link to={{ pathname: '/', query: { city: this.state.selectedCity } }}> Home</Link>
        <span>-</span>
        <Link to={{ pathname: '/ProductDetails/1', query: { the: 'query' } }} > InApp Products</Link>
        <SafeLink to={{ pathname: '/MyShelf', query: { the: 'query' } }} loginbtn={this.googleButton} requireauth={1} > My Shelf</SafeLink>
        <SafeLink to={{ pathname: '/AddEdit/1', query: { the: 'query' } }} loginbtn={this.googleButton} requireauth={1} > Add New</SafeLink>
        {/*   <GithubCorner /> */}
        <main>

          <Switch>
            <Route path="/" component={() => (<Shelf defaultCity={this.state.selectedCity} defaultDistrict={this.state.selectedDistrict} />)} exact />
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


const mapStateToProps = state => ({
  selectedCity: state.shelf.selectedCity,
  selectedDistrict: state.shelf.selectedDistrict,
});
export default connect(
  mapStateToProps,
  { stateUpdate }
)(Routes);
