// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9yl0LA1s88xkRKjFKyDYFMHOzBSkrq1c",
  authDomain: "mobileshopszakdolgozat.firebaseapp.com",
  projectId: "mobileshopszakdolgozat",
  storageBucket: "mobileshopszakdolgozat.appspot.com",
  messagingSenderId: "445887927819",
  appId: "1:445887927819:web:2c825de7e5071e577e190e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;