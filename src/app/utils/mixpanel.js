// import mixpanel from 'mixpanel-browser';

// mixpanel.init('43a2deba9cc41122a2aa7042c9d35cdb', {
// 	debug: true
// }, {
// 	host: "api-eu.mixpanel.com",
// },
// );

// utils/mixpanel.js
import mixpanel from 'mixpanel-browser';

if (typeof window !== 'undefined' && !mixpanel.__initialized) {
  console.log('Initializing Mixpanel...');
  mixpanel.init('43a2deba9cc41122a2aa7042c9d35cdb', { debug: true });
  mixpanel.__initialized = true;
} else {
  console.log('Mixpanel already initialized or running on server.');
}

export default mixpanel;
