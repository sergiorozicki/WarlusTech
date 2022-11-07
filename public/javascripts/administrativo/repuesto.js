var reg_reclamo = new Array(), reg_repuesto = new Array(), reg_repuesto_archivado = new Array(), data_row = new Array();
var positionDesarchivado = null, positionArchivado = null, _id = null, idTecnico = null;
var seccionDesarchivado = false, abrirPdf = false;
var seccionArchivado = true;
var myModal, myModalPresentacionFotos;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioRepuesto'));
  myModalPresentacionFotos = new bootstrap.Modal($('#divPresentacionFotos'));

  $('#btn_solicitar_repuesto').click(function() {
    limpiarFormulario();
    getReclamo('#btn_solicitar_repuesto i', '#span_solicitar_repuesto');
  });
  
  $('#btn_editar_proforma').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      pasarValoresAlFormulario();
      getProducto('#btn_editar_proforma i', '#span_editar_proforma');
    }
  });

  $('#btn_actualizar').click(function() {
    getRepuesto('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  $('#btn_archivar_repuesto').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      abrirAlertaArchivarRepuesto();
    }
  });

  $('#btn_desarchivar_repuesto').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      abrirAlertaDesarchivarRepuesto();
    }
  });

  Array.prototype.slice.call($('#formularioRepuesto'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          abrirPdf = false;
          insRepuesto();
        }
        $('#formularioRepuesto').addClass('was-validated');
      });
      $('#btn_guardar_generar_pdf').click(function() {
        if (form.checkValidity()) {
          abrirPdf = true;
          contenidoPdf = $('#observacion').val();
          insRepuesto();
        }
        $('#formularioRepuesto').addClass('was-validated');
      });
  });

  $('#seccionDesarchivado').click(function() {
    positionArchivado = null
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetRepuesto(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    positionDesarchivado
    setTimeout(() => {
      if (seccionArchivado) {
        onGetRepuestoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  $('#btn_ver_foto_repuesto_desarchivado').click(function() {
    if(validarPositionGrilla(positionDesarchivado)) getFoto('#btn_ver_foto_repuesto_desarchivado i', '#span_ver_foto_repuesto_desarchivado');
  });

  $('#btn_ver_foto_repuesto_archivado').click(function() {
    if(validarPositionGrilla(positionArchivado)) getFoto('#btn_ver_foto_repuesto_archivado i', '#span_ver_foto_repuesto_archivado');
  });

  $('#btn_descargar_presentacion_foto_repuesto').click(function() {
    descargarFoto();
  });
  
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function getFoto(i, clase) {
  position = null;
  _ajax.setUrl('../administrativo-repuesto/getFoto');
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
  $('#presentacionFotoRepuesto').attr('src', 'data:image/png;base64,' + data.data.fotoRepuesto);
  myModalPresentacionFotos.show();
}

function descargarFoto() {
  window.location = '../administrativo-repuesto/downloadFoto?_id=' + data_row._id;
}

function insRepuesto() {
  _ajax.setUrl('../administrativo-repuesto/insRepuesto');
  _ajax.go(
    ({
      function_response: onInsRepuesto,
      i: null,
      clase: null,
      params: ({
        functionBack: functionBack,
        _id: _id,
        idTecnico: idTecnico,
        idReclamo: $('#selectNumeroOrden option:selected').val(),
        observacion: $('#observacion').val()
      })
    })
  );
}

function onInsRepuesto(data) {
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
}

function getReclamo(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../tecnico-repuesto/getReclamo');
  _ajax.go(
    ({
      function_response: onGetReclamo,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamo(data){
  reg_reclamo = data.data;
  var options = '';
  for (var i = 0; i < reg_reclamo.length; i++) {
    options += '<option value="' + reg_reclamo[i]['_id'] + '">' + reg_reclamo[i]['numeroOrden'] + '</option>';
  }
  $('#selectNumeroOrden').append(options);
  $('#selectNumeroOrden').val(idReclamo);
  myModal.show(); 
}

function getRepuesto(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-repuesto/getRepuesto');
  _ajax.go(
    ({
      function_response: onGetRepuesto,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetRepuesto(data) {
  if(data != false) {
    reg_repuesto = data.data;
    idTecnico = data.idTecnico;
  }

  var table = $('#tbl_repuesto').DataTable({
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
    'data': reg_repuesto,
    'columns': [
        { data: 'idReclamo.numeroOrden' },
        { 'render':
          function (data, type, row) {
              return (row.idTecnico.apellido + ' ' + row.idTecnico.nombre);
          }
        },
        { data: 'idTecnico.localidad' },
        { 'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        { data: 'idReclamo.idCliente.telefono' },
        { 'render':
          function (data, type, row) {
              return (row.idReclamo.idProducto.marca);
          }
        },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idReclamo.idProducto.modelo.length; i++) if(row.idReclamo.idProducto.modelo[i]._id == row.idReclamo.idModelo) return (row.idReclamo.idProducto.modelo[i].nombre);
            return ('');
          }
        },
        { data: 'repuesto' },
        { data: 'observacion' }
    ],
    language: language
  });
  setDatos("#tbl_repuesto tbody", table);
}

function setDatos(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionDesarchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionDesarchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(positionDesarchivado).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionDesarchivado)){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function getRepuestoArchivado(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-repuesto/getRepuestoArchivado');
  _ajax.go(
    ({
      function_response: onGetRepuestoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetRepuestoArchivado(data) {
  if(data != false) reg_repuesto_archivado = data.data;

  var table = $('#tbl_repuesto_archivado').DataTable({
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
    'data': reg_repuesto_archivado,
    'columns': [
        { data: 'idReclamo.numeroOrden' },
        { 'render':
          function (data, type, row) {
              return (row.idTecnico.apellido + ' ' + row.idTecnico.nombre);
          }
        },
        { data: 'idTecnico.localidad' },
        { 'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        { data: 'idReclamo.idCliente.telefono' },
        { 'render':
          function (data, type, row) {
              return (row.idReclamo.idProducto.marca);
          }
        },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idReclamo.idProducto.modelo.length; i++) if(row.idReclamo.idProducto.modelo[i]._id == row.idReclamo.idModelo) return (row.idReclamo.idProducto.modelo[i].nombre);
            return ('');
          }
        },
        { data: 'repuesto' },
        { data: 'observacion' },
        { 'render':
            function (data, type, row) {
              return convertirFechaHora(row.fechaArchivado);
            }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_repuesto_archivado tbody", table);
}

function setDatosArchivado(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionArchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionArchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(positionArchivado).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionArchivado)){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
}

function validarPositionGrilla(position){
  if(position != null) return true;
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  positionDesarchivado = null;
  positionArchivado = null;
  idReclamo = null;
  limpiarSelect('#selectNumeroOrden');
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  $('#observacion').val('');
  $('#selectNumeroOrden').val('');
  $('#fotoRepuesto').val('');
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  limpiarSelect('#selectProducto')
  functionBack = 'updProforma';
  _id = data_row._id;
  $('#observacion').val(data_row.observacion);
}

function abrirAlertaArchivarRepuesto(){
  Swal.fire({
    title: 'Se archivar&aacute; el repuesto',
    text: '¿Archivar repuesto?',
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
          archivarRepuesto();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarRepuesto(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-repuesto/archivarRepuesto');
  _ajax.go(
    ({
      function_response: onArchivarRepuesto,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarRepuesto(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}

function abrirAlertaDesarchivarRepuesto(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el repuesto',
    text: '¿Desarchivar repuesto?',
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
          desarchivarRepuesto();
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarRepuesto(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-repuesto/desarchivarRepuesto');
  _ajax.go(
    ({
      function_response: onDesarchivarRepuesto,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDesarchivarRepuesto(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}
