var reg_reclamo = new Array(), reg_producto = new Array();

$(function() {
  Array.prototype.slice.call($('#form_consultar'))
    .forEach(function (form) {
      $('#btn_consultar2').click(function() {
        if (form.checkValidity()) {
          getSeguimiento('#btn_consultar2 i', '#span_consultar2');
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
    if ($('#dniSolicitar').val() != '' || e.keyCode == 8) getCliente();
  });

  $("#selectMarca").change(function(){
    limpiarSelect('#selectModelo');
	  cargarSelectModelos();
	});

  getProducto();
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
    while (imagenJson.size > 1572864) {
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
        accion: 'insReclamo',
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        dni: $('#dniSolicitar').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        localidad: $('#localidad').val(),
        codigoPostal: $('#codigoPostal').val(),
        idProducto: $('#selectMarca option:selected').val(),
        idModelo: $('#selectModelo option:selected').val(),
        falla: $('#falla').val(),
        fotoTicket: fotoTicket,
        fotoEquipo: fotoEquipo
      })
    })
  );
}

function onInsReclamoSolicitado(data) {
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  limpiarCamposReclamo();
  limpiarCamposCliente('');
}

function limpiarCamposReclamo(){
  $('#form_solicitar_datos_equipo').removeClass('was-validated');
  $('#selectMarca').val('');
  $('#selectModelo').val('');
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

function getProducto() {
  _ajax.setUrl('./administrativo-reclamo/getProducto');
  _ajax.go(
    ({
      function_response: onGetProducto,
      params: ({})
    })
  );
}

function onGetProducto(data){
  reg_producto = data.data;
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) {
    options += '<option value="' + reg_producto[i]._id + '">' + reg_producto[i].marca + ' ' + reg_producto[i].descripcion +'</option>';
  }
  $('#selectMarca').append(options);
}

function cargarSelectModelos(){
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) {
    if($('#selectMarca option:selected').val() == reg_producto[i]._id){
      for (let j = 0; j < reg_producto[i].modelo.length; j++) {
        options += '<option value="' + reg_producto[i].modelo[j]._id + '">' + reg_producto[i].modelo[j].nombre +'</option>';
      }
    }
  }
  $('#selectModelo').append(options);
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

function getSeguimiento(i, clase) {
  _ajax.setUrl('./administrativo-reclamo/getSeguimientoPorDni');
  _ajax.go(
    ({
      function_response: onGetSeguimiento,
      i: i,
      clase: clase,
      params: ({
        numeroOrden: $('#numeroOrden').val(),
        dni: $('#dniConsultar').val()
      })
    })
  );
}

function onGetSeguimiento(data) {
  if(data.data.length > 0){
    var filas = '';
    for (let i = 0; i < data.data[0].seguimiento.length; i++)
      filas += '<tr><td style="text-align: left;">' + data.data[0].seguimiento[i].idEstado.name + '</td><td style="text-align: center;">' + convertirFechaHora(data.data[0].seguimiento[i].fecha) + '</td></tr>';
    var tabla = `<table class="table table-hover table-sm table-bordered text-dark tbl_listado"><thead class="thead-light"><tr><th>Estado</th><th>Fecha</th></tr></thead><tbody>`+ filas +`</tbody></table>`;
    Swal.fire({ title: 'Seguimiento del reclamo', html: tabla, confirmButtonText: 'Aceptar', icon: 'info' });
  }
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3]);
}