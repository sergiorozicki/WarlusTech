const Role = require('../../models/Role');

exports.createRoles = async () => {
    try {
      // Count Documents
      const count = await Role.estimatedDocumentCount();
  
      // check for existing roles
      if (count > 0) return;
  
      // Create default Roles
      const values = await Promise.all([
        new Role({ name: "ADMINISTRATIVO" }).save(),
        new Role({ name: "TECNICO" }).save(),
        new Role({ name: "CLIENTE" }).save()
      ]);
    } catch (error) { return res.status(500).send({ title: 'Error', text: error.toString(), icon: 'error', showConfirmButton: true, timer: false, session: true }); }
};