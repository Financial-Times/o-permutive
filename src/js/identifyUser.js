let identifyUser = function(userIden){
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
