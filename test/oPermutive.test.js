/* eslint-env mocha */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';

import OPermutive from './../main';

describe("OPermutive", () => {
	beforeEach(() => {
		const permutiveScript = document.getElementById('permutive-script');
		if (permutiveScript) {
			permutiveScript.parentNode.removeChild(permutiveScript);
		}
	});

	it('is defined', () => {
		proclaim.equal(typeof OPermutive, 'function');
	});

	it('has a static init method', () => {
		proclaim.equal(typeof OPermutive.init, 'function');
	});

	it("should autoinitialize", (done) => {
		const initSpy = sinon.spy(OPermutive, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function () {
			proclaim.equal(initSpy.called, true);
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.spy(OPermutive, 'init');
		proclaim.equal(initSpy.called, false);
	});

	describe("oPermutive is initialised - init()", () => {
		beforeEach(() => {
			fixtures.htmlCode();
		});

		afterEach(() => {
			fixtures.reset();
		});

		// TODO See issue #11
		//		it("should create a new component array when initialized", () => {
		//			const boilerplate = OPermutive.init();
		//			proclaim.equal(boilerplate instanceof Array, true);
		//			proclaim.equal(boilerplate[0] instanceof OPermutive, true);
		//		})

		it("should create a single component when initialized with a root element", () => {
			const boilerplate = OPermutive.init('#element');
			proclaim.equal(boilerplate instanceof OPermutive, true);
		});

		describe("Missing permutive API key or id", () => {
			it("should not attach the permutive script to the DOM", () => {
				OPermutive.init();
				const permutiveScript = document.getElementById('permutive-script');
				proclaim.isNull(permutiveScript);
			});

			it("should not bootstrap permutive", () => {
				OPermutive.init();
				// TODO: check bootstrap function not called
			});
		});


		describe("Consent is NOT set", () => {
			beforeEach(() => {
				document.cookie = document.cookie + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				OPermutive.init('#element', {
					publicApiKeys: {
						id: "1",
						key: "key"
					}
				});
			});

			it("should not attach the permutive script to the DOM", () => {
				const permutiveScript = document.getElementById('permutive-script');
				proclaim.isNull(permutiveScript);
			});

			it("should not bootstrap permutive", () => {
				// TODO: check bootstrap function not called
			});
		});


		describe('Consent is set', () => {
			beforeEach(() => {
				document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';
				OPermutive.init('#element', {
					publicApiKeys: {
						id: "1",
						key: "key"
					}
				});
			});

			it("should attach the permutive script", () => {
				const permutiveScript = document.getElementById('permutive-script');
				proclaim.ok(permutiveScript);
			});

			it("should bootstrap permutive", () => {
				// TODO: Check bootstrap function is called
			});

			describe("Ads API is set", () => {
				it("should add the data to permutive", () => {
					// TODO: Once we come finalise solution for getting data from ads-api
				});
			});
		});
	});
});
