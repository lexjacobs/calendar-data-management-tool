import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCtFeulf5kxh2NqnpGhLPCtKWoYfOzFe9A",
  authDomain: "natter-calendar-tool.firebaseapp.com",
  databaseURL: "https://natter-calendar-tool.firebaseio.com",
  projectId: "natter-calendar-tool",
  storageBucket: "natter-calendar-tool.appspot.com",
  messagingSenderId: "912484229847"
};

export const Firebase = firebase.initializeApp(config);
