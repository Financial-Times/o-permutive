import merge from 'lodash.merge';
import bootstrap from './bootstrap';
import api from './api';
import { attributeToOption } from './attributes';

const PERMUTIVE_URL = "https://cdn.permutive.com";

const getPScriptURI = permutiveApiId =>
	`${PERMUTIVE_URL}/${permutiveApiId}-web.js`;

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
		behavioral: consentCookie.includes('behaviouraladsOnsite:on')
	};
}

function attachPermutiveScript(options) {
	const permutiveURI = getPScriptURI(options.publicApiKeys.id);

	if (!document.querySelector(`script[src="${permutiveURI}"]`)) {
		const scriptTag = document.createElement("script");
		Object.assign(scriptTag, {
			async: "true",
			type: "text/javascript",
			id: "permutive-script",
			src: permutiveURI,
		});

		const HEAD = document.head || document.getElementsByTagName('head')[0];
		HEAD.appendChild(scriptTag);
	}
}

const validateOptions = ({ opts, oPermutiveEl }) => {
	const options = Object.assign({}, opts || Permutive.getDataAttributes(oPermutiveEl));

	if (!options.publicApiKeys) {
		throw new Error('o-permutive: No public API Keys found in options.');
	}

	return options;
};

class Permutive {
	/**
	 * Class constructor.
	 * @param {HTMLElement} [oPermutiveEl] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor(oPermutiveEl, opts) {
		// By default Permutive assumes consent has been given -
		// we should not run any permutive code when we dont have user
		// consent for behavioural profiling.
		if (!getConsents().behavioral) {
			return false;
		}

		const options = validateOptions({ opts, oPermutiveEl });

		// Run the Permutive bootstrap code
		bootstrap(options.publicApiKeys.id, options.publicApiKeys.key);

		attachPermutiveScript(options);

		// possibly meta-data can be passed from a shared state (or o-ads)
		// or possibly pass meta-data as config and / or api-endpoints
		if (options.adsApi) {
			api(options.adsApi.user, options.adsApi.content, options.appInfo.contentId).then(
				function (res) {
					if (res[0] && res[0].guid) {
						Permutive.identifyUser(res[0]);
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

		return merge({}, ...Object.keys(oPermutiveEl.dataset)
			.map((optKey) => attributeToOption({ optKey, optValue: oPermutiveEl.dataset[optKey] }))
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
		if (rootEl instanceof HTMLElement) {
			if (rootEl.matches('[data-o-component="o-permutive"]')) {
				return new Permutive(rootEl, opts);
			}

			const permutiveEl = rootEl.querySelector('[data-o-component="o-permutive"]');
			if (permutiveEl) {
				return new Permutive(permutiveEl, opts);
			}
		}
	}

	/**
	 * Temporary method while ads-api call is still inside oPermutive oComponent
	 * TODO: remove ads-api from o-permutive and pass all page-meta-data via public method
	 * @param {Object} userDemog
	 * @param {Object} pageMeta
	 */
	static pAddon(userDemog, pageMeta) {
		let user = { "user": Object.assign(userDemog) };
		let data = { "page": Object.assign(pageMeta, user) };
		window.permutive.addon('web', data);
	}

	/**
	 * Send User Identity data to Permutive
	 * @param {Object} userIds
	 */
	static identifyUser(userIden) {
		window.permutive.identify([
			{
				id: userIden.spoorID,
				tag: 'SporeID'
			},
			{
				id: userIden.guid,
				tag: 'GUID'
			}
		]);
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
