import merge from 'lodash.merge';
import { bootstrapPolyfill, bootstrapConfig } from './bootstrap';
import { attributeToOption } from './attributes';

const PERMUTIVE_URL = "https://cdn.permutive.com";

const getPScriptURI = permutiveApiId =>
	`${PERMUTIVE_URL}/${permutiveApiId}-web.js`;


function validateOptions (opts, oPermutiveEl) {
	const options = Object.assign({}, opts || getDataAttributes(oPermutiveEl));

	if (!(options.publicApiKey && options.projectId)) {
		throw new Error('o-permutive: No project ID or public API Key found in options.');
	}

	return options;
}


function getDataAttributes(oPermutiveEl) {
	if (!(oPermutiveEl instanceof HTMLElement)) {
		return {};
	}

	return merge({}, ...Object.keys(oPermutiveEl.dataset)
		.map((optKey) => attributeToOption({ optKey, optValue: oPermutiveEl.dataset[optKey] }))
	);
}


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
	const permutiveURI = getPScriptURI(options.projectId);

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

		const options = validateOptions(opts, oPermutiveEl);

		// Run the Permutive bootstrap code
		bootstrapConfig(options.projectId, options.publicApiKey);

		attachPermutiveScript(options);
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
		if (rootEl instanceof HTMLElement) {
			if (rootEl.matches('[data-o-component="o-permutive"]')) {
				return new Permutive(rootEl, opts);
			}

			const permutiveEl = rootEl.querySelector('[data-o-component="o-permutive"]');
			if (permutiveEl) {
				return new Permutive(permutiveEl, opts);
			}

			throw new Error('o-permutive: could not initialise. No element of type [data-o-component="o-permutive"] found on the page');
		}
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
		if(window.permutive) {
			window.permutive.addon('web', pageMeta);
		} else {
			window.permutive = {
				q: [function() { window.permutive.addon('web', pageMeta); }]
			};
		}
	}
}

// Need to call here so that window.permutive is
// available to public methods of Permutive()
bootstrapPolyfill();

export default Permutive;
