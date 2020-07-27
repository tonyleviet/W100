import firebase from 'firebase/app';
import 'firebase/storage';

export const FirebaseConfig = {
  googleLoginKey:"160676287472-d9h4ut1ghlfa5rdbqgbdp74t01m0mc3h.apps.googleusercontent.com",// process.env.GOOGLE_LOGIN_APIKEY,
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DBURL,
  projectId: process.env.REACT_APP_PROJID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MSGSENDERID,
  appId: process.env.REACT_APP_APPID
};


export const FirebaseApp =  firebase.initializeApp(FirebaseConfig)