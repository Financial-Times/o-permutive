/*global require*/
import Permutive from '../../main.js';

document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';

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
