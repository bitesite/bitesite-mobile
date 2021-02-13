import axios from 'axios';
import environment from './environment';
import * as AppAuth from 'expo-app-auth';
import * as Linking from 'expo-linking';
import * as SecureStore from 'expo-secure-store';

import apiClient from './api_client';

const freshbooks_api_client = {
  authorized: false,
  accessToken: '',
  checkAuthorization: function() {

    const checkAuthorizationPromise = new Promise((resolve, reject) => {

      SecureStore.getItemAsync('freshbooks_auth')
      .then((data) => {
        if(data) {
          const freshbooksAuthObject = JSON.parse(data);
          this.authorized = true;
          this.accessToken = freshbooksAuthObject.accessToken;
        
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject();
      });
    });

    return checkAuthorizationPromise;

  },
  authorize: function() {

    const authorizePromise = new Promise((resolve, reject) => {
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
  
        return AppAuth.authAsync(config);
      })
      .then((authState) => {
        return SecureStore.setItemAsync('freshbooks_auth', JSON.stringify(authState))
      })
      .then(() => {
        console.log("Freshbooks auth stored!");
        resolve();
      })
      .catch((error) => {
        reject();
      });
    });

    return authorizePromise;
  },
  get: function(url, callback) {
    const internal_freshbooks_api_client = axios.create({
      baseURL: `https://api.freshbooks.com/`,
      headers: {
        'Accept': 'application/json',
        'Api-version': 'alpha',
        'Authorization': `Bearer ${this.accessToken}`
      },
    });

    internal_freshbooks_api_client.get(url).then(callback);
  }
};

export default freshbooks_api_client;