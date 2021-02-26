import axios from 'axios';
import environment from './environment';
import * as AppAuth from 'expo-app-auth';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';
import apiClient from './api_client';

const FRESHBOOKS_AUTH_KEY = 'freshbooks_auth';

function internalAuthorize(refreshToken) {
  
  const internalAuthorizePromise = new Promise((resolve, reject) => {
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
          console.log("Attempt to refresh token...");
          return AppAuth.refreshAsync(config, refreshToken);
        } else {
          return AppAuth.authAsync(config);
        }
      })
      .then((returnedAuthState) => {
        authState = returnedAuthState;
        return SecureStore.setItemAsync(FRESHBOOKS_AUTH_KEY, JSON.stringify(authState));
      })
      .then(() => {
        resolve(authState);
      })
      .catch(() => {
        SecureStore.deleteItemAsync(FRESHBOOKS_AUTH_KEY).then(() => {
          resolve();
        });
      });
  });

  return internalAuthorizePromise;

}

function getFreshbooksAuth() {

  const getFreshbooksAuthPromise = new Promise((resolve, reject) => {
    SecureStore.getItemAsync(FRESHBOOKS_AUTH_KEY)
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
};

const freshbooks_api_client = {
  checkAuthorization: function() {
    const checkAuthorizationPromise = new Promise((resolve) => {
      getFreshbooksAuth()
      .then((freshbooksAuthObject) => {

        if(moment().isAfter(freshbooksAuthObject.accessTokenExpirationDate)) {
          
          internalAuthorize(freshbooksAuthObject.refreshToken).then((authState) => {
            if(authState) {
              console.log("Freshbooks Token refreshed.");
              resolve(true);
            } else {
              console.log("No Freshbooks Token found.");
              resolve(false);
            }
          });
  
        } else {
          console.log("Freshbooks token active.");
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

      internalAuthorize().then((authState) => {
        if(authState) {        
          resolve(true);
        } else {
          resolve(false);
        }
      });

    });

    return authorizePromise;
  },
  get: function(url) {

    const getPromise = new Promise((resolve, reject) => {
      getFreshbooksAuth()
      .then((freshbooksAuthObject) => {
        const internalFreshbooksApiClient = axios.create({
          baseURL: `https://api.freshbooks.com/`,
          headers: {
            'Accept': 'application/json',
            'Api-version': 'alpha',
            'Authorization': `Bearer ${freshbooksAuthObject.accessToken}`
          },
        });
    
        internalFreshbooksApiClient.get(url).then((response) => {
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