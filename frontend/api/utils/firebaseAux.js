import axios from 'axios';
import { FIREBASE_AUTH } from '../../FirebaseConfig'


export const getToken = async () => {

  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    token = await user.getIdToken();
    //console.log('Token stored:', token);
    return token;
  }

  return null;
};


// Make API request with Firebase token
export const request = async (method, url, data) => {
  const token = await getToken();
  //console.log('Token:', token);
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  return axios({ method, url, data, headers });
};
