var _ajax = new Ajax;
var reg_reclamo, reg_repuesto, data_row = new Array();
var positionSuperior, positionInferior, _id, idTecnico = null;
var myModal;
var abrirPdf = false;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioRepuesto'));

  $('#btn_solicitar_repuesto').click(function() {
    limpiarFormulario();
    getReclamo('#btn_solicitar_repuesto i', '#span_solicitar_repuesto');
  });
  
  $('#btn_editar_proforma').click(function() {
    if(validarPositionGrillaSuperior()){
      pasarValoresAlFormulario();
      getProducto('#btn_editar_proforma i', '#span_editar_proforma');
    }
  });

  $('#btn_actualizar').click(function() {
    getRepuesto('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getRepuesto('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  $('#btn_archivar_repuesto').click(function() {
    if(validarPositionGrillaSuperior()){
      abrirAlertaArchivarRepuesto();
    }
  });

  $('#btn_desarchivar_repuesto').click(function() {
    if(validarPositionGrillaInferior()){
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
  
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function insRepuesto() {
  _ajax.setUrl('../administrativo-repuesto/insRepuesto');
  console.log(_ajax.getUrl());
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
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
}

function getReclamo(i, clase) {
  positionSuperior = null;
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
  positionSuperior = null;
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
  reg_repuesto = data.data;
  idTecnico = data.idTecnico;

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
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idReclamo.numeroOrden'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idTecnico.idUser.apellido + ' ' + row.idTecnico.idUser.nombre);
          }
        },
        {
          data: 'idTecnico.localidad'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        {
          data: 'idReclamo.idCliente.telefono'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idProducto.marca + ' ' + row.idProducto.modelo);
          }
        },
        {
          data: 'repuesto'
        },
        {
          data: 'observacion'
        }
    ],
    language: language
  });
  setDatos("#tbl_repuesto tbody", table);
}

function setDatos(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionSuperior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionSuperior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(positionSuperior).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrillaSuperior()){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function getRepuestoArchivado(i, clase) {
  positionSuperior = null;
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
  reg_repuesto = data.data;
  idTecnico = data.idTecnico;

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
    'data': reg_repuesto,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idReclamo.numeroOrden'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idTecnico.idUser.apellido + ' ' + row.idTecnico.idUser.nombre);
          }
        },
        {
          data: 'idTecnico.localidad'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        {
          data: 'idReclamo.idCliente.telefono'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idProducto.marca + ' ' + row.idProducto.modelo);
          }
        },
        {
          data: 'repuesto'
        },
        {
          data: 'observacion'
        },
        {
          'render':
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
    positionInferior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionInferior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(positionInferior).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrillaSuperior()){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
}

function validarPositionGrillaSuperior(){
  if(positionSuperior != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function validarPositionGrillaInferior(){
  if(positionInferior != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla inferior.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  positionSuperior = null;
  positionInferior = null;
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
  positionSuperior = null;
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
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
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
  positionSuperior = null;
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
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}
