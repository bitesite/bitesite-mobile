import Constants from 'expo-constants';

function getEnvironment() {
  let releaseChannel = Constants.manifest.releaseChannel;

  if (releaseChannel === undefined) {
    // no releaseChannel (is undefined) in dev
    return { 
      name: 'DEVELOPMENT',
      apiHost: 'http://localhost:3000',
    }; // dev env settings
  }
  if (releaseChannel.indexOf('staging') !== -1) {
    // matches staging-v1, staging-v2
    return { 
      name: 'STAGING',
      apiHost: 'https://bitesitestaging.herokuapp.com',
    }; // stage env settings
  }
  if (releaseChannel.indexOf('production') !== -1) {
    // matches prod-v1, prod-v2, prod-v3
    return { 
      name: 'PRODUCTION',
      apiHost: 'https://www.bitesite.ca',
    };
  }
}

export default getEnvironment();