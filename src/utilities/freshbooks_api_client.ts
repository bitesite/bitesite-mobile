import axios from 'axios';
import environment from './environment';
import * as AppAuth from 'expo-app-auth';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import apiClient from './api_client';

function authorize(refreshToken) {
  let authState;

  apiClient.get('/settings')
    .then(({ data: settings }) => {
      
      let freshbooksApiClientId;
      let freshbooksApiClientSecret;

      settings.forEach((setting) => {
        if(setting.name === 'freshbooks_api_client_id') {
          freshbooksApiClientId = setting.value;
        }
        
        if(setting.name === 'freshbooks_api_client_secret') {
          freshbooksApiClientSecret = setting.value;
        }
      });
      
      const redirectUri = Linking.makeUrl('/auth/redirect');
      const config = {
        serviceConfiguration: {
          authorizationEndpoint: `https://auth.freshbooks.com/service/auth/oauth/authorize?response_type=code`,
          tokenEndpoint: 'https://api.freshbooks.com/auth/oauth/token'
        },
        redirectUrl: redirectUri,
        clientId: freshbooksApiClientId,
        clientSecret: freshbooksApiClientSecret,
        scopes: [],
      };

      if(refreshToken) {
        return AppAuth.refreshAsync(config, refreshToken);
      } else {
        return AppAuth.authAsync(config);
      }
    })
    .then((authState) => {
      return SecureStore.setItemAsync('freshbooks_auth', JSON.stringify(authState));
    })
    .then(() => {
      return authState;
    })
    .catch(() => {
      SecureStore.deleteItemAsync('freshbooks_auth');
      return;
    });
}

const freshbooks_api_client = {
  authorized: false,
  accessToken: '',
  getFreshbooksAuth: function() {
    const getFreshbooksAuthPromise = new Promise((resolve, reject) => {
      SecureStore.getItemAsync('freshbooks_auth')
      .then((data) => {
        if(data) {
          const freshbooksAuthObject = JSON.parse(data);
          resolve(freshbooksAuthObject);
        } else {
          reject('Could not find freshbooks auth object');
        }
      })
      .catch((error) => {
        reject(error);
      })
    });

    return getFreshbooksAuthPromise;
  },
  checkAuthorization: function() {
    const checkAuthorizationPromise = new Promise((resolve, reject) => {
      this.getFreshbooksAuth()
      .then((freshbooksAuthObject) => {
        if(moment().isAfter(freshbooksAuthObject.accessTokenExpirationDate)) {
          const authState = authorize(freshbooksAuthObject.refreshToken);
  
          if(authState) {
            console.log("Token refreshed.");
            resolve(true);
          } else {
            console.log("No token found.");
            resolve(false);
          }
        } else {
          console.log("Active token.");
          resolve(true);
        }
      })
      .catch((error) => {
        resolve(false);
      });
    });

    return checkAuthorizationPromise;
  },
  authorize: function() {

    const authorizePromise = new Promise((resolve, reject) => {

      const authState = authorize();

      if(authState) {        
        resolve(true);
      } else {
        resolve(false);
      }
    });

    return authorizePromise;
  },
  get: function(url) {

    const getPromise = new Promise((resolve, reject) => {
      this.getFreshbooksAuth()
      .then((freshbooksAuthObject) => {
        const internal_freshbooks_api_client = axios.create({
          baseURL: `https://api.freshbooks.com/`,
          headers: {
            'Accept': 'application/json',
            'Api-version': 'alpha',
            'Authorization': `Bearer ${freshbooksAuthObject.accessToken}`
          },
        });
    
        internal_freshbooks_api_client.get(url).then((response) => {
          resolve(response);
        })
        .catch(() => {
          reject();
        });
      });
    });

    return getPromise;


  }
};

export default freshbooks_api_client;