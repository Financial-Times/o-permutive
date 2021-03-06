const ATTRIBUTE_PATTERN = 'oPermutive';
const OPTION_PARENT_NODES = [
	'projectId',
	'publicApiKey',
	'consent',
	'consentFtCookie'
];

const formatOptionName = key => {
	const keyLower = key.toLowerCase();

	for (const mapped of OPTION_PARENT_NODES) {
		if (mapped.toLowerCase() === keyLower) {
			return mapped;
		}
	}

	return keyLower;
};


/**
 * Extract the option's path from an attribute name in camelCase form - coming from the component's dataset -
 * and returns a single element object.
 * @param {String} optKey - The attribute name in camelCase form, taken from the component's dataset.
 * @param {String} optValue - The value assigned to optKey.
 * @returns {Object} - An object containing a single { key: "value" } or { key: { subkey: value } }
 */
export const attributeToOption = ({ optKey, optValue }) => {
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
};


/**
 * Merge the options from config object with any declarative options
 *
 * @param {Object} opts
 * @param {HTML Element} oPermutiveEl
 */
export function mergeOptions (opts, oPermutiveEl) {
	const options = Object.assign({}, getDataAttributes(oPermutiveEl), opts);
	Object.keys(options).map(optKey => {
		options[optKey] = stringToBool(options[optKey]);
		return optKey;
	});
	return options;
}


/**
 * Convert any "false" or "true" string to boolean
 * @param {String} string
 */
function stringToBool(string) {
	if(typeof String !== 'string') {
		return string;
	}
	if(string.toLowerCase() === 'false') {
		return false;
	}
	if(string.toLowerCase() === 'true') {
		return true;
	}

	return string;
}


/**
 * Return a list of options from the data- attributes of
 * the o-permutive element
 *
 * @param {HTML Element} oPermutiveEl
 */
export function getDataAttributes(oPermutiveEl) {
	if (!(oPermutiveEl instanceof HTMLElement)) {
		return {};
	}

	const dataFromPermutiveEl = Object.keys(oPermutiveEl.dataset)
		.map((optKey) => attributeToOption({ optKey, optValue: oPermutiveEl.dataset[optKey] }));

	// TODO: Support for nested declarative options need a deep merge here
	return Object.assign({}, ...dataFromPermutiveEl);
}

/**
 * Attach the permutive script
 *
 * @param {String} projectId
 */
export function attachPermutiveScript(projectId) {
	const permutiveURI = 'https://cdn.permutive.com/' + projectId + '-web.js';

	if (!document.querySelector('script[src="' + permutiveURI + '"]')) {
		const scriptTag = document.createElement("script");
		Object.assign(scriptTag, {
			async: "true",
			type: "text/javascript",
			id: "permutive-script",
			src: permutiveURI
		});

		const HEAD = document.head || document.getElementsByTagName('head')[0];
		HEAD.appendChild(scriptTag);
	}
}

/**
 * Get consent based on FTConsent cookie
 * TODO Consents can be derived outside of the package and passed in as config
 */
export function getConsentFromFtCookie() {
	// derive consent options from ft consent cookie
	const re = /FTConsent=([^;]+)/;
	const match = document.cookie.match(re);
	if (!match) {
		// cookie stasis or no consent cookie found
		return false;
	}
	const consentCookie = decodeURIComponent(match[1]);

	return consentCookie.includes('behaviouraladsOnsite:on');
}
