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

	describe("oPermutive is initialised - init()", () => {
		it("should create a single component when initialized with a root element", () => {
			fixtures.htmlCode();
			const boilerplate = oPermutive.init('#element');
			proclaim.equal(boilerplate instanceof oPermutive, true);
			fixtures.reset();
		});

		describe("Missing permutive API key or project id", () => {
			beforeEach(() => {
				fixtures.htmlCode('basic');
			});

			afterEach(() => {
				fixtures.reset();
			});

			it("should not attach the permutive script to the DOM", () => {
				const permutiveScript = document.getElementById('permutive-script');
				proclaim.throws(oPermutive.init());
				proclaim.isNull(permutiveScript);
			});

			it("should not bootstrap permutive", () => {
				proclaim.throws(oPermutive.init());
				proclaim.notOk(window.permutive.config);
			});
		});


		describe("Consent is NOT set", () => {
			beforeEach(() => {
				fixtures.htmlCode('basic');
				document.cookie = document.cookie + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				oPermutive.init('#element', {
					projectId: "1",
					publicApiKey: "key"
				});
				
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


		describe('Consent is set', () => {
			beforeEach(() => {
				fixtures.htmlCode('basic');
				document.cookie = 'FTConsent=behaviouraladsOnsite%3Aon;';
				oPermutive.init('#element', {
					projectId: "1",
					publicApiKey: "key"
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
});
