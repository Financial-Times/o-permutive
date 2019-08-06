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
	 * @param {Object} [opts={}] - An options object for configuring the component
	 * @param {HTMLElement} [oPermutiveEl] - The component element in the DOM
	 */
	constructor(opts, oPermutiveEl) {
		if (instance) {
			return instance;
		}

		const options = oPermutiveEl ? mergeOptions(opts, oPermutiveEl): opts;
		if (!(options.publicApiKey && options.projectId)) {
			throw new Error('o-permutive: Could not initialise. No project ID or public API Key found in options.');
		}

		// Don't run anything without consent
		if (options.consent || (options.consentFtCookie && getConsentFromFtCookie())) {
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
	static init(opts, el) {
		// Permutive must not run in the editorial preview functionality
		if (typeof window !== 'undefined' && window.location) {
			if( /^(.*\.)?preview\./.test(window.location.host) ){ return false;}
		}
		// No element specified
		if(!el) {
			// Try to find an o-permutive element
			const permutiveEl = document.querySelector('[data-o-component="o-permutive"]');
			if (permutiveEl) {
				return new Permutive(opts, permutiveEl);
			}
			// No o-permutive element found, initialise programaticaly
			else {
				return new Permutive(opts);
			}
		}

		// Selector for o-permutive component
		if (!(el instanceof HTMLElement)) {
			el = document.querySelector(el);
			if(el) {
				return new Permutive(opts, el);
			}
		}

		// o-permutive HTML component
		if (el instanceof HTMLElement && el.matches('[data-o-component="o-permutive"]')) {
			return new Permutive(opts, el);
		}

		throw new Error('o-permutive: could not initialise. No element of type [data-o-component="o-permutive"] found on the page');
	}


	/**
	 * Send User Identity data to Permutive
	 * @param {Object} userIds
	 */
	static identifyUser(userIden) {
		window.permutive.identify(userIden);
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
