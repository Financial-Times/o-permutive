/* eslint ignore */
// This is the bootstrap script for permutive. Originally it's one function as per
// the permutive docs: https://developer.permutive.com/page/the-permutive-javascript-sdk
// However, since origami components are intialised on DomContentLoaded event
// it's possible to have a situation where window.permutive is accessed before
// Permutive.init() has had a chance to call the bootstrap script (see declarative demo)
//
// bootstrapPolyfill() is called immediately on importing or loading o-permutive
// and botstrapConfig() is called once the component has been initialised.


export function bootstrapPolyfill () {
	!function (n, e) {
		if (!e) {
			e = e || {}, window.permutive = e, e.q = []
			for (var t = ["addon", "identify", "track", "trigger", "query", "segment", "segments", "ready", "on", "once", "user", "consent"], c = 0; c < t.length; c++) {
				var f = t[c];
				e[f] = function (n) {
					return function () {
						var o = Array.prototype.slice.call(arguments, 0);
						e.q.push({
							functionName: n,
							arguments: o
						})
					}
				}(f)
			}
		}
	}(document, window.permutive);
	window.googletag = window.googletag || {}, window.googletag.cmd = window.googletag.cmd || [], window.googletag.cmd.push(function () {
		if (0 === window.googletag.pubads().getTargeting("permutive").length) {
			var g = window.localStorage.getItem("_pdfps");
			window.googletag.pubads().setTargeting("permutive", g ? JSON.parse(g) : [])
		}
	});
}

export function bootstrapConfig (id, key) {
	!function (e, o, r, i) {
		if (!e) {
			bootstrapPolyfill();
		}
		if(!e.config) {
			e.config = i || {}, e.config.projectId = o, e.config.apiKey = r, e.config.environment = e.config.environment || "production";
		}
	}(window.permutive, id, key, {});
}
