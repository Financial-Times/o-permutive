import bootstrap from './bootstrap';
import api from './api';
import identifyUser from './identifyUser';

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

function attachPermutiveScript() {
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

		attachPermutiveScript()

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
		return Object.keys(oPermutiveEl.dataset).reduce((options, key) => {

			// Ignore data-o-component
			if (key === 'oComponent') {
				return options;
			}

			// Build a concise key and get the option value
			const shortKey = key.replace(/^oPermutive(w)(w+)$/, (m, m1, m2) => m1.toLowerCase() + m2);
			const value = oPermutiveEl.dataset[key];

			// Try parsing the value as JSON, otherwise just set it as a string
			try {
				options[shortKey] = JSON.parse(value.replace(/'/g, '"'));
			} catch (error) {
				options[shortKey] = value;
			}

			return options;
		}, {});
	}

	/**
	 * Initialise the component.
	 * @param {(HTMLElement|String)} rootElement - The root element to intialise the component in, or a CSS selector for the root element
	 * @param {Object} [opts={}] - An options object for configuring the component
	 * @returns {(Permutive|Array<Permutive>)} - Permutive instance(s)
	 */
	static init(rootEl, opts) {
		if (!rootEl) {
			rootEl = document.body;
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
	 * Add data to Permutive
	 * @param {Object} userDemog
	 * @param {Object} pageMeta
	 */
	static pAddon(userDemog, pageMeta) {
		let user = { "user": Object.assign(userDemog) };
		let data = { "page": Object.assign(pageMeta, user) };
		window.permutive.addon('web', data);
	}
}

export default Permutive;
