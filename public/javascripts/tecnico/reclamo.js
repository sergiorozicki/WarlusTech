var _ajax = new Ajax;
var reg_reclamo = new Array();
var reg_reclamo_solicitado = new Array();
var reg_tecnico = new Array();
var position = null;
var position_solicitado = null;
var data_row = new Array();
var _idReclamo, _idCliente = null;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioReclamo'));

  $('#btn_nuevo_reclamo').click(function() {
    limpiarFormulario();
    myModal.show();
  });
  
  $('#btn_editar_reclamo').click(function() {
    if(validarPositionGrillaReclamo()){
      pasarValoresAlFormularioReclamo();
      myModal.show();
    }
  });

  $('#btn_eliminar_reclamo').click(function() {
    if(validarPositionGrillaReclamo()){
      abrirAlertaEliminarReclamo();
    }
  });

  $('#btn_actualizar').click(function() {
    position = null;
    position_solicitado = null;
    getReclamo('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_aceptar_solicitud').click(function() {
    if(validarPositionGrillaReclamoSolicitado()){
      pasarValoresAlFormularioReclamo();
      $('#tituloFormulario').text('Aceptar reclamo');
      myModal.show();
    }
  });

  $('#btn_eliminar_solicitud').click(function() {
    if(validarPositionGrillaReclamoSolicitado()){
      abrirAlertaEliminarReclamoSolicitado();
    }
  });

  Array.prototype.slice.call($('#formularioReclamo'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          insReclamo('#btn_guardar i', '#span_guardar');
        }
        $('#formularioReclamo').addClass('was-validated');
      });
    });

  getReclamo('#btn_actualizar i', '#span_actualizar');
});

function insReclamo(i, clase) {
  if(!_idReclamo) _ajax.setUrl('../tecnico-reclamo/insCliente');
  else _ajax.setUrl('../tecnico-reclamo/updCliente');
  console.log(_ajax.getUrl());
  _ajax.go(
    ({
      function_response: onInsReclamo,
      i: i,
      clase: clase,
      params: ({
        _id: _idReclamo,
        idCliente: _idCliente,
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        localidad: $('#localidad').val(),
        codigoPostal: $('#codigoPostal').val(),
        marca: $('#marca').val(),
        modelo: $('#modelo').val(),
        numeroSerie: $('#numeroSerie').val(),
        falla: $('#falla').val(),
        observacion: $('#observacion').val(),
        tecnico: $('#select_tecnicos option:selected').val()
      })
    })
  );
}

function onInsReclamo(data) {
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamo(null, null);
}

function getReclamo(i, clase) {
  position = null;
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
  reg_reclamo = new Array();
  reg_reclamo_solicitado = new Array();
  for (var i = 0; i < data.data.length; i++) {
    if (data.data[i].estado != 'Reclamo solicitado')reg_reclamo.push(data.data[i]);
    else reg_reclamo_solicitado.push(data.data[i]);
  }

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
    'data': data.data,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idCliente._id',
          visible: false
        },
        {
          data: 'numeroOrden'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idCliente.apellido + ' ' + row.idCliente.nombre);
          }
        },
        {
          data: 'idCliente.dni'
        },
        {
          data: 'idCliente.telefono'
        },
        {
          data: 'idCliente.email'
        },
        {
          data: 'idCliente.direccion'
        },
        {
          data: 'idCliente.localidad'
        },
        {
          data: 'idCliente.codigoPostal'
        },
        {
          data: 'marca'
        },
        {
          data: 'modelo'
        },
        {
          data: 'numeroSerie'
        },
        {
          data: 'falla'
        },
        {
          data: 'observacion'
        },
        {
          data: 'idEstado'
        }
    ],
    language: language
  });
  setDatos("#tbl_reclamo tbody", table);
}

function setDatos(tbody, table) {
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    position = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function(event) {
    position = table.row( this ).index();
    $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrillaReclamo()){
        pasarValoresAlFormularioReclamo();
        myModal.show();
      }
    }
  });
}

function validarPositionGrillaReclamo(){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la grilla superior.', 'warning', true, false);
  return false;
}

function validarPositionGrillaReclamoSolicitado(){
  if(position_solicitado != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la grilla inferior.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nuevo reclamo');
  $('#formularioReclamo').removeClass('was-validated');
  position = null;
  position_solicitado = null;
  $('.tbl_listado tbody tr').css('background-color', 'rgb(220,220,220)');
  _idReclamo = null;
  _idCliente = null;
  $('#apellido').val('');
  $('#nombre').val('');
  $('#dni').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
  $('#marca').val('');
  $('#modelo').val('');
  $('#numeroSerie').val('');
  $('#falla').val('');
  $('#observacion').val('');
  $('#select_tecnicos').val('');
}

function pasarValoresAlFormularioReclamo(){
  $('#tituloFormulario').text('Editar reclamo');
  $('#formularioReclamo').removeClass('was-validated');
  _idReclamo = data_row._id;
  _idCliente = data_row.idCliente._id;
  $('#apellido').val(data_row.idCliente.apellido);
  $('#nombre').val(data_row.idCliente.nombre);
  $('#dni').val(data_row.idCliente.dni);
  $('#telefono').val(data_row.idCliente.telefono);
  $('#email').val(data_row.idCliente.email);
  $('#direccion').val(data_row.idCliente.direccion);
  $('#localidad').val(data_row.idCliente.localidad);
  $('#codigoPostal').val(data_row.idCliente.codigoPostal);
  $('#marca').val(data_row.marca);
  $('#modelo').val(data_row.modelo);
  $('#numeroSerie').val(data_row.numeroSerie);
  $('#falla').val(data_row.falla);
  $('#observacion').val(data_row.observacion);
  data_row.tecnico ? $('#select_tecnicos').val(data_row.tecnico._id) : $('#select_tecnicos').val('');
}

function abrirAlertaEliminarReclamoSolicitado(){
  Swal.fire({
    title: 'Eliminar reclamo solicitado',
    text: '¿Eliminar reclamo solictado?',
    width: '500px',
    showCancelButton: true,
    showCloseButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-trash"></i> Eliminar',
    cancelButtonText: '<i class="fa fa-ban"></i> Cancelar',
    confirmButtonClass: 'rounded-pill',
    cancelButtonClass: 'rounded-pill',
    focusConfirm: false,
    customClass: {popup: 'form-swal'},
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve) => {
        setTimeout(() => {
          eliminarReclamoSolicitado();
          resolve(true);
        }, 500);
      });
    }
  });
}

function abrirAlertaEliminarReclamo(){
  Swal.fire({
    title: 'Se eliminar&aacute; el reclamo',
    text: '¿Eliminar reclamo?',
    width: '500px',
    showCancelButton: true,
    showCloseButton: false,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '<i class="fa fa-trash"></i> Eliminar',
    cancelButtonText: '<i class="fa fa-ban"></i> Cancelar',
    confirmButtonClass: 'rounded-pill',
    cancelButtonClass: 'rounded-pill',
    focusConfirm: false,
    customClass: {popup: 'form-swal'},
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve) => {
        setTimeout(() => {
          //eliminarReclamo();
          resolve(true);
        }, 500);
      });
    }
  });
}

function eliminarReclamo(){
  position = null;
  _ajax.setUrl('../tecnico-reclamo/delReclamo');
  _ajax.go(
    ({
      function_response: onDelReclamo,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDelReclamo(data){
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getReclamo('#btn_actualizar i', '#span_actualizar');
}