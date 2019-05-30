/* eslint-env mocha */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';

import oPermutive from './../main';

function resetOPermutive() {
	oPermutive.resetInstance();
	delete window.permutive.config;
}

describe("OPermutive", () => {
	beforeEach(() => {
		resetOPermutive();
		const permutiveScript = document.getElementById('permutive-script');
		if (permutiveScript) {
			permutiveScript.parentNode.removeChild(permutiveScript);
		}
	});

	it('is defined', () => {
		proclaim.equal(typeof oPermutive, 'function');
	});

	it('has a static init method', () => {
		proclaim.equal(typeof oPermutive.init, 'function');
	});

	it("should autoinitialize", (done) => {
		const initSpy = sinon.stub(oPermutive, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function () {
			proclaim.equal(initSpy.called, true);
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.stub(oPermutive, 'init');
		proclaim.equal(initSpy.called, false);
		initSpy.restore();
	});

	it("should polyfill window.permutive", () => {
		proclaim.equal(typeof window.permutive, 'object');
	});

	context("init() with a selector", () => {
		it("should create new Permutive() component", () => {
			fixtures.htmlCode();
			const oPermInstance = oPermutive.init({ consent: true }, '#element');
			proclaim.equal(oPermInstance instanceof oPermutive, true);
			fixtures.reset();
		});

		it("should NOT create a new Permutive() component if selector is invalid", () => {
			fixtures.htmlCode();
			try {
				oPermutive.init({ consent: true }, '#fake-element');
			} catch(e) {
				proclaim.equal(e.message, 'o-permutive: could not initialise. No element of type [data-o-component="o-permutive"] found on the page');
			}
			fixtures.reset();
		});
	});

	context("init() with an o-permutive element", () => {
		it("should create new Permutive() component", () => {
			fixtures.htmlCode();
			const el = document.querySelector('#element');
			const oPermInstance = oPermutive.init({ consent: true }, el);
			proclaim.equal(oPermInstance instanceof oPermutive, true);
			fixtures.reset();
		});
	});

	context("init() with no element, o-permative declared in html", () => {
		it("should create new Permutive() component", () => {
			fixtures.htmlCode();
			const oPermInstance = oPermutive.init({ consent: true });
			proclaim.equal(oPermInstance instanceof oPermutive, true);
			fixtures.reset();
		});
	});

	context("init() with no element, no html", () => {
		it("should create new Permutive() component", () => {
			const oPermInstance = oPermutive.init({
				consent: true,
				projectId: '123',
				publicApiKey: 'fake-key'
			});
			proclaim.equal(oPermInstance instanceof oPermutive, true);
		});
	});

	describe("Missing permutive API key or project id", () => {
		beforeEach(() => {
			fixtures.htmlCode('basic');
			try {
				oPermutive.init({ consent: true });
			} catch (e) {
				proclaim.equal(e.message, 'o-permutive: Could not initialise. No project ID or public API Key found in options.');
			}
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("should not attach the permutive script to the DOM", () => {
			const permutiveScript = document.getElementById('permutive-script');
			proclaim.isNull(permutiveScript);
		});

		it("should not bootstrap permutive", () => {
			proclaim.notOk(window.permutive.config);
		});
	});


	describe("Consent is NOT set", () => {
		beforeEach(() => {
			fixtures.htmlCode('basic');
			document.cookie = document.cookie + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			try {
				oPermutive.init({
					projectId: "1",
					publicApiKey: "key"
				});
			} catch(e) {
				proclaim.equal(e instanceof Error, true);
				proclaim.equal(e.message, 'o-permutive: Could not initialise. No consent found');
			}
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("should not attach the permutive script to the DOM", () => {
			const permutiveScript = document.getElementById('permutive-script');
			proclaim.isNull(permutiveScript);
		});

		it("should not bootstrap permutive", () => {
			proclaim.notOk(window.permutive.config);
		});
	});


	describe('Consent is set via FT cookie', () => {
		beforeEach(() => {
			fixtures.htmlCode('basic');
			document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';
			oPermutive.init({
				projectId: "1",
				publicApiKey: "key",
				consentFtCookie: true
			});
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("should attach the permutive script", () => {
			const permutiveScript = document.getElementById('permutive-script');
			proclaim.ok(permutiveScript);
		});

		it("should bootstrap permutive", () => {
			proclaim.ok(window.permutive.config);
		});
	});
});
