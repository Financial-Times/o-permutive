import { bootstrapPolyfill, bootstrapConfig } from './bootstrap';
import { mergeOptions, getConsentFromFtCookie, attachPermutiveScript } from './utils';

// Need to polyfill window.permutive so that it's
// available to public methods of Permutive class
bootstrapPolyfill();

// Only one Permutive instance should exist
let instance = null;

class Permutive {

	/**
	 * Class constructor.
	 * @param {HTMLElement} [oPermutiveEl] - The component element in the DOM
	 * @param {Object} [opts={}] - An options object for configuring the component
	 */
	constructor(oPermutiveEl, opts) {
		if (instance) {
			return instance;
		}

		const options = mergeOptions(opts, oPermutiveEl);
		if (!(options.publicApiKey && options.projectId)) {
			throw new Error('o-permutive: Could not initialise. No project ID or public API Key found in options.');
		}

		// Don't run anything without consent
		if (options.consent || (options.consentFtCookie && getConsentFromFtCookie)) {
			// Run the Permutive bootstrap code
			bootstrapConfig(options.projectId, options.publicApiKey);

			attachPermutiveScript(options.projectId);
			instance = this;
			return instance;
		}
		else {
			throw new Error('o-permutive: Could not initialise. No consent found');
		}
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

			console.warn('o-permutive: could not initialise. No element of type [data-o-component="o-permutive"] found on the page');
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
		window.permutive.addon('web', pageMeta);
	}

	// For testing - TODO: find a better way
	static resetInstance() {
		instance = null;
	}
}

export default Permutive;
