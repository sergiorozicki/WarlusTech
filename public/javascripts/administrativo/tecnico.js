var reg_tecnico = new Array(), reg_tecnico_archivado = new Array(), data_row = new Array();
var positionArchivado = null, positionDesarchivado = null, _id = null;
var seccionDesarchivado = false, seccionArchivado = true;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioTecnico'));

  $('#btn_nuevo_tecnico').click(function() {
    limpiarFormulario();
  });
  
  $('#btn_editar_tecnico').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      pasarValoresAlFormulario();
    }
  });

  $('#btn_archivar_tecnico').click(function() {
    if(validarPositionGrilla(positionDesarchivado)){
      abrirAlertaArchivarTecnico();
    }
  });

  $('#btn_desarchivar_tecnico').click(function() {
    if(validarPositionGrilla(positionArchivado)){
      abrirAlertaDesarchivarTecnico();
    }
  });
  
  $('#btn_actualizar').click(function() {
    getTecnico('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioTecnico'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          insTecnico('#btn_guardar i', '#span_guardar');
        }
        $('#formularioTecnico').addClass('was-validated');
      });
  });
    
  $('#seccionDesarchivado').click(function() {
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetTecnico(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });
  
  $('#seccionArchivado').click(function() {
    setTimeout(() => {
      if (seccionArchivado) {
        onGetTecnicoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  getTecnico('#btn_actualizar i', '#span_actualizar');
  getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
});

function insTecnico(i, clase) {
  if(!_id) _ajax.setUrl('../administrativo-tecnico/insTecnico');
  else _ajax.setUrl('../administrativo-tecnico/updTecnico');
  _ajax.go(
    ({
      function_response: onInsTecnico,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        apellido: $('#apellido').val(),
        nombre: $('#nombre').val(),
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        provincia: $('#provincia').val(),
        localidad: $('#localidad').val(),
        direccion: $('#direccion').val(),
        codigoPostal: $('#codigoPostal').val(),
        cbu: $('#cbu').val(),
        nombreServicio: $('#nombreServicio').val(),
        horarioDesde: $('#horarioDesde').val(),
        horarioHasta: $('#horarioHasta').val(),
        user: $('#user').val(),
        password: $('#password').val(),
        passwordConfirmar: $('#passwordConfirmarTecnico').val()
      })
    })
  );
}

function onInsTecnico(data) {
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getTecnico('#btn_actualizar i', '#span_actualizar');
}

function getTecnico(i, clase) {
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-tecnico/getTecnico');
  _ajax.go(
    ({
      function_response: onGetTecnico,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetTecnico(data) {
  if(data != false) reg_tecnico = data.data;

  var table = $('#tbl_tecnico').DataTable({
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
    'data': reg_tecnico,
    'columns': [
        { data: 'legajo' },
        { data: 'apellido' },
        { data: 'nombre' },
        { data: 'dni' },
        { data: 'user' },
        { data: 'telefono' },
        { data: 'email' },
        { data: 'localidad' },
        { data: 'provincia' },
        { data: 'direccion' },
        { data: 'cbu' },
        { data: 'nombreServicio' },
        { data: 'horarioDesde' },
        { data: 'horarioHasta' }
    ],
    language: language
  });
  setDatos("#tbl_tecnico tbody", table);
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

function getTecnicoArchivado(i, clase) {
  positionArchivado = null;
  _ajax.setUrl('../administrativo-tecnico/getTecnicoArchivado');
  _ajax.go(
    ({
      function_response: onGetTecnicoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetTecnicoArchivado(data) {
  if(data != false) reg_tecnico_archivado = data.data;

  var table = $('#tbl_tecnico_archivado').DataTable({
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
    'data': reg_tecnico_archivado,
    'columns': [
        { data: 'legajo' },
        { data: 'apellido' },
        { data: 'nombre' },
        { data: 'dni' },
        { data: 'user' },
        { data: 'telefono' },
        { data: 'email' },
        { data: 'localidad' },
        { data: 'provincia' },
        { data: 'direccion' },
        { data: 'cbu' },
        { data: 'nombreServicio' },
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
  setDatosArchivado("#tbl_tecnico_archivado tbody", table);
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
  $('#tituloFormulario').html('Nuevo t&eacute;cnico');
  $('#formularioTecnico').removeClass('was-validated');
  positionArchivado = null;
  positionDesarchivado = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $('#passwordHide').show();
  $('#hrPassword').show();
  $("#password").attr('required', true);
  $('#passwordConfirmarTecnicoHide').show();
  $("#passwordConfirmarTecnico").attr('required', true);
  _id = null;
  $('#apellido').val('');
  $('#nombre').val('');
  $('#dni').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#provincia').val('');
  $('#localidad').val('');
  $('#direccion').val('');
  $('#codigoPostal').val('');
  $('#cbu').val('');
  $('#nombreServicio').val('');
  $('#horarioDesde').val('');
  $('#horarioHasta').val('');
  $('#user').val('');
  $('#password').val('');
  $('#passwordConfirmarTecnico').val('');
  myModal.show();
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').html('Editar t&eacute;cnico');
  $('#formularioTecnico').removeClass('was-validated');
  $('#passwordHide').hide();
  $('#hrPassword').hide();
  $("#password").attr('required', false);
  $('#passwordConfirmarTecnicoHide').hide();
  $("#passwordConfirmarTecnico").attr('required', false);
  _id = data_row._id
  $('#apellido').val(data_row.apellido);
  $('#nombre').val(data_row.nombre);
  $('#dni').val(data_row.dni);
  $('#telefono').val(data_row.telefono);
  $('#email').val(data_row.email);
  $('#provincia').val(data_row.provincia);
  $('#localidad').val(data_row.localidad);
  $('#direccion').val(data_row.direccion);
  $('#codigoPostal').val(data_row.codigoPostal);
  $('#cbu').val(data_row.cbu);
  $('#nombreServicio').val(data_row.nombreServicio);
  $('#horarioDesde').val(data_row.horarioDesde);
  $('#horarioHasta').val(data_row.horarioHasta);
  $('#user').val(data_row.user);
  myModal.show();
}

function abrirAlertaArchivarTecnico(){
  Swal.fire({
    title: 'Se archivar&aacute; el t&eacute;cnico',
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
          archivarTecnico();
          resolve(true);
        }, 500);
      });
    }
  });
}

function archivarTecnico(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-tecnico/archivarTecnico');
  _ajax.go(
    ({
      function_response: onArchivarTecnico,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarTecnico(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getTecnico('#btn_actualizar i', '#span_actualizar');
  getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}

function abrirAlertaDesarchivarTecnico(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el t&eacute;cnico',
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
          desarchivarTecnico();
          resolve(true);
        }, 500);
      });
    }
  });
}

function desarchivarTecnico(){
  positionDesarchivado = null;
  _ajax.setUrl('../administrativo-tecnico/desarchivarTecnico');
  _ajax.go(
    ({
      function_response: onDesarchivarTecnico,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDesarchivarTecnico(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getTecnico('#btn_actualizar i', '#span_actualizar');
  getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}