import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// Replace this with your own config details
var config = {
  apiKey: "AIzaSyAWazDJc_znJDcD23QjT5fWXzDL00gmOn4",
  authDomain: "appweb-1e486.firebaseapp.com",
  databaseURL: "https://appweb-1e486.firebaseio.com",
  projectId: "appweb-1e486",
  storageBucket: "appweb-1e486.appspot.com",
  messagingSenderId: "383941386586"
}
firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase 