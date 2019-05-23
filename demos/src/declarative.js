/*global require*/
import oPermutive from '../../main.js';

const userDemog = {
	"some": "thing"
}

const pageData = {
	"appInfo": {
		"appName": "article",
		"contentId": "5cfae92e-6cc5-11e9-80c7-60ee53e6681d"
	},
};

document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';

oPermutive.pAddon(userDemog, pageData);
