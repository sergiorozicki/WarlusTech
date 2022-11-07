var reg_planilla_pendiente = new Array(), reg_planilla_archivada = new Array(), data_row = new Array();
var positionDesarchivado = null, positionArchivado = null, _id = null, idTecnico = null;
var seccionDesarchivado = false;
var seccionArchivado = true;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioPlanilla'));

  $('#btn_nueva_planilla').click(function() {
    limpiarFormulario();
    myModal.show();
  });
  
  $('#btn_descargar_planilla_pendiente').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      downloadPlanilla();
    }
  });

  $('#btn_descargar_planilla_archivada').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      downloadPlanilla();
    }
  });

  $('#btn_archivar_planilla').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      abrirAlertaArchivarPlanilla();
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
  var file = document.getElementById("planillaPendiente");
  var formData = new FormData();
  formData.append('file', file.files[0]);
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
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
}

function getPlanillaPendiente(i, clase) {
  positionDesarchivado = null;
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
  if(data != false) {
    reg_planilla_pendiente = data.data;
    idTecnico = data.idTecnico;
  }

  var table = $('#tbl_planilla_pendiente').DataTable({
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
    'data': reg_planilla_pendiente,
    'columns': [
        { 'render':
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
  positionDesarchivado = null;
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
  if(data != false) {
    reg_planilla_archivada = data.data;
    idTecnico = data.idTecnico;
  }

  var table = $('#tbl_planilla_archivada').DataTable({
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
    'data': reg_planilla_archivada,
    'columns': [
        { 'render':
            function (data, type, row) {
              return convertirFechaHora(row.split('_')[1].split('.')[0]);
            }
        },
        { 'render':
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

function downloadPlanilla() {
  window.location = '../tecnico-planilla/downloadPlanilla?nombre=' + data_row;
}

function validarPositionGrilla(position){
  if(position != null) return true;
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva planilla');
  $('#formularioPlanilla').removeClass('was-validated');
  positionDesarchivado = null;
  positionArchivado = null;
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
  positionDesarchivado = null;
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
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getPlanillaPendiente('#btn_actualizar i', '#span_actualizar');
  getPlanillaArchivada('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}