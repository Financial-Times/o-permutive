import bootstrap from './bootstrap';
import api from './api';
import identifyUser from './identifyUser';
import merge from 'lodash.merge';

const ATTRIBUTE_PATTERN = 'oPermutive';

// TODO Consents can be derived outside of the package and passed in as config.
function getConsents() {
	// derive consent options from ft consent cookie
	const re = /FTConsent=([^;]+)/;
	const match = document.cookie.match(re);
	if (!match) {
		// cookie stasis or no consent cookie found
		return {
			behavioral: false
		};
	}
	const consentCookie = decodeURIComponent(match[1]);
	return {
		behavioral: consentCookie.indexOf('behaviouraladsOnsite:on') !== -1
	};
}

function attachPermutiveScript(options) {
	const url = "https://cdn.permutive.com/" + options.publicApiKeys.id + "-web.js";
	if(!document.querySelector(`script[src="${url}"]`)) {
		const s = document.createElement("script");
		const HEAD = document.head || document.getElementsByTagName('head')[0];
		s.async = "true";
		s.type = "text/javascript";
		s.id = "permutive-script";
		s.src = "https://cdn.permutive.com/" + options.publicApiKeys.id + "-web.js";
		HEAD.appendChild(s);
	}
}


class Permutive {
	/**
	 * Class constructor.
	 * @param {HTMLElement} [oPermutiveEl] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor(oPermutiveEl, opts) {
		const options = Object.assign({}, opts || Permutive.getDataAttributes(oPermutiveEl));

		if(!options.publicApiKeys) {
			return false;
		}

		// By default Permutive assumes consent has been given -
		// we should not run any permutive code when we dont have user
		// consent for behavioural profiling.
		if (!getConsents().behavioral) {
			return false;
		}

		// Run the Permutive bootstrap code
		bootstrap(options.publicApiKeys.id, options.publicApiKeys.key);

		attachPermutiveScript(options);

		// possibly meta-data can be passed from a shared state (or o-ads)
		// or possibly pass meta-data as config and / or api-endpoints
		if (options.adsApi) {
			api(options.adsApi.user, options.adsApi.content, options.appInfo.contentId).then(
				function (res) {
					if (res[0] && res[0].guid) {
						identifyUser(res[0]);
					}
					Permutive.pAddon(res[1], res[2]);
				}
			);
		}
	}

	static mapKey(key) {
		switch(key) {
			case 'apiinfo':
				return 'apiInfo';
			case 'contentapi':
				return 'contentApi';
			case 'contentid':
				return 'contentId';
			case 'ocomponent':
				return 'oComponent';
			case 'pagetype':
				return 'pageType';
			case 'userapi':
				return 'userApi';
			default:
				return key;
		}
	}

	static attributeToOption({ optKey, optValue }) {
		const regex = new RegExp(`(^${ATTRIBUTE_PATTERN})?([A-Z][a-z]+)`, 'g');
		const [/* mWhole */, mPrefix, mOpt] = regex.exec(optKey) || [];

		const shortOptKey = mPrefix
			? mOpt
				? mOpt
				: optKey
			: optKey;

		const [/* mWhole2 */, /* mPrefix2 */, mOpt2] = regex.exec(optKey) || [];

		return {
			[Permutive.mapKey(shortOptKey.toLowerCase())]: mOpt2
				? { [Permutive.mapKey(mOpt2.toLowerCase())]: optValue }
				: optValue,
		};
	}

	/**
	 * Get the data attributes from the PermutiveElement. If the component is being set up
	 * declaratively, this method is used to extract the data attributes from the DOM.
	 * @param {HTMLElement} oPermutiveEl - The component element in the DOM
	 * @returns {Object} - Data attributes as an object
	 */
	static getDataAttributes(oPermutiveEl) {
		if (!(oPermutiveEl instanceof HTMLElement)) {
			return {};
		}

		return merge({}, ...Object.keys(oPermutiveEl.dataset)
			.map((optKey) => this.attributeToOption({ optKey, optValue: oPermutiveEl.dataset[optKey] }))
		);
	}

	/**
	 * Initialise the component.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise the component in, or a CSS selector for the root element
	 * @param {Object} [opts={}] - An options object for configuring the component
	 * @returns {(Permutive|Array<Permutive>)} - Permutive instance(s)
	 */
	static init(rootEl, opts) {
		if (!rootEl) {
			rootEl = document.head;
		}
		if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		if (rootEl instanceof HTMLElement && rootEl.matches('[data-o-component=o-permutive]')) {
			return new Permutive(rootEl, opts);
		}
		return Array.from(rootEl.querySelectorAll('[data-o-component="o-permutive"]'), rootEl => new Permutive(rootEl, opts));
	}

	/**
	 * Temporary method while ads-api call is still inside oPermutive oComponent
	 * TODO: remove ads-api from o-permutive and pass all page-meta-data via public method
	 * @param {Object} userDemog
	 * @param {Object} pageMeta
	 */
	let pAddon(userDemog, pageMeta) {
		let user = { "user": Object.assign(userDemog) };
		let data = { "page": Object.assign(pageMeta, user) };
		window.permutive.addon('web', data);
	}

	/**
	 * Send Page-visit meta data to Permutive
	 * @param {Object} pageMeta
	 */
	static setPageMetaData(pageMeta) {
		window.permutive.addon('web', pageMeta);
	}
}

export default Permutive;
