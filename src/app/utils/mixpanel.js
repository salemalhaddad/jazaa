// lib/mixpanel.js
import mixpanel from 'mixpanel-browser';

mixpanel.init('43a2deba9cc41122a2aa7042c9d35cdb', {
	debug: true
}, {
	host: "api-eu.mixpanel.com",
},
);

export default mixpanel;
