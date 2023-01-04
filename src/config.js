import firebase from 'firebase';
import "@firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyA2Zp8QMM-QiBoiuOggckHuX5rOY-MbI3w",
    authDomain: "localpsyche.firebaseapp.com",
    projectId: "localpsyche",
    storageBucket: "localpsyche.appspot.com",
    messagingSenderId: "751203184776",
    appId: "1:751203184776:web:367eecd73ea2f320cb6f3d",
    measurementId: "G-G7PYM4SHZR"
}; 


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storageRef = firebase.storage().ref();
const storage = firebase.storage();
const auth = firebase.auth();
  
export {db, auth, storageRef, storage};