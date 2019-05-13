


const getUserData = function(target) {
	if(!target) { return Promise.resolve({}); }
	return fetch(target, {
		timeout: 2000,
		useCorsProxy: true,
		credentials: 'include'
	})
		.then( res => res.json())
		.catch(() => Promise.resolve({}));

};

const getArticlePageData = function(target, timeout) {
	if(!target) { return Promise.resolve({}); }

	timeout = timeout || 2000;
	return fetch(target, {
		timeout: timeout,
		useCorsProxy: true
	})
		.then( res => res.json())
		.catch(() => Promise.resolve({}));
};

const handleResponse = function(response) {
		let userIden = {};
		let userDemog = {};
		let pageMeta = {};

 if (response[0] && response[0].dfp && response[0].dfp.targeting ) {
	 userIden.spoorID = response[0].dfp.targeting[0].value;
	 userIden.guid = response[0].dfp.targeting[1].value;
 }

 if (response[0] && response[0].dfp && response[0].dfp.targeting ) {
 	userDemog.industry = response[0].dfp.targeting[5].value;
 }

 if (response[1] && response[1].krux && response[1].krux.attributes ) {
 	pageMeta.topics = response[1].krux.attributes[0].value;
 }

	return [userIden, userDemog, pageMeta];
};

let api = function(userEndpoint, contentEndpoint, contentId) {
	return Promise.all([getUserData(userEndpoint), getArticlePageData(contentEndpoint + contentId)])
		.then(handleResponse.bind(this));
};

export default api;
