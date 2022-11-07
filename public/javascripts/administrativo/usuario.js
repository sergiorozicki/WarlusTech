var reg_usuario = new Array(), reg_usuario_archivado = new Array(), reg_role = new Array(), data_row = new Array();
var positionSuperior = null, positionInferior = null, _id = null;
var seccionDesarchivado = false;
var seccionArchivado = true;
var myModalInsertar, myModalEditar;

$(function() {
  myModalInsertar = new bootstrap.Modal($('#divFormularioUsuarioInsertar'));
  myModalEditar = new bootstrap.Modal($('#divFormularioUsuarioEditar'));

  $('#btn_nuevo_usuario').click(function() {
    limpiarFormularioInsertar();
    myModalInsertar.show();
  });
  
  $('#btn_editar_usuario').click(function() {
    if(validarPositionGrillaSuperior()){
      pasarValoresAlFormularioUsuario();
      myModalEditar.show();
    }
  });

  $('#btn_archivar_usuario').click(function() {
    if(validarPositionGrillaSuperior()){
      abrirAlertaArchivarUsuario();
    }
  });

  $('#btn_desarchivar_usuario').click(function() {
    if(validarPositionGrillaInferior()){
      abrirAlertaDesarchivarUsuario();
    }
  });

  $('#btn_actualizar').click(function() {
    getUsuario('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getUsuarioArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioUsuarioInsertar'))
    .forEach(function (form) {
      $('#btn_guardar_insertar').click(function() {
        if (form.checkValidity()) {
          insUsuario('#btn_guardar_insertar i', '#span_guardar_insertar');
        }
        $('#formularioUsuarioInsertar').addClass('was-validated');
      });
    });

    Array.prototype.slice.call($('#formularioUsuarioEditar'))
    .forEach(function (form) {
      $('#btn_guardar_editar').click(function() {
        if (form.checkValidity()) {
          updUsuario('#btn_guardar_editar i', '#span_guardar_editar');
        }
        $('#formularioUsuarioEditar').addClass('was-validated');
      });
    });

    $('#seccionDesarchivado').click(function() {
      setTimeout(() => {
        if(seccionDesarchivado) {
          onGetUsuario(false);
          seccionDesarchivado = false;
        }
      }, 250);
    });
  
    $('#seccionArchivado').click(function() {
      setTimeout(() => {
        if (seccionArchivado) {
          onGetUsuarioArchivado(false);
          seccionArchivado = false;
        }
      }, 250);
    });

  getUsuario('#btn_actualizar i', '#span_actualizar');
  getUsuarioArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  getRole();
});

function insUsuario(i, clase) {
  _ajax.setUrl('../administrativo-usuario/insUsuario');
  _ajax.go(
    ({
      function_response: onInsUsuario,
      i: i,
      clase: clase,
      params: ({
        email: $('#emailInsertar').val(),
        user: $('#userInsertar').val(),
        idRole: $('#selectRolesInsertar option:selected').val(),
        password: $('#passwordInsertar').val(),
        passwordConfirmar: $('#passwordConfirmarInsertar').val()
      })
    })
  );
}

function onInsUsuario(data) {
  myModalInsertar.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getUsuario('#btn_actualizar i', '#span_actualizar');
}

function updUsuario(i, clase) {
  _ajax.setUrl('../administrativo-usuario/updUsuario');
  _ajax.go(
    ({
      function_response: onUpdUsuario,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        email: $('#emailEditar').val(),
        user: $('#userEditar').val(),
        idRole: $('#selectRolesEditar option:selected').val()
      })
    })
  );
}

function onUpdUsuario(data) {
  myModalEditar.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getUsuario('#btn_actualizar i', '#span_actualizar');
}

function getRole() {
  positionSuperior = null;
  _ajax.setUrl('../administrativo-usuario/getRole');
  _ajax.go(
    ({
      function_response: onGetRole,
      i: null,
      clase: null,
      params: ({})
    })
  );
}

function onGetRole(data){
  reg_role = data.data;
  var options = '';
  for (var i = 0; i < reg_role.length; i++) {
    options += '<option value="' + reg_role[i]['_id'] + '">' + reg_role[i]['name'] + '</option>';
  }
  $('#selectRolesInsertar').append(options);
  $('#selectRolesEditar').append(options);
}


function getUsuario(i, clase) {
  positionSuperior = null;
  _ajax.setUrl('../administrativo-usuario/getUsuario');
  _ajax.go(
    ({
      function_response: onGetUsuario,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetUsuario(data) {
  if(data != false) reg_usuario = data.data;

  var table = $('#tbl_usuario').DataTable({
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
    'data': reg_usuario,
    'columns': [
        { data: 'email' },
        { data: 'user' },
        { data: 'idRole.name' }
    ],
    language: language
  });
  setDatos("#tbl_usuario tbody", table);
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
        pasarValoresAlFormularioUsuario();
        myModalEditar.show();
      }
    }
  });
}

function getUsuarioArchivado(i, clase) {
  positionSuperior = null;
  _ajax.setUrl('../administrativo-usuario/getUsuarioArchivado');
  _ajax.go(
    ({
      function_response: onGetUsuarioArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetUsuarioArchivado(data) {
  if(data != false) reg_usuario_archivado = data.data;

  var table = $('#tbl_usuario_archivado').DataTable({
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
    'data': reg_usuario_archivado,
    'columns': [
        { data: 'email' },
        { data: 'user' },
        { data: 'idRole.name' },
        { 'render':
          function (data, type, row) {
            var date = new Date(row.fechaArchivado);
            return convertirFechaHora(row.fechaArchivado);
          }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_usuario_archivado tbody", table);
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
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
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

function limpiarFormularioInsertar(){
  $('#tituloFormularioInsertar').html('Nuevo usuario');
  $('#formularioUsuarioInsertar').removeClass('was-validated');
  positionSuperior = null;
  positionInferior = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  $('#emailInsertar').val('');
  $('#userInsertar').val('');
  $('#selectRolesInsertar').val(''),
  $('#passwordInsertar').val('');
  $('#passwordConfirmarInsertar').val('');
}

function pasarValoresAlFormularioUsuario(){
  $('#tituloFormularioEditar').html('Editar usuario');
  $('#formularioUsuarioEditar').removeClass('was-validated');
  _id = data_row._id
  $('#emailEditar').val(data_row.email);
  $('#userEditar').val(data_row.user);
  $('#selectRolesEditar').val(data_row.idRole._id),
  $('#passwordActualEditar').val('');
  $('#passwordNuevaEditar').val('');
  $('#passwordConfirmarEditar').val('');
}

function abrirAlertaArchivarUsuario(){
  Swal.fire({
    title: 'Se archivar&aacute; el usuario',
    text: '¿Archivar usuario?',
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
          archivarUsuario();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarUsuario(){
  positionSuperior = null;
  _ajax.setUrl('../administrativo-usuario/archivarUsuario');
  _ajax.go(
    ({
      function_response: onArchivarUsuario,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarUsuario(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getUsuario('#btn_actualizar i', '#span_actualizar');
  getUsuarioArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}

function abrirAlertaDesarchivarUsuario(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el usuario',
    text: '¿Desarchivar usuario?',
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
          desarchivarUsuario();
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarUsuario(){
  positionSuperior = null;
  _ajax.setUrl('../administrativo-usuario/desarchivarUsuario');
  _ajax.go(
    ({
      function_response: onDesarchivarUsuario,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDesarchivarUsuario(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getUsuario('#btn_actualizar i', '#span_actualizar');
  getUsuarioArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}