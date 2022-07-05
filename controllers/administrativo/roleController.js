var Role = require('../../models/Role');

exports.createRoles = async () => {
    try {
      // Count Documents
      var count = await Role.estimatedDocumentCount();
  
      // check for existing roles
      if (count > 0) return;
  
      // Create default Roles
      var values = await Promise.all([
        new Role({ name: "ADMINISTRATIVO" }).save(),
        new Role({ name: "TECNICO" }).save(),
      ]);
    } catch (error) {
      console.error(error);
    }
};