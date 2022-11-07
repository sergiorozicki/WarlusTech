var reg_reclamo_en_espera = new Array(), reg_reclamo_aceptado = new Array(), reg_reclamo_archivado = new Array(), reg_tecnico = new Array(), reg_producto = new Array(), reg_estado = new Array(), data_row = new Array();
var positionReclamoEnEspera = null, positionReclamoAceptado = null, positionReclamoArchivado = null, _id = null, idCliente = null, idEstado = null;
var accion = 'insReclamo';
var seccionEnEspera = false, seccionAceptado = true, seccionArchivado = true;
var myModal, myModalFormularioTecnicos, myModalPresentacionFotos;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioReclamo'));
  myModalFormularioTecnicos = new bootstrap.Modal($('#divFormularioTecnicos'));
  myModalPresentacionFotos = new bootstrap.Modal($('#divPresentacionFotos'));

  $('#btn_nuevo_reclamo').click(function() {
    limpiarFormulario();
    accion = 'insReclamo';
    myModal.show();
  });
  
  $('#btn_editar_reclamo').click(function() {
    if(validarPositionGrilla(positionReclamoAceptado)){
      pasarValoresAlFormulario();
      seleccionarEstado();
      $('#tituloFormulario').text('Editar reclamo');
      accion = 'updReclamo';
      myModal.show();
    }
  });

  $('#btn_eliminar_reclamo').click(function() {
    if(validarPositionGrilla(positionReclamoEnEspera)) abrirAlertaEliminarReclamo();
  });

  $('#btn_actualizar_reclamo_en_espera').click(function() {
    position = null;
    position_solicitado = null;
    getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
  });

  $('#btn_actualizar_reclamo_aceptado').click(function() {
    position = null;
    position_solicitado = null;
    getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
  });

  $('#btn_actualizar_reclamo_archivado').click(function() {
    position = null;
    position_solicitado = null;
    getReclamoArchivado('#btn_actualizar_reclamo_archivado i', '#span_actualizar_reclamo_archivado');
  });

  $('#btn_aceptar_solicitud').click(function() {
    if(validarPositionGrilla(positionReclamoEnEspera)){
      $('#selectEstados').val('62c2cb567d6123a3ec2f26b1');
      limpiarSelect('#selectModelos');
      accion = 'aceptarReclamo';
      $('#tituloFormulario').text('Aceptar reclamo'); 
      pasarValoresAlFormulario();
      myModal.show();
    }
  });

  $("#selectProductos").change(function(){
    limpiarSelect('#selectModelos');
	  cargarSelectModelos();
	});

  Array.prototype.slice.call($('#formularioReclamo'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) insReclamo('#btn_guardar i', '#span_guardar');
        $('#formularioReclamo').addClass('was-validated');
      });
  });

  Array.prototype.slice.call($('#formularioTecnicos'))
    .forEach(function (form) {
      $('#btn_guardar_asignar_tecnico').click(function() {
        if (form.checkValidity()) asignarTecnico('#btn_guardar_asignar_tecnico i', '#span_guardar_asignar_tecnico');
        $('#formularioTecnicos').addClass('was-validated');
      });
  });

  $('#seccionEnEspera').click(function() {
    positionReclamoAceptado = null
    positionReclamoArchivado = null
    setTimeout(() => {
      if(seccionEnEspera) {
        onGetReclamoEnEspera(false);
        seccionEnEspera = false;
      }
    }, 250);
  });

  $('#seccionAceptado').click(function() {
    positionReclamoEnEspera = null
    positionReclamoArchivado = null
    setTimeout(() => {
      if(seccionAceptado) {
        onGetReclamoAceptado(false);
        seccionAceptado = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    positionReclamoEnEspera = null
    positionReclamoAceptado = null
    setTimeout(() => {
      if(seccionArchivado) {
        onGetReclamoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  $('#dni').keyup(function(e) {
    if ($('#dni').val() != '' || e.keyCode == 8) getCliente();
  });

  $('#btn_seguimiento_reclamo_en_espera').click(function() {
    if(validarPositionGrilla(positionReclamoEnEspera)){
      getSeguimiento('#btn_seguimiento_reclamo_en_espera i', '#span_seguimiento_reclamo_en_espera');
    }
  });

  $('#btn_seguimiento_reclamo_aceptado').click(function() {
    if(validarPositionGrilla(positionReclamoAceptado)){
      getSeguimiento('#btn_seguimiento_reclamo_aceptado i', '#span_seguimiento_reclamo_aceptado');
    }
  });

  $('#btn_seguimiento_reclamo_archivado').click(function() {
    if(validarPositionGrilla(positionReclamoArchivado)){
      getSeguimiento('#btn_seguimiento_reclamo_archivado i', '#span_seguimiento_reclamo_archivado');
    }
  });

  $('#btn_asignar_tecnico').click(function() {
    if(validarPositionGrilla(positionReclamoAceptado)){
      $('#selectTecnicos2').val('');
      $('#formularioTecnicos').removeClass('was-validated');
      myModalFormularioTecnicos.show();
    }
  });

  $('#btn_archivar_reclamo').click(function() {
    if(validarPositionGrilla(positionReclamoAceptado)){
      abrirAlertaArchivarReclamo();
    }
  });
  
  $('#btn_desarchivar_reclamo').click(function() {
    if(validarPositionGrilla(positionReclamoArchivado)){
      abrirAlertaDesarchivarReclamo();
    }
  });

  $('#btn_ver_fotos_reclamo_en_espera').click(function() {
    if(validarPositionGrilla(positionReclamoEnEspera)){
      getFoto('#btn_ver_fotos_reclamo_en_espera i', '#span_ver_fotos_reclamo_en_espera');
    }
  });

  $('#btn_ver_fotos_reclamo_aceptado').click(function() {
    if(validarPositionGrilla(positionReclamoAceptado)){
      getFoto('#btn_ver_fotos_reclamo_aceptado i', '#span_ver_fotos_reclamo_aceptado');
    }
  });

  $('#btn_ver_fotos_reclamo_archivado').click(function() {
    if(validarPositionGrilla(positionReclamoArchivado)){
      getFoto('#btn_ver_fotos_reclamo_archivado i', '#span_ver_fotos_reclamo_archivado');
    }
  });

  $('#btn_descargar_presentacion_foto_ticket').click(function() {
    descargarFoto('ticket');
  });

  $('#btn_descargar_presentacion_foto_equipo').click(function() {
    descargarFoto('equipo');
  });

  getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
  getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
  getReclamoArchivado('#btn_actualizar_reclamo_archivado i', '#span_actualizar_reclamo_archivado');
  getTecnico();
  getProducto();
  getEstado();
});

function descargarFoto(tipo) {
  window.open('../administrativo-reclamo/downloadFoto?idReclamo=' + data_row._id + '&tipo=' + tipo, '_blank');
}

function getFoto(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getFoto');
  _ajax.go(
    ({
      function_response: onGetFoto,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id })
    })
  );
}

function onGetFoto(data) {
  $('#presentacionFotoTicket').attr('src', 'data:image/png;base64,' + data.data.fotoTicket);
  $('#presentacionFotoEquipo').attr('src', 'data:image/png;base64,' + data.data.fotoEquipo);
  myModalPresentacionFotos.show();
}

function seleccionarEstado() {
  for (let i = 0; i < reg_estado.length; i++)
    if(reg_estado[i]._id == data_row.seguimiento[data_row.seguimiento.length - 1].idEstado) $('#selectEstados').val(reg_estado[i]._id);
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
  while (imagenJson.size > 1572864) imagenJson = await reducirImagen(imagenJson);
  return imagenJson;
}

async function insReclamo(i, clase) {
  if($('#fotoTicket').val() == '') fotoTicket = '';
  else {
    var fotoTicket = await comprobarTamanioImagen($('#fotoTicket')[0].files[0]);
    fotoTicket = await convertirBase64(fotoTicket);
  }
  if($('#fotoEquipo').val() == '') fotoEquipo = '';
  else {
    var fotoEquipo = await comprobarTamanioImagen($('#fotoEquipo')[0].files[0]);
    fotoEquipo = await convertirBase64(fotoEquipo);
  }
  
  _ajax.setUrl('../administrativo-reclamo/insOrUpdCliente');
  _ajax.go(
    ({
      function_response: onInsReclamo,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        accion: accion,
        idCliente: idCliente,
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        localidad: $('#localidad').val(),
        codigoPostal: $('#codigoPostal').val(),
        idProducto: $('#selectProductos option:selected').val(),
        idModelo: $('#selectModelos option:selected').val(),
        falla: $('#falla').val(),
        seguimiento: { idEstado: $('#selectEstados option:selected').val() },
        idTecnico: $('#selectTecnicos option:selected').val(),
        fotoTicket: fotoTicket,
        fotoEquipo: fotoEquipo
      })
    })
  );
}

function onInsReclamo(data) {
  seccionEnEspera = true;
  seccionAceptado = true;
  seccionArchivado = true;
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
  getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
  getReclamoArchivado('#btn_actualizar_reclamo_archivado i', '#span_actualizar_reclamo_archivado');
}

function getReclamoEnEspera(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getReclamoEnEspera');
  _ajax.go(
    ({
      function_response: onGetReclamoEnEspera,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamoEnEspera(data) {
  if(data != false) reg_reclamo_en_espera = data.data;

  var table = $('#tbl_reclamo_en_espera').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '390px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [],
    'info': true,
    'destroy': true,
    'data': reg_reclamo_en_espera,
    'columns': [
        { data: 'numeroOrden' },
        { 'render':
          function (data, type, row) {
              return (row.idCliente[0].apellido + ' ' + row.idCliente[0].nombre);
          }
        },
        { data: 'idCliente[0].dni' },
        { data: 'idCliente[0].telefono' },
        { data: 'idCliente[0].email' },
        { data: 'idCliente[0].direccion' },
        { data: 'idCliente[0].localidad' },
        { data: 'idCliente[0].codigoPostal' },
        { data: 'idProducto[0].marca' },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idProducto[0].modelo.length; i++)
              if(row.idProducto[0].modelo[i]._id == row.idModelo) return (row.idProducto[0].modelo[i].nombre);
            return ('');
          }
        },
        { data: 'falla' },
        { 'render':
          function (data, type, row) {
            if(row.idTecnico.length == 0) return ('Ninguno');
              return (row.idTecnico[0].apellido + ' ' + row.idTecnico[0].nombre);
          }
        }
    ],
    language: language
  });
  setDatosReclamoEnEspera("#tbl_reclamo_en_espera tbody", table);
}

function setDatosReclamoEnEspera(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionReclamoEnEspera = table.row( this ).index();
    positionReclamoAceptado, positionReclamoArchivado = null
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
  $(tbody).on('dblclick', 'td', function(event) {
    positionReclamoEnEspera = table.row( this ).index();
    positionReclamoAceptado, positionReclamoArchivado = null
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionReclamoEnEspera)){
        limpiarSelect('#selectTecnicos');
        accion = 'aceptarReclamo'
        $('#tituloFormulario').text('Aceptar reclamo');
        getTecnico('#btn_aceptar_solicitud i', '#span_aceptar_solicitud');
      }
    }
  });
}

function getReclamoAceptado(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getReclamoAceptado');
  _ajax.go(
    ({
      function_response: onGetReclamoAceptado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamoAceptado(data) {
  if(data != false) reg_reclamo_aceptado = data.data;

  var table = $('#tbl_reclamo_aceptado').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '390px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [],
    'info': true,
    'destroy': true,
    'data': reg_reclamo_aceptado,
    'columns': [
        { data: 'numeroOrden' },
        { 'render':
          function (data, type, row) {
              return (row.idCliente[0].apellido + ' ' + row.idCliente[0].nombre);
          }
        },
        { data: 'idCliente[0].dni' },
        { data: 'idCliente[0].telefono' },
        { data: 'idCliente[0].email' },
        { data: 'idCliente[0].direccion' },
        { data: 'idCliente[0].localidad' },
        { data: 'idCliente[0].codigoPostal' },
        { data: 'idProducto[0].marca' },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idProducto[0].modelo.length; i++) {
              if(row.idProducto[0].modelo[i]._id == row.idModelo) return (row.idProducto[0].modelo[i].nombre);
            }
            return ('');
          }
        },
        { data: 'falla' },
        { data: 'idEstado[0].name' },
        { 'render':
          function (data, type, row) {
            if(row.idTecnico.length == 0) return ('Ninguno');
              return (row.idTecnico[0].apellido + ' ' + row.idTecnico[0].nombre);
          }
        }
    ],
    language: language
  });
  setDatosReclamoAceptado("#tbl_reclamo_aceptado tbody", table);
}

function setDatosReclamoAceptado(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionReclamoAceptado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
  $(tbody).on('dblclick', 'td', function(event) {
    positionReclamoAceptado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionReclamoAceptado)){
        pasarValoresAlFormulario();
        accion = 'updReclamo';
        myModal.show();
      }
    }
  });
}

function getReclamoArchivado(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getReclamoArchivado');
  _ajax.go(
    ({
      function_response: onGetReclamoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamoArchivado(data) {
  if(data != false) reg_reclamo_archivado = data.data;

  var table = $('#tbl_reclamo_archivado').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '390px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [],
    'info': true,
    'destroy': true,
    'data': reg_reclamo_archivado,
    'columns': [
        { data: 'numeroOrden' },
        { 'render':
          function (data, type, row) {
              return (row.idCliente[0].apellido + ' ' + row.idCliente[0].nombre);
          }
        },
        { data: 'idCliente[0].dni' },
        { data: 'idCliente[0].telefono' },
        { data: 'idCliente[0].email' },
        { data: 'idCliente[0].direccion' },
        { data: 'idCliente[0].localidad' },
        { data: 'idCliente[0].codigoPostal' },
        { data: 'idProducto[0].marca' },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idProducto[0].modelo.length; i++)
              if(row.idProducto[0].modelo[i]._id == row.idModelo) return (row.idProducto[0].modelo[i].nombre);
            return ('');
          }
        },
        { data: 'falla' },
        { 'render':
          function (data, type, row) {
            if(row.idTecnico.length == 0) return ('Ninguno');
              return (row.idTecnico[0].apellido + ' ' + row.idTecnico[0].nombre);
          }
        }
    ],
    language: language
  });
  setDatosReclamoArchivado("#tbl_reclamo_archivado tbody", table);
}

function setDatosReclamoArchivado(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionReclamoArchivado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
  $(tbody).on('dblclick', 'td', function(event) {
    positionReclamoArchivado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionReclamoArchivado)){
        pasarValoresAlFormulario();
        myModal.show();
      }
    }
  });
}

function getTecnico() {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getTecnico');
  _ajax.go(
    ({
      function_response: onGetTecnico,
      i: null,
      clase: null,
      params: ({})
    })
  );
}

function onGetTecnico(data){
  reg_tecnico = data.data;
  var options = '';
  for (var i = 0; i < reg_tecnico.length; i++) options += '<option value="' + reg_tecnico[i]._id + '">' + reg_tecnico[i].apellido + ' ' + reg_tecnico[i].nombre + '</option>';
  $('#selectTecnicos').append(options);
  $('#selectTecnicos2').append(options);
}

function getProducto() {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getProducto');
  _ajax.go(
    ({
      function_response: onGetProducto,
      i: null,
      clase: null,
      params: ({})
    })
  );
}

function onGetProducto(data){
  reg_producto = data.data;
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) options += '<option value="' + reg_producto[i]._id + '">' + reg_producto[i].marca + ' ' + reg_producto[i].descripcion + '</option>';
  $('#selectProductos').append(options);
}

function cargarSelectModelos(){
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) {
    if($('#selectProductos').val() == reg_producto[i]._id)
      for (let j = 0; j < reg_producto[i].modelo.length; j++) options += '<option value="' + reg_producto[i].modelo[j]._id + '">' + reg_producto[i].modelo[j].nombre +'</option>';
  }
  $('#selectModelos').append(options);
}

function getEstado(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-reclamo/getEstado');
  _ajax.go(
    ({
      function_response: onGetEstado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetEstado(data){
  reg_estado = data.data;
  var options = '';
  for (var i = 0; i < reg_estado.length; i++) options += '<option value="' + reg_estado[i]._id + '">' + reg_estado[i].name + '</option>';
  $('#selectEstados').append(options);
}

function validarPositionGrilla(position){
  if(position != null) return true;
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nuevo reclamo');
  $('#formularioReclamo').removeClass('was-validated');
  $('#fotoTicket').prop('required', true);
  $('#fotoEquipo').prop('required', true);
  position = null;
  position_solicitado = null;
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  idCliente = null;
  $('#apellido').val('');
  $('#nombre').val('');
  $('#dni').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
  $('#selectProductos').val('');
  $('#selectModelos').val('');
  $('#selectEstados').val('');
  $('#falla').val('');
  $('#selectTecnicos').val('');
  $('#fotoTicket').val('');
  $('#fotoEquipo').val('');
  limpiarSelect('#selectModelos');
}

function pasarValoresAlFormulario(){
  $('#formularioReclamo').removeClass('was-validated');
  $('#fotoTicket').prop('required', false);
  $('#fotoEquipo').prop('required', false);
  $('#fotoTicket').val('');
  $('#fotoEquipo').val('');
  _id = data_row._id;
  idCliente = data_row.idCliente[0]._id;
  $('#apellido').val(data_row.idCliente[0].apellido);
  $('#nombre').val(data_row.idCliente[0].nombre);
  $('#dni').val(data_row.idCliente[0].dni);
  $('#telefono').val(data_row.idCliente[0].telefono);
  $('#email').val(data_row.idCliente[0].email);
  $('#direccion').val(data_row.idCliente[0].direccion);
  $('#localidad').val(data_row.idCliente[0].localidad);
  $('#codigoPostal').val(data_row.idCliente[0].codigoPostal);
  $('#selectProductos').val(data_row.idProducto[0]._id);
  cargarSelectModelos();
  $('#selectModelos').val(data_row.idModelo);
  $('#falla').val(data_row.falla);
  data_row.idTecnico.length != 0 ? $('#selectTecnicos').val(data_row.idTecnico[0]._id) : $('#selectTecnicos').val('');
}

function getCliente() {
  _ajax.setUrl('../administrativo-reclamo/getCliente');
  _ajax.go(
    ({
      function_response: onGetCliente,
      params: ({ dni: $('#dni').val() })
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
  }else limpiarCamposCliente($('#dni').val());
}

function limpiarCamposCliente(_dni){
  $('#nombre').val('');
  $('#apellido').val('');
  $('#dni').val(_dni);
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
}

function abrirAlertaEliminarReclamo(){
  Swal.fire({
    title: 'Se eliminar&aacute; el reclamo',
    text: '¿Eliminar reclamo?',
    width: '500px',
    showCancelButton: true,
    showCloseButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-trash"></i> Eliminar',
    cancelButtonText: '<i class="fa fa-ban"></i> Cancelar',
    confirmButtonClass: 'rounded-pill',
    cancelButtonClass: 'rounded-pill',
    focusConfirm: false,
    customClass: {popup: 'form-swal'},
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve) => {
        setTimeout(() => {
          delReclamo();
          resolve(true);
        }, 500);
      });
    }
  });
}

function delReclamo(){
  _ajax.setUrl('../administrativo-reclamo/delReclamo');
  _ajax.go(
    ({
      function_response: onDelReclamo,
      i: null,
      clase: null,
      params: ({ _id: data_row._id })
    })
  );
}

function onDelReclamo(data){
  positionReclamoEnEspera = null;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
}

function abrirAlertaArchivarReclamo(){
  Swal.fire({
    title: 'Se archivar&aacute; el reclamo',
    text: '¿Archivar reclamo?',
    width: '500px',
    showCancelButton: true,
    showCloseButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
    cancelButtonText: '<i class="fa fa-ban"></i> Cancelar',
    confirmButtonClass: 'rounded-pill',
    cancelButtonClass: 'rounded-pill',
    focusConfirm: false,
    customClass: {popup: 'form-swal'},
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve) => {
        setTimeout(() => {
          archivarReclamo('#btn_archivar_reclamo i', '#span_archivar_reclamo');
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarReclamo(i, clase){
  _ajax.setUrl('../administrativo-reclamo/archivarReclamo');
  _ajax.go(
    ({
      function_response: onArchivarReclamo,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id })
    })
  );
}

function onArchivarReclamo(data){
  positionReclamoEnEspera = null;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
  getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
  getReclamoArchivado('#btn_actualizar_reclamo_archivado i', '#span_actualizar_reclamo_archivado');
}

function abrirAlertaDesarchivarReclamo(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el reclamo',
    text: '¿Desarchivar reclamo?',
    width: '500px',
    showCancelButton: true,
    showCloseButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-check"></i> Aceptar',
    cancelButtonText: '<i class="fa fa-ban"></i> Cancelar',
    confirmButtonClass: 'rounded-pill',
    cancelButtonClass: 'rounded-pill',
    focusConfirm: false,
    customClass: {popup: 'form-swal'},
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve) => {
        setTimeout(() => {
          desarchivarReclamo('#btn_archivar_reclamo i', '#span_archivar_reclamo');
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarReclamo(i, clase){
  _ajax.setUrl('../administrativo-reclamo/desarchivarReclamo');
  _ajax.go(
    ({
      function_response: onDesarchivarReclamo,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id })
    })
  );
}

function onDesarchivarReclamo(data){
  positionReclamoArchivado = null;
  seccionEnEspera = true;
  seccionArchivado = true;
  seccionAceptado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamoEnEspera('#btn_actualizar_reclamo_en_espera i', '#span_actualizar_reclamo_en_espera');
  getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
  getReclamoArchivado('#btn_actualizar_reclamo_archivado i', '#span_actualizar_reclamo_archivado');
}

function getSeguimiento(i, clase) {
  _ajax.setUrl('../administrativo-reclamo/getSeguimientoPorId');
  _ajax.go(
    ({
      function_response: onGetSeguimiento,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id })
    })
  );
}

function onGetSeguimiento(data) {
  if(data.data){
    var filas = '';
    for (let i = 0; i < data.data.seguimiento.length; i++)
      filas += '<tr><td style="text-align: left;">' + data.data.seguimiento[i].idEstado.name + '</td><td style="text-align: center;">' + convertirFechaHora(data.data.seguimiento[i].fecha) + '</td></tr>';
    var tabla = `<table class="table table-hover table-sm table-bordered text-dark tbl_listado"><thead class="thead-light"><tr><th>Estado</th><th>Fecha</th></tr></thead><tbody>`+ filas +`</tbody></table>`;
    Swal.fire({ title: 'Seguimiento del reclamo', html: tabla, confirmButtonText: 'Aceptar', icon: 'info' });
  }
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
}

function asignarTecnico(i, clase) {
  _ajax.setUrl('../administrativo-reclamo/asignarTecnico');
  _ajax.go(
    ({
      function_response: onAsignarTecnico,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id, idTecnico: $('#selectTecnicos2 option:selected').val() })
    })
  );
}

function onAsignarTecnico(data) {
  myModalFormularioTecnicos.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamoAceptado('#btn_actualizar_reclamo_aceptado i', '#span_actualizar_reclamo_aceptado');
}