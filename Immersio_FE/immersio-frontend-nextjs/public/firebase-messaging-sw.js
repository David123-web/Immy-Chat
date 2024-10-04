importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');


firebase.initializeApp({
  //AN TRAN
  // apiKey: "AIzaSyCqgx7DtihhRd22p79sunqia75uDw4j2TY",
  // authDomain: "fir-fcm-88172.firebaseapp.com",
  // projectId: "fir-fcm-88172",
  // storageBucket: "fir-fcm-88172.appspot.com",
  // messagingSenderId: "1077512019744",
  // appId: "1:1077512019744:web:24a48132ffd368f1ea0145"
  //IMMERSIO
  apiKey: "AIzaSyCls3Ownx7PsLZDi3-K-KTfVgSrqvzlb3A",
  authDomain: "oauth-immersio.firebaseapp.com",
  projectId: "oauth-immersio",
  storageBucket: "oauth-immersio.appspot.com",
  messagingSenderId: "667199024418",
  appId: "1:667199024418:web:211b9b5c963ffb63a4497b",
  measurementId: "G-P309L1EZ7C"
});

const messaging = firebase.messaging();
