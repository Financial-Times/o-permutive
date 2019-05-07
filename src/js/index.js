import {bootstrap} from './bootstrap';
//import {fetchData} from './src/fetchData';


function init(id, key, config) {
  const PROJECT_ID = id;
  const PUBLIC_API_KEY = key;
  bootstrap(id, key);
  const HEAD = document.head || document.getElementsByTagName('head')[0];

  var s = document.createElement("script");
  s.async;
  s.type = "text/javascript";
  s.src = "https://cdn.permutive.com/" + PROJECT_ID + "-web.js";
  HEAD.appendChild(s);
}

init("e1c3fd73-dd41-4abd-b80b-4278d52bf7aa", "b2b3b748-e1f6-4bd5-b2f2-26debc8075a3", {});
//module.exports = init;
