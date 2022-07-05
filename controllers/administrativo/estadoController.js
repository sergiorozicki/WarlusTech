var Estado = require('../../models/Estado');

exports.createEstado = async () => {
    try {
      // Count Documents
      var count = await Estado.estimatedDocumentCount();
  
      // check for existing estado
      if (count > 0) return;
  
      // Create default Estado
      var values = await Promise.all([
        new Estado({ name: "En espera" }).save(),
        new Estado({ name: "Aceptado" }).save(),
        new Estado({ name: "En el taller" }).save(),
        new Estado({ name: "En espera de repuesto" }).save(),
        new Estado({ name: "Archivado" }).save(),
        new Estado({ name: "Cambio del producto" }).save()
      ]);
    } catch (error) {
      console.error(error);
    }
};