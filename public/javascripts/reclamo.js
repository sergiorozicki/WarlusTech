var _ajax = new Ajax;
var reg_reclamo = new Array();

$(function() {
  Array.prototype.slice.call($('#form_consultar'))
    .forEach(function (form) {
      $('#btn_consultar2').click(function() {
        if (form.checkValidity()) {
          getEstado('#btn_consultar2 i', '#span_consultar2');
        }
        $('#form_consultar').addClass('was-validated');
      });
    });

  Array.prototype.slice.call($('#form_solicitar_datos_personales'))
    .forEach(function (form) {
      $('#btn_siguiente').click(function() {
        if (form.checkValidity()) {
          $('#form2').hide('normal');
          $('#form3').show('normal');
        }
        $('#form_solicitar_datos_personales').addClass('was-validated');
      });
    });

  Array.prototype.slice.call($('#form_solicitar_datos_equipo'))
    .forEach(function (form) {
      $('#btn_solicitar2').click(function() {
        if (form.checkValidity()) {
          if (validarExtensionArchivo()) {
            showSpinner('#btn_solicitar2 i', '#span_solicitar2');
            insReclamoSolicitado('#btn_solicitar2 i', '#span_solicitar2');
          }
        }
        $('#form_solicitar_datos_equipo').addClass('was-validated');
      });
    });

  $('#btn_solicitar1').click(function() {
    $('#btn_consultar1').removeClass('bg-secondary active');
    $('#btn_solicitar1').addClass('bg-secondary active');
    $('#form1').hide('normal');
    $('#form2').show('normal');
    $('#info').hide('normal');
  });

  $('#btn_consultar1').click(function() {
    $('#btn_solicitar1').removeClass('bg-secondary active');
    $('#btn_consultar1').addClass('bg-secondary active');
    $('#form2').hide('normal');
    $('#form3').hide('normal');
    $('#form1').show('normal');
    $('#info').show('normal');
  });

  $('#btn_volver').click(function() {
    $('#form3').hide('normal');
    $('#form2').show('normal');
  });

  $('#nombre, #apellido, #telefono, #email, #direccion, #localidad, #codigoPostal, #marca, #modelo, #numeroSerie, #falla, #observacion').keyup(function(e) {
    if ($('#dniSolicitar').val() == ''){
      alertSinRedireccion('¡Ups!', 'En primer lugar debe ingresar el D.N.I.', 'warning', true, false);
      limpiarCamposReclamo();
      limpiarCamposCliente('');
    }
  });

  $("#dniSolicitar").bind({
    paste : function(){
      getCliente();
    },
    cut : function(){
      getCliente();
    }
  });

  $("#dniSolicitar").change(function(){
	  $('#dniSolicitar').val();
	});

  $('#dniSolicitar').keyup(function(e) {
    console.log($('#dniSolicitar').val());
    if ($('#dniSolicitar').val() != '' || e.keyCode == 8) getCliente();
  });
});

function validarExtensionArchivo(){
  var extenciones = /(.jpg|.jpeg|.png)$/i;
  if(!extenciones.exec($('#fotoTicket').val())){
    alertSinRedireccion('¡Ups!', 'Los archivos deben ser tipo imagen.', 'info', true, false);
    $('#fotoTicket').val('');
    if(!extenciones.exec($('#fotoEquipo').val())) {
      $('#fotoEquipo').val('');
    }
    return false;
  }

  if(!extenciones.exec($('#fotoEquipo').val())){
    alertSinRedireccion('¡Ups!', 'Los archivos deben ser tipo imagen.', 'info', true, false);
    $('#fotoEquipo').val('');
    return false;
  }
  
  return true;
}

function convertirBase64(blob){
  return new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
          // "data:image/jpg;base64,    =sdCXDSAsadsadsa"
      };
  });
}

function reducirImagen(imagenJson){
  return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
			const imagen = new Image();
			imagen.onload = () => {
				$canvas.width = imagen.width;
				$canvas.height = imagen.height;
				$canvas.getContext("2d").drawImage(imagen, 0, 0);
				$canvas.toBlob(
					(blob) => {
						if (blob === null) reject(blob);
						else resolve(blob);
					},
					"image/jpeg",
					0.15
				);
			};
			imagen.src = URL.createObjectURL(imagenJson);
  });
}

async function comprobarTamanioImagen(imagenJson){
    while (imagenJson.size > 524288) {
       imagenJson = await reducirImagen(imagenJson);
    }
    return imagenJson;
}

async function insReclamoSolicitado(i, clase) {
  var fotoTicket = await comprobarTamanioImagen($('#fotoTicket')[0].files[0]);
  var fotoEquipo = await comprobarTamanioImagen($('#fotoEquipo')[0].files[0]);
  fotoTicket = await convertirBase64(fotoTicket);
  fotoEquipo = await convertirBase64(fotoEquipo);
  _ajax.setUrl('./administrativo-reclamo/insOrUpdCliente');
  _ajax.go(
    ({
      function_response: onInsReclamoSolicitado,
      i: i,
      clase: clase,
      params: ({
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        dni: $('#dniSolicitar').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        localidad: $('#localidad').val(),
        codigoPostal: $('#codigoPostal').val(),
        marca: $('#marca').val(),
        modelo: $('#modelo').val(),
        numeroSerie: $('#numeroSerie').val(),
        falla: $('#falla').val(),
        observacion: $('#observacion').val(),
        fotoTicket: fotoTicket,
        fotoEquipo: fotoEquipo
      })
    })
  );
}

function onInsReclamoSolicitado(data) {
  console.log(data);
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  limpiarCamposReclamo();
  limpiarCamposCliente('');
}

function limpiarCamposReclamo(){
  $('#form_solicitar_datos_equipo').removeClass('was-validated');
  $('#marca').val('');
  $('#modelo').val('');
  $('#numeroSerie').val('');
  $('#falla').val('');
  $('#observacion').val('');
  $('#fotoTicket').val('');
  $('#fotoEquipo').val('');
  $('#form3').hide('normal');
  $('#form2').show('normal');
}

function limpiarCamposCliente(_dni){
  $('#form_solicitar_datos_personales').removeClass('was-validated');
  $('#nombre').val('');
  $('#apellido').val('');
  $('#dniSolicitar').val(_dni);
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
}

function getCliente() {
  _ajax.setUrl('./administrativo-reclamo/getCliente');
  _ajax.go(
    ({
      function_response: onGetCliente,
      params: ({
        dni: $('#dniSolicitar').val()
      })
    })
  );
}

function onGetCliente(data) {
  if (data.data.length != 0) {
    $('#nombre').val(data.data[0].nombre);
    $('#apellido').val(data.data[0].apellido);
    $('#telefono').val(data.data[0].telefono);
    $('#email').val(data.data[0].email);
    $('#direccion').val(data.data[0].direccion);
    $('#localidad').val(data.data[0].localidad);
    $('#codigoPostal').val(data.data[0].codigoPostal);
  }else limpiarCamposCliente($('#dniSolicitar').val());
}

function getEstado(i, clase) {
  _ajax.setUrl('./administrativo-reclamo/getEstado');
  _ajax.go(
    ({
      function_response: onGetEstado,
      i: i,
      clase: clase,
      params: ({
        numeroOrden: $('#numeroOrden').val(),
        dni: $('#dniConsultar').val()
      })
    })
  );
}

function onGetEstado(data) {
  if(data.data.length > 0)alertSinRedireccion('Estado del reclamo', data.data[0]['idEstado'] + '.', 'info', true, false);
  else alertSinRedireccion('¡Ups!', 'No se encontró un reclamo para ese número de orden.', 'warning', true, false);
}