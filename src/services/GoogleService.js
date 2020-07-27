import { GoogleSignin, statusCodes } from 'react-native-google-signin';
import { AuthService } from './AuthService';
const IS_IOS = Platform.OS === 'ios';

class GoogleService {

  static configure() {
    GoogleSignin.configure({
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/photoslibrary', 'openid', 'https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '160676287472-vjns16cj6p918rhdq7jjoa6rfnks815q.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      //accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }

  static signIn() {
    return new Promise((resolve, reject) => {
      GoogleSignin.hasPlayServices()
        .then(() => {
          GoogleSignin.signIn()
            .then(userInfo => {
              console.log('GoogleService.signIn userInfo: ',userInfo);
              AuthService.onSignIn(userInfo);
              // this.setState({CurrentUser: userInfo}); 
              /*var gettoken =  GoogleSignin.currentUserAsync(userInfo).then((token) => {
                  console.log('USER token', token);
                  this.setState({user: user});
              }).done();
              */
              /*var token;
              if (IS_IOS) {
                  token = await RNGoogleSignin.getTokens();
                  
              } else {
                var userObject = await RNGoogleSignin.getTokens();
                token = userObject.accessToken;
                  
              }
               userInfo.accessToken=token;              
              */
              resolve(userInfo);
            })
            .catch(error => {
              console.log(error);
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                reject();
              } else {
                reject(error);
              }
            });
        })
        .catch(error => { reject(error); });
    });
  }

  static signInSilentlyIfNeeded() {

    return GoogleSignin.signInSilently();
  }

  static async signOut() {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  }

  static async getTokens() {
    var token = await GoogleSignin.getTokens();
    console.log('getTokens ', token);
    return token;
  }
}

export { GoogleService };
