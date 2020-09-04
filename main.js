import Permutive from './src/js/permutive.js';

const constructAll = function () {
	Permutive.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);

export default Permutive;
