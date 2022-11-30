import axios from 'axios';
import { initializeApp } from "firebase/app";
// eslint-disable-next-line
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import { api } from '../constants';

const firebaseConfig = {
  apiKey: "AIzaSyBaYVyy9VAdCZpa9x2u9acdUIkaVQll2hY",
  authDomain: "captone-dfc3c.firebaseapp.com",
  projectId: "captone-dfc3c",
  storageBucket: "captone-dfc3c.appspot.com",
  messagingSenderId: "202082595172",
  appId: "1:202082595172:web:f02413d2b9d8087df34a71",
  measurementId: "G-MG4829B610"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const subscribeToTopic = (topicName) => {
  getToken(messaging, { vapidKey: 'BJRSeOjGCZprYK9nMX8IjM5ugm2aq9sJdKyeygrcSlujs3IOeiL6ONXeFIVWiV1igCWnzKUPWO2JDIyncUtC5N8' }).then((currentToken) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SUBSCRIBE_TOPIC}?topic=${topicName}`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // },
      data: [currentToken]
    }).then(() => console.log(`subscribe to ${topicName} topic successfully`))
      .catch((error) => console.log(error));
  }).catch(error => console.log(error));
};

export const unSubscribeToTopic = (topicName) => {
  getToken(messaging, { vapidKey: 'BJRSeOjGCZprYK9nMX8IjM5ugm2aq9sJdKyeygrcSlujs3IOeiL6ONXeFIVWiV1igCWnzKUPWO2JDIyncUtC5N8' }).then((currentToken) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_UNSUBSCRIBE_TOPIC}?topic=${topicName}`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // },
      data: [currentToken]
    }).then(() => console.log(`unsubscribe to ${topicName} topic successfully`))
      .catch((error) => console.log(error));
  }).catch(error => console.log(error));
};

// export const onMessageListener = () => {
//   onMessage(messaging, (payload) => {
//     console.log('Message received: ', payload);
//     return payload;
//   });
// };

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });