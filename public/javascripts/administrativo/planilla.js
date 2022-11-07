var reg_planilla = new Array(), reg_planilla_archivada = new Array(), data_row = new Array();
var positionDesarchivado = null, positionArchivado = null;
var seccionDesarchivado = false;
var seccionArchivado = true;

$(function() {
  $('#btn_descargar_planilla_pendiente').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      downloadPlanillaPendiente();
    }
  });

  $('#btn_descargar_planilla_archivada').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      downloadPlanillaArchivada();
    }
  });

  $('#btn_actualizar').click(function() {
    getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  $('#btn_desarchivar_planilla').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      abrirAlertaDesarchivarPlanilla();
    }
  });

  $('#seccionDesarchivado').click(function() {
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetPlanillaPendiente(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    setTimeout(() => {
      if (seccionArchivado) {
        onGetPlanillaArchivada(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function getPlanillaPendiente(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-planilla/getPlanillaPendiente');
  _ajax.go(
    ({
      function_response: onGetPlanillaPendiente,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetPlanillaPendiente(data) {
  if(data != false) reg_planilla = data.data;

  var table = $('#tbl_planilla_pendiente').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '390px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [[1, "desc"]],
    'info': true,
    'destroy': true,
    'data': reg_planilla,
    'columns': [
        {
        'render':
          function (data, type, row) {
            return (row.apellido + ' ' + row.nombre);
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.archivo.split('_')[1]);
            }
        }
    ],
    language: language
  });
  setDatos("#tbl_planilla_pendiente tbody", table);
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
}

function getPlanillaArchivada(i, clase) {
  positionArchivado = null;
  _ajax.setUrl('../administrativo-planilla/getPlanillaArchivada');
  _ajax.go(
    ({
      function_response: onGetPlanillaArchivada,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetPlanillaArchivada(data) {
  if(data != false) reg_planilla_archivada = data.data;

  var table = $('#tbl_planilla_archivada').DataTable({
    'autoWidth': false,
    'scrollX': true,
    'scrollY': '390px',
    'scrollCollapse': true,
    'paging': true,
    'lengthChange': true,
    'searching': true,
    'ordering': true,
    'aaSorting': [[1, "desc"]],
    'info': true,
    'destroy': true,
    'data': reg_planilla_archivada,
    'columns': [
        {
        'render':
          function (data, type, row) {
            return (row.apellido + ' ' + row.nombre);
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.archivo.split('_')[1]);
            }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.archivo.split('_')[2]);
            }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_planilla_archivada tbody", table);
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
}

function convertirFechaHora(data){
  return (data[6] + data[7] + "/" + data[4] + data[5] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[8] + data[9] + ":" + data[10] + data[11] + ":" + data[12] + data[13]);
}

function downloadPlanillaPendiente() {
  window.location = '../administrativo-planilla/downloadPlanillaPendiente?nombre=' + data_row.archivo;
}

function downloadPlanillaArchivada() {
  window.location = '../administrativo-planilla/downloadPlanillaArchivada?nombre=' + data_row.archivo;
}

function validarPositionGrilla(position){
  if(position != null) return true;
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function abrirAlertaDesarchivarPlanilla(){
  Swal.fire({
    title: 'Se desarchivar&aacute; la planilla',
    text: '¿Desarchivar planilla?',
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
          desarchivarPlanilla();
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarPlanilla(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-planilla/desarchivarPlanilla');
  _ajax.go(
    ({
      function_response: onDesarchivarPlanilla,
      i: null,
      clase: null,
      params: ({ nombre: data_row.archivo })
    })
  );
}

function onDesarchivarPlanilla(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}