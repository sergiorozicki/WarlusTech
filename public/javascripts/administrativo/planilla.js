var _ajax = new Ajax;
var reg_planilla, data_row = new Array();
var positionSuperior, positionInferior = null;

$(function() {
  $('#btn_descargar_planilla_pendiente').click(function() {
    if(validarPositionGrillaSuperior()){
      downloadPlanillaPendiente();
    }
  });

  $('#btn_descargar_planilla_archivada').click(function() {
    if(validarPositionGrillaInferior()){
      downloadPlanillaArchivada();
    }
  });

  $('#btn_actualizar').click(function() {
    getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function getPlanillaPendiente(i, clase) {
  positionSuperior = null;
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
  reg_planilla = data.data;

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
            return ('Planilla de liquidaci&oacute;n');
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.archivo.split('_')[1].split('.')[0]);
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
    positionSuperior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
}

function getPlanillaArchivada(i, clase) {
  positionInferior = null;
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
  reg_planilla = data.data;

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
            return ('Planilla de liquidaci&oacute;n');
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.archivo.split('_')[1].split('.')[0]);
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
    positionInferior = table.row( this ).index();
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

function validarPositionGrillaSuperior(){
  if(positionSuperior != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla superior.', 'warning', true, false);
  return false;
}

function validarPositionGrillaInferior(){
  if(positionInferior != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla inferior.', 'warning', true, false);
  return false;
}