var reg_reclamo = new Array(), reg_reclamo_archivado = data_row = new Array();
var positionArchivado = null, positionDesarchivado = null, position_solicitado = null, _idReclamo = null, _idCliente = null;
var seccionPendiente = false, seccionArchivado = true;
var myModal, myModalPresentacionFotos;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioReclamo'));
  myModalPresentacionFotos = new bootstrap.Modal($('#divPresentacionFotos'));

  $('#btn_dar_alta_reclamo').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      abrirAlertaDarAltaReclamo();
    }
  });

  $('#btn_actualizar').click(function() {
    positionDesarchivado = null;
    position_solicitado = null;
    getReclamo('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    positionArchivado = null;
    position_solicitado = null;
    getReclamoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  $('#seccionPendiente').click(function() {
    positionArchivado = null
    setTimeout(() => {
      if(seccionPendiente) {
        onGetReclamo(false);
        seccionPendiente = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    positionDesarchivado = null
    setTimeout(() => {
      if(seccionArchivado) {
        onGetReclamoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  $('#btn_ver_fotos_reclamo_aceptado').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      getFoto('#btn_ver_fotos_reclamo_aceptado i', '#span_ver_fotos_reclamo_aceptado');
    }
  });

  $('#btn_ver_fotos_reclamo_archivado').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      getFoto('#btn_ver_fotos_reclamo_archivado i', '#span_ver_fotos_reclamo_archivado');
    }
  });

  $('#btn_descargar_presentacion_foto_equipo').click(function() {
    descargarFoto();
  });

  getReclamo('#btn_actualizar i', '#span_actualizar');
  getReclamoArchivado('#btn_actualizar i', '#span_actualizar');
});

function getFoto(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-reclamo/getFoto');
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
  $('#presentacionFotoEquipo').attr('src', 'data:image/png;base64,' + data.data.fotoEquipo);
  myModalPresentacionFotos.show();
}

function descargarFoto() {
  window.location = '../tecnico-reclamo/downloadFoto?idReclamo=' + data_row._id;
}

function getReclamo(i, clase) {
  _ajax.setUrl('../tecnico-reclamo/getReclamo');
  _ajax.go(
    ({
      function_response: onGetReclamo,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamo(data) {
  if(data != false) reg_reclamo = data.data;

  var table = $('#tbl_reclamo').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '340px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [],
    'info': true,
    'destroy': true,
    'data': reg_reclamo,
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
        { data: 'idEstado[0].name' }
    ],
    language: language
  });
  setDatos("#tbl_reclamo tbody", table);
}

function setDatos(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionDesarchivado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function(event) {
    positionDesarchivado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(positionDesarchivado).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionDesarchivado)){
        abrirAlertaDarAltaReclamo();
      }
    }
  });
}

function getReclamoArchivado(i, clase) {
  _ajax.setUrl('../tecnico-reclamo/getReclamoArchivado');
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
    'scrollY': '340px',
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
            for (let i = 0; i < row.idProducto[0].modelo.length; i++) {
              if(row.idProducto[0].modelo[i]._id == row.idModelo) return (row.idProducto[0].modelo[i].nombre);
            }
            return ('');
          }
        },
        { data: 'falla' },
        { data: 'idEstado[0].name' }
    ],
    language: language
  });
  setDatosArchivado("#tbl_reclamo_archivado tbody", table);
}

function setDatosArchivado(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionArchivado = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
}

function validarPositionGrilla(position){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function abrirAlertaDarAltaReclamo(){
  Swal.fire({
    title: 'Se dar&aacute de alta el reclamo',
    text: '¿Dar de alta reclamo?',
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
          archivarReclamo();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarReclamo(){
  positionDesarchivado = null;
  _ajax.setUrl('../tecnico-reclamo/archivarReclamo');
  _ajax.go(
    ({
      function_response: onArchivarReclamo,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarReclamo(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamo('#btn_actualizar i', '#span_actualizar');
  getReclamoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}