var reg_administrativo = new Array(), reg_administrativo_archivado = new Array(), data_row = new Array();
var positionArchivado = null, positionDesarchivado = null, _id = null;
var seccionDesarchivado = false, seccionArchivado = true;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioAdministrativo'));

  $('#btn_nuevo_administrativo').click(function() {
    limpiarFormulario();
  });
  
  $('#btn_editar_administrativo').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      pasarValoresAlFormulario();
    }
  });

  $('#btn_archivar_administrativo').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      abrirAlertaArchivarAdministrativo();
    }
  });

  $('#btn_desarchivar_administrativo').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      abrirAlertaDesarchivarAdministrativo();
    }
  });
  
  $('#btn_actualizar').click(function() {
    getAdministrativo('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getAdministrativoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioAdministrativo'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          insAdministrativo('#btn_guardar i', '#span_guardar');
        }
        $('#formularioAdministrativo').addClass('was-validated');
      });
  });
    
  $('#seccionDesarchivado').click(function() {
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetAdministrativo(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });
  
  $('#seccionArchivado').click(function() {
    setTimeout(() => {
      if (seccionArchivado) {
        onGetAdministrativoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  getAdministrativo('#btn_actualizar i', '#span_actualizar');
  getAdministrativoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
});

function insAdministrativo(i, clase) {
  if(!_id) _ajax.setUrl('../administrativo-administrativo/insAdministrativo');
  else _ajax.setUrl('../administrativo-administrativo/updAdministrativo');
  _ajax.go(
    ({
      function_response: onInsAdministrativo,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        apellido: $('#apellido').val(),
        nombre: $('#nombre').val(),
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        codigoPostal: $('#codigoPostal').val(),
        cbu: $('#cbu').val(),
        horarioDesde: $('#horarioDesde').val(),
        horarioHasta: $('#horarioHasta').val(),
        user: $('#user').val(),
        password: $('#password').val(),
        passwordConfirmar: $('#passwordConfirmarAdministrativo').val()
      })
    })
  );
}

function onInsAdministrativo(data) {
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getAdministrativo('#btn_actualizar i', '#span_actualizar');
}

function getAdministrativo(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-administrativo/getAdministrativo');
  _ajax.go(
    ({
      function_response: onGetAdministrativo,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetAdministrativo(data) {
  if(data != false) reg_administrativo = data.data;

  var table = $('#tbl_administrativo').DataTable({
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
    'data': reg_administrativo,
    'columns': [
        { data: 'legajo' },
        { data: 'apellido' },
        { data: 'nombre' },
        { data: 'dni' },
        { data: 'user' },
        { data: 'telefono' },
        { data: 'email' },
        { data: 'direccion' },
        { data: 'cbu' },
        { data: 'horarioDesde' },
        { data: 'horarioHasta' }
    ],
    language: language
  });
  setDatos("#tbl_administrativo tbody", table);
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
      }
    }
  });
}

function getAdministrativoArchivado(i, clase) {
  positionArchivado = null;
  _ajax.setUrl('../administrativo-administrativo/getAdministrativoArchivado');
  _ajax.go(
    ({
      function_response: onGetAdministrativoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetAdministrativoArchivado(data) {
  if(data != false) reg_administrativo_archivado = data.data;

  var table = $('#tbl_administrativo_archivado').DataTable({
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
    'data': reg_administrativo_archivado,
    'columns': [
        { data: 'legajo' },
        { data: 'apellido' },
        { data: 'nombre' },
        { data: 'dni' },
        { data: 'user' },
        { data: 'telefono' },
        { data: 'email' },
        { data: 'direccion' },
        { data: 'cbu' },
        { data: 'horarioDesde' },
        { data: 'horarioHasta' },
        { 'render':
          function (data, type, row) {
            return convertirFechaHora(row.fechaArchivado);
          }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_administrativo_archivado tbody", table);
}

function setDatosArchivado(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionArchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
}

function validarPositionGrilla(position){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').html('Nuevo administrativo');
  $('#formularioAdministrativo').removeClass('was-validated');
  positionArchivado = null;
  positionDesarchivado = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $('#passwordHide').show();
  $('#hrPassword').show();
  $("#password").attr('required', true);
  $('#passwordConfirmarAdministrativoHide').show();
  $("#passwordConfirmarAdministrativo").attr('required', true);
  _id = null;
  $('#apellido').val('');
  $('#nombre').val('');
  $('#dni').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#codigoPostal').val('');
  $('#cbu').val('');
  $('#horarioDesde').val('');
  $('#horarioHasta').val('');
  $('#user').val('');
  $('#password').val('');
  $('#passwordConfirmarAdministrativo').val('');
  myModal.show();
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').html('Editar administrativo');
  $('#formularioAdministrativo').removeClass('was-validated');
  $('#passwordHide').hide();
  $('#hrPassword').hide();
  $("#password").attr('required', false);
  $('#passwordConfirmarAdministrativoHide').hide();
  $("#passwordConfirmarAdministrativo").attr('required', false);
  _id = data_row._id
  $('#apellido').val(data_row.apellido);
  $('#nombre').val(data_row.nombre);
  $('#dni').val(data_row.dni);
  $('#telefono').val(data_row.telefono);
  $('#email').val(data_row.email);
  $('#direccion').val(data_row.direccion);
  $('#codigoPostal').val(data_row.codigoPostal);
  $('#cbu').val(data_row.cbu);
  $('#horarioDesde').val(data_row.horarioDesde);
  $('#horarioHasta').val(data_row.horarioHasta);
  $('#user').val(data_row.user);
  myModal.show();
}

function abrirAlertaArchivarAdministrativo(){
  Swal.fire({
    title: 'Se archivar&aacute; el administrativo',
    text: '¿Archivar técnico?',
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
          archivarAdministrativo();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarAdministrativo(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-administrativo/archivarAdministrativo');
  _ajax.go(
    ({
      function_response: onArchivarAdministrativo,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarAdministrativo(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getAdministrativo('#btn_actualizar i', '#span_actualizar');
  getAdministrativoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}

function abrirAlertaDesarchivarAdministrativo(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el administrativo',
    text: '¿Desarchivar técnico?',
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
          desarchivarAdministrativo();
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarAdministrativo(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-administrativo/desarchivarAdministrativo');
  _ajax.go(
    ({
      function_response: onDesarchivarAdministrativo,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDesarchivarAdministrativo(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getAdministrativo('#btn_actualizar i', '#span_actualizar');
  getAdministrativoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}