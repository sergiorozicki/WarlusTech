var _ajax = new Ajax;
var reg_planilla_pendiente, reg_planilla_archivada, data_row = new Array();
var positionSuperior, positionInferior, _id = null;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioPlanilla'));

  $('#btn_nueva_planilla').click(function() {
    limpiarFormulario();
    myModal.show();
  });
  
  $('#btn_descargar_planilla_pendiente').click(function() {
    if(validarPositionGrillaSuperior()){
      downloadPlanilla();
    }
  });

  $('#btn_descargar_planilla_archivada').click(function() {
    if(validarPositionGrillaInferior()){
      downloadPlanilla();
    }
  });

  $('#btn_archivar_planilla').click(function() {
    if(validarPositionGrillaSuperior()){
      abrirAlertaArchivarPlanilla();
    }
  });

  $('#btn_desarchivar_planilla').click(function() {
    if(validarPositionGrillaInferior()){
      abrirAlertaDesarchivarPlanilla();
    }
  });

  $('#btn_actualizar').click(function() {
    getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioPlanilla'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          if (validarExtensionArchivo()) {
            insPlanilla('#btn_guardar i', '#span_guardar');
          }
        }
        $('#formularioPlanilla').addClass('was-validated');
      });
    });

  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function validarExtensionArchivo(){
  var extenciones = /(.xlsx|.xls)$/i;
  if(!extenciones.exec($('#planillaPendiente').val())){
    alertSinRedireccion('¡Ups!', 'Los archivos deben ser tipo Excel.', 'info', true, false);
    $('#planillaPendiente').val('');
    return false;
  }
  return true;
}

function insPlanilla(i, clase) {
  if(!_id) _ajax.setUrl('../tecnico-planilla/insPlanilla');
  else _ajax.setUrl('../tecnico-planilla/updPlanilla');
  console.log(_ajax.getUrl());
  var file = document.getElementById("planillaPendiente");
  var formData = new FormData();
  formData.append('file', file.files[0]);
  console.log(formData);
  _ajax.setContentType(false);
  _ajax.setProcessData(false);
  _ajax.go(
    ({
      function_response: onInsPlanilla,
      i: i,
      clase: clase,
      params: formData
    })
  );
}

function onInsPlanilla(data) {
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
}

function getPlanillaPendiente(i, clase) {
  positionSuperior = null;
  _ajax.setUrl('../tecnico-planilla/getPlanillaPendiente');
  _ajax.setContentType('application/x-www-form-urlencoded; charset=UTF-8');
  _ajax.setProcessData(true);
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
  reg_planilla_pendiente = data.data;

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
    'data': reg_planilla_pendiente,
    'columns': [{
        'render':
          function (data, type, row) {
            return ('Planilla de liquidaci&oacute;n');
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.split('_')[1].split('.')[0]);
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
  positionSuperior = null;
  _ajax.setUrl('../tecnico-planilla/getPlanillaArchivada');
  _ajax.setContentType('application/x-www-form-urlencoded; charset=UTF-8');
  _ajax.setProcessData(true);
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
  reg_planilla_pendiente = data.data;

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
    'data': reg_planilla_pendiente,
    'columns': [{
        'render':
          function (data, type, row) {
            return ('Planilla de liquidaci&oacute;n');
          }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.split('_')[1].split('.')[0]);
            }
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.split('_')[2].split('.')[0]);
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

function downloadPlanilla() {
  window.location = '../tecnico-planilla/downloadPlanilla?nombre=' + data_row;
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

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva planilla');
  $('#formularioPlanilla').removeClass('was-validated');
  positionSuperior = null;
  positionInferior = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  $('#planillaPendiente').val('');
}

function abrirAlertaArchivarPlanilla(){
  Swal.fire({
    title: 'Se archivar&aacute; la planilla',
    text: '¿Archivar planilla?',
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
          archivarPlanilla();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarPlanilla(){
  positionSuperior = null;
  _ajax.setUrl('../tecnico-planilla/archivarPlanilla');
  _ajax.go(
    ({
      function_response: onArchivarPlanilla,
      i: null,
      clase: null,
      params: ({
        nombre: data_row
      })
    })
  );
}

function onArchivarPlanilla(data){
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
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
  positionSuperior = null;
  _ajax.setUrl('../tecnico-planilla/desarchivarPlanilla');
  _ajax.go(
    ({
      function_response: onDesarchivarPlanilla,
      i: null,
      clase: null,
      params: ({
        nombre: data_row
      })
    })
  );
}

function onDesarchivarPlanilla(data){
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}