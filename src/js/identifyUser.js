let identifyUser = function(userIden){
  console.log([
    {
      id: userIden.spoorID,
      tag: 'SporeID'
    },
    {
      id: userIden.guid,
      tag: 'GUID'
    }
  ]);
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
export default identifyUser;
