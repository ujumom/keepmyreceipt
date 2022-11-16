importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
const config = {
  apiKey: 'AIzaSyDGykCVGG6PGRdGT8-Y5H7aQAIcr_27Tqs',
  authDomain: 'keep-my-receipt.firebaseapp.com',
  databaseURL: 'https://imap-push-server.firebaseio.com',
  projectId: 'keep-my-receipt',
  storageBucket: 'keep-my-receipt.appspot.com',
  messagingSenderId: '891638757148',
};
firebase.initializeApp(config);
