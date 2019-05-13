/*global require*/
import oPermutive from './../../main.js';

// document.addEventListener('DOMContentLoaded', function() {
// 	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
// });
let oPermConf = {
	"appInfo" : {
			"appName" : "article",
			"contentId" : "5cfae92e-6cc5-11e9-80c7-60ee53e6681d"
		},
		"publicApiKeys" : {
			"id" : "e1c3fd73-dd41-4abd-b80b-4278d52bf7aa",
			"key" : "b2b3b748-e1f6-4bd5-b2f2-26debc8075a"
		},
		"adsApi" : {
			"user" : "https://ads-api.ft.com/v1/user",
			"content" : "https://ads-api.ft.com/v1/content/"
		}
	}
oPermutive.init('.o-permutive', oPermConf);
