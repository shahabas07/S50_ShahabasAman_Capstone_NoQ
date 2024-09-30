import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"

// const firebaseConfig = {
//   apiKey: firebasevariables.apiKey,
//   authDomain: firebasevariables.authDomain,
//   projectId: firebasevariables.projectId,
//   storageBucket: firebasevariables.storageBucket,
//   messagingSenderId: firebasevariables.messagingSenderId,
//   appId: firebasevariables.appId,
//   measurementId: firebasevariables.measurementId
// };
const firebaseConfig = {
    apiKey: "AIzaSyDtq3hXH9UdMGpZVR2-zHeif_L8CXQOj0U",
    authDomain: "nowq-85c44.firebaseapp.com",
    projectId: "nowq-85c44",
    storageBucket: "nowq-85c44.appspot.com",
    messagingSenderId: "625094638326",
    appId: "1:625094638326:web:06f76bd52fe08eebb10ad7",
    measurementId: "G-5PEBDN5FN7"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imDB = getStorage(app)
const analytics = getAnalytics(app);

export {imDB};