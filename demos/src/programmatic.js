/*global require*/
import Permutive from '../../main.js';

let oPermConf = {
	appInfo: {
		appName: "article",
		contentId: "5cfae92e-6cc5-11e9-80c7-60ee53e6681d",
	},
	publicApiKeys: {
		id: "e1c3fd73-dd41-4abd-b80b-4278d52bf7aa",
		key: "b2b3b748-e1f6-4bd5-b2f2-26debc8075a3",
	},
	adsApi: {
		user: "https://ads-api.ft.com/v1/user",
		content: "https://ads-api.ft.com/v1/content/",
	}
};

document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';

// Initialise oPermutive individually
new Permutive(false, oPermConf);

// Set the page metadata
Permutive.pAddon({
	type: "article", // e.g. "home" or "article"
	article: {
		id: "5cfae92e-6cc5-11e9-80c7-60ee53e6681d",
		title: "A nice article indeed!",
		type: "economics", // genre
		people: ["John Dorie", "Karl Marx", "Adam Smith"],
		categories: ["blueberries", "savings", "money"],
		authors: ["John Unknown"],
		topics: ["vegetables", "drama", "flowers"],
		admants: ["another", "list", "of", "string"]
	},
	user: {
		industry: "Oil and gas",
		position: "Salesman",
		responsibility: "I manage pipelines"
	}
});
