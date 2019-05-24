const ATTRIBUTE_PATTERN = 'oPermutive';
const OPTION_PARENT_NODES = [
	'adsApi',
	'appInfo',
	'contentApi',
	'contentId',
	'oComponent',
	'publicApiKeys',
	'userApi'
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
 * @param {String} optKey - The attribute name in camelCase form, taken from the component's dataset. e.g., publicapikeysId
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
}
