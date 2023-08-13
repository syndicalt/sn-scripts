/**

Gets the user's manager and prints the name of the first director found in the manager hierarchy.
If no director is found, prints a message indicating so.
@param {string} userSysId - The sys_id of the user to query for.
@returns {void}
*/

function findDirector(userSysId) {
    // Get the user's sys_id input
    var userSysId = userSysId
    // Initialize the user and manager variables
    var user = new GlideRecord('sys_user')
    var manager = new GlideRecord('sys_user')
    
    // Query the user's manager
    user.get(userSysId)
    manager.get(user.getValue('manager'))
    
    // Loop until a director is found or there are no more managers
    while (manager.isValid()) {
      // Check if the manager's title is director
      if (manager.getValue('title').match(/director|DIRECTOR/)) {
        // If the manager is a director, print their name and break out of the loop
        return manager.getValue('name') // manager.sys_id
      } else {
        // If the manager is not a director, query their manager and continue the loop
        manager.get(manager.getValue('manager'))
      }
    }
    
    // If no director was found, return message
    if (!manager.isValid()) {
      return "No director found for user: " + user.getValue('name')
    }
  }
  
  gs.print(findDirector('b78eed491b85251040e19936b04bcb99')) // b78eed491b85251040e19936b04bcb99