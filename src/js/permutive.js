import bootstrap from './bootstrap';
import merge from 'lodash.merge';
const ATTRIBUTE_PATTERN = 'oPermutive';

const OPTION_PARENT_NODES = [
	'adsApi',
	'appInfo',
	'contentApi',
	'contentId',
	'oComponent',
	'pageType',
	'publicApiKeys',
	'userApi'
];


function formatOptionName(key) {
	const keyLower = key.toLowerCase();

	for (const mapped of OPTION_PARENT_NODES) {
		if (mapped.toLowerCase() === keyLower) {
			return mapped;
		}
	}

	return keyLower;
}


function validateOptions (opts, oPermutiveEl) {
	const options = Object.assign({}, opts || getDataAttributes(oPermutiveEl));

	if (!options.publicApiKeys) {
		throw new Error('o-permutive: No public API Keys found in options.');
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


/**
 * Extract the option's path from an attribute name in camelCase form - coming from the component's dataset -
 * and returns a single element object.
 *
 * @param {String} optKey - The attribute name in camelCase form, taken from the component's dataset. e.g., publicapikeysId
 * @param {String} optValue - The value assigned to optKey.
 * @returns {Object} - An object containing a single { key: "value" } or { key: { subkey: value } }
 */
function attributeToOption({ optKey, optValue }) {
	const regex = new RegExp(`(^${ATTRIBUTE_PATTERN})?([A-Z][a-z]+)`, 'g');
	const [/* mWhole */, mPrefix, mOpt] = regex.exec(optKey) || [];

	const shortOptKey = mPrefix
		? mOpt
			? mOpt
			: optKey
		: optKey;

	const [/* mWhole2 */, /* mPrefix2 */, mOpt2] = regex.exec(optKey) || [];

	return {
		[formatOptionName(shortOptKey)]: mOpt2
			? { [formatOptionName(mOpt2)]: optValue }
			: optValue,
	};
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
		behavioral: consentCookie.indexOf('behaviouraladsOnsite:on') !== -1
	};
}


function attachPermutiveScript(ApiKeyId) {
	const url = `https://cdn.permutive.com/${ApiKeyId}-web.js`;
	if(!document.querySelector(`script[src="${url}"]`)) {
		const s = document.createElement("script");
		const HEAD = document.head || document.getElementsByTagName('head')[0];
		s.async = "true";
		s.type = "text/javascript";
		s.id = "permutive-script";
		s.src = "https://cdn.permutive.com/" + ApiKeyId + "-web.js";
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
		// By default Permutive assumes consent has been given -
		// we should not run any permutive code when we dont have user
		// consent for behavioural profiling.
		if (!getConsents().behavioral) {
			return false;
		}

		const options = validateOptions(opts, oPermutiveEl);

		// Run the Permutive bootstrap code
		bootstrap(options.publicApiKeys.id, options.publicApiKeys.key);

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
}

export default Permutive;
