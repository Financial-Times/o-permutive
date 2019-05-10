let pAddon = function(userDemog, pageMeta){
let user = {user : Object.assign(userDemog)};
let data = {page : Object.assign(pageMeta, user)};
console.log(data);
window.permutive.addon('web', data);
}
export default pAddon;
