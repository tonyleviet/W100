import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import * as ROUTES from "../../../constants/routes"
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { FirebaseConfig } from '../../../services/FirebaseApp';
import { AuthService } from '../../../services/AuthService';
import { FirebaseService } from '../../../services/FirebaseService';


class Login extends Component {
    constructor(props) {
        super(props)

        //const isUserLoggedIn = false;
        this.state = {
            isUserLoggedIn: false,
            currentUser: {},
        };
        AuthService.currentUser().then(user => {
            if (user) {
                console.log('Login constructor', user);
                this.setState({ isUserLoggedIn: true });
                this.setState({ currentUser: user });
            }
        });
    }
    responseGoogle = response => {
        console.log('this.responseGoogle ', response);
        console.log('this.responseGoogle ', response);

        AuthService.onSignIn({ Id: response.googleId, Name: response.profileObj.name, Email: response.profileObj.email }).then(rsSign => {
            console.log("AuthService.onSignIn rsSign", rsSign);

            if (rsSign.cityID) {
                localStorage.setItem('selectedCity', rsSign.cityID);
            }
            if (rsSign.districtID) {
                localStorage.setItem('selectedDistrict', rsSign.districtID);
            }

            FirebaseService.signIn(response.wc.id_token, response.wc.access_token).then(rs => {
                console.log("FirebaseService.signIn rs", rs);
                this.setState({ isUserLoggedIn: true });
            });
        });
    };

    logout = () => {
        // this.setState({ isUserLoggedIn: false })
    };
    render() {
        /*  <Link
             className="text-white font-helvetica text-base-14 font-medium tracking-wider"
             to={ROUTES.LOGIN.link} >
             {ROUTES.LOGIN.name}
         </Link > */
        return (<div>
            {!this.state.isUserLoggedIn && (
                <GoogleLogin className="google-login"
                    clientId={FirebaseConfig.googleLoginKey}
                    scope="https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/photoslibrary"
                    //scope="[https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/userinfo.profile, openid, https://www.googleapis.com/auth/drive.readonly]"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                >
                    <span > Login with Google</span>
                </GoogleLogin>

            )}
            {
                this.state.isUserLoggedIn && (
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
                )
            }
        </div >);

    }
}
const mapStateToProps = state => ({
});
export default connect(
    mapStateToProps,
    {}
)(Login);