var _ajax = new Ajax;
var reg_tecnico, reg_usuario, data_row = new Array();
var positionSuperior, positionInferior, _id, _idUsuario, _idGetUsuario = null;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioTecnico'));

  $('#btn_nuevo_tecnico').click(function() {
    limpiarFormulario();
    getUsuario('#btn_nuevo_tecnico i', '#span_nuevo_tecnico');
  });
  
  $('#btn_editar_tecnico').click(function() {
    if(validarPositionGrillaSuperior()){
      pasarValoresAlFormulario();
      getUsuario('#btn_editar_tecnico i', '#span_editar_tecnico');
    }
  });

  $('#btn_archivar_tecnico').click(function() {
    if(validarPositionGrillaSuperior()){
      abrirAlertaArchivarTecnico();
    }
  });

  $('#btn_desarchivar_tecnico').click(function() {
    if(validarPositionGrillaInferior()){
      abrirAlertaDesarchivarTecnico();
    }
  });
  
  $('#btn_actualizar').click(function() {
    getTecnico('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
  });

  $('#selectUsuario').change(function() {
    _idUsuario = $('#selectUsuario option:selected').val();
    if (_idUsuario != '') pasarNombreDeUsuario();
    else $('#user').val('');
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

  getTecnico('#btn_actualizar i', '#span_actualizar');
  getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
});

function getUsuario(i, clase) {
  positionSuperior = null;
  _ajax.setUrl('../administrativo-tecnico/getUsuario');
  _ajax.go(
    ({
      function_response: onGetUsuario,
      i: i,
      clase: clase,
      params: ({_id: _idGetUsuario})
    })
  );
}

function onGetUsuario(data){
  reg_usuario = data.data;
  console.log(reg_usuario);
  var options = '';
  for (var i = 0; i < reg_usuario.length; i++) {
    options += '<option value="' + reg_usuario[i]['_id'] + '">' + reg_usuario[i]['apellido'] + ' '+ reg_usuario[i]['nombre'] +'</option>';
  }
  $('#selectUsuario').append(options);
  myModal.show();
  $('#selectUsuario').val(_idGetUsuario);
}

function pasarNombreDeUsuario(){
  for (var i = 0; i < reg_usuario.length; i++) {
    if (reg_usuario[i]._id == _idUsuario) {
      $('#user').val(reg_usuario[i].user);
    }
  }
}

function insTecnico(i, clase) {
  if(!_id) _ajax.setUrl('../administrativo-tecnico/insTecnico');
  else _ajax.setUrl('../administrativo-tecnico/updTecnico');
  console.log(_ajax.getUrl());
  _ajax.go(
    ({
      function_response: onInsTecnico,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        idUser: $('#selectUsuario option:selected').val(),
        userActual: _idGetUsuario,
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        provincia: $('#provincia').val(),
        localidad: $('#localidad').val(),
        direccion: $('#direccion').val(),
        cbu: $('#cbu').val(),
        serviceNombre: $('#serviceNombre').val(),
        horarioDesde: $('#horarioDesde').val(),
        horarioHasta: $('#horarioHasta').val()
      })
    })
  );
}

function onInsTecnico(data) {
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getTecnico('#btn_actualizar i', '#span_actualizar');
}

function getTecnico(i, clase) {
  positionSuperior = null;
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
  console.log(data);
  reg_tecnico = data.data;

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
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'legajo'
        },
        {
          data: 'idUser.apellido'
        },
        {
          data: 'idUser.nombre'
        },
        {
          data: 'dni'
        },
        {
          data: 'idUser.user'
        },
        {
          data: 'telefono'
        },
        {
          data: 'idUser.email'
        },
        {
          data: 'localidad'
        },
        {
          data: 'provincia'
        },
        {
          data: 'direccion'
        },
        {
          data: 'cbu'
        },
        {
          data: 'serviceNombre'
        },
        {
          'render':
          function (data, type, row) {
            var dateDesde = new Date(row.horarioDesde);
            if (dateDesde.getUTCHours() < 10)var horaDesde = "0" + dateDesde.getUTCHours();
            else var horaDesde = dateDesde.getUTCHours();
            if(dateDesde.getUTCMinutes() < 10) var minutoDesde = "0" + dateDesde.getUTCMinutes();
            else var minutoDesde = dateDesde.getUTCMinutes();
            return (horaDesde + ":" + minutoDesde);
          }
        },
        {
          'render':
          function (data, type, row) {
            var dateHasta = new Date(row.horarioHasta);
            if (dateHasta.getUTCHours() < 10)var horaHasta = "0" + dateHasta.getUTCHours();
            else var horaHasta = dateHasta.getUTCHours();
            if(dateHasta.getUTCMinutes() < 10) var minutoHasta = "0" + dateHasta.getUTCMinutes();
            else var minutoHasta = dateHasta.getUTCMinutes();
            return (horaHasta + ":" + minutoHasta);
          }
        }
    ],
    language: language
  });
  setDatos("#tbl_tecnico tbody", table);
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
        getUsuario('#btn_editar_tecnico i', '#span_editar_tecnico');
      }
    }
  });
}

function getTecnicoArchivado(i, clase) {
  positionInferior = null;
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
  console.log(data);
  reg_tecnico = data.data;

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
    'data': reg_tecnico,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'legajo'
        },
        {
          data: 'idUser.apellido'
        },
        {
          data: 'idUser.nombre'
        },
        {
          data: 'dni'
        },
        {
          data: 'idUser.user'
        },
        {
          data: 'telefono'
        },
        {
          data: 'idUser.email'
        },
        {
          data: 'localidad'
        },
        {
          data: 'provincia'
        },
        {
          data: 'direccion'
        },
        {
          data: 'cbu'
        },
        {
          data: 'serviceNombre'
        },
        {
          'render':
          function (data, type, row) {
            var dateDesde = new Date(row.horarioDesde);
            if (dateDesde.getUTCHours() < 10)var horaDesde = "0" + dateDesde.getUTCHours();
            else var horaDesde = dateDesde.getUTCHours();
            if(dateDesde.getUTCMinutes() < 10) var minutoDesde = "0" + dateDesde.getUTCMinutes();
            else var minutoDesde = dateDesde.getUTCMinutes();
            return (horaDesde + ":" + minutoDesde);
          }
        },
        {
          'render':
          function (data, type, row) {
            var dateHasta = new Date(row.horarioHasta);
            if (dateHasta.getUTCHours() < 10)var horaHasta = "0" + dateHasta.getUTCHours();
            else var horaHasta = dateHasta.getUTCHours();
            if(dateHasta.getUTCMinutes() < 10) var minutoHasta = "0" + dateHasta.getUTCMinutes();
            else var minutoHasta = dateHasta.getUTCMinutes();
            return (horaHasta + ":" + minutoHasta);
          }
        },
        {
          'render':
          function (data, type, row) {
            var date = new Date(row.fechaArchivado);
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
    positionInferior = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
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

function limpiarFormulario(){
  $('#tituloFormulario').html('Nuevo t&eacute;cnico');
  $('#formularioTecnico').removeClass('was-validated');
  positionSuperior = null;
  positionInferior = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  _idGetUsuario = null;
  limpiarSelect('#selectUsuario');
  $('#dni').val('');
  $('#user').val('');
  $('#telefono').val('');
  $('#provincia').val('');
  $('#localidad').val('');
  $('#direccion').val('');
  $('#cbu').val('');
  $('#serviceNombre').val('');
  $('#horarioDesde').val('');
  $('#horarioHasta').val('');
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').html('Editar t&eacute;cnico');
  $('#formularioTecnico').removeClass('was-validated');
  limpiarSelect('#selectUsuario');
  _id = data_row._id
  _idGetUsuario = data_row.idUser._id;
  $('#dni').val(data_row.dni);
  $('#user').val(data_row.idUser.user);
  $('#telefono').val(data_row.telefono);
  $('#provincia').val(data_row.provincia);
  $('#localidad').val(data_row.localidad);
  $('#direccion').val(data_row.direccion);
  $('#cbu').val(data_row.cbu);
  $('#serviceNombre').val(data_row.serviceNombre);

  var dateDesde = new Date(data_row.horarioDesde);
  var dateHasta = new Date(data_row.horarioHasta);

  if (dateDesde.getUTCHours() < 10)var horaDesde = "0" + dateDesde.getUTCHours();
  else var horaDesde = dateDesde.getUTCHours();
  if(dateDesde.getUTCMinutes() < 10) var minutoDesde = "0" + dateDesde.getUTCMinutes();
  else var minutoDesde = dateDesde.getUTCMinutes();

  if (dateHasta.getUTCHours() < 10)var horaHasta = "0" + dateHasta.getUTCHours();
  else var horaHasta = dateHasta.getUTCHours();
  if(dateHasta.getUTCMinutes() < 10) var minutoHasta = "0" + dateHasta.getUTCMinutes();
  else var minutoHasta = dateHasta.getUTCMinutes();

  $('#horarioDesde').val(horaDesde + ":" + minutoDesde);
  $('#horarioHasta').val(horaHasta + ":" + minutoHasta);
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
  positionSuperior = null;
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
  positionSuperior = null;
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
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getTecnico('#btn_actualizar i', '#span_actualizar');
  getTecnicoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}