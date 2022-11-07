var reg_producto = new Array(), reg_producto_archivado = new Array(), reg_modelo = new Array(), data_row = new Array();
var _id = null, idModelo = null, positionDesarchivadoProducto = null, positionDesarchivadoModelo = null, positionArchivado = null;
var seccionDesarchivado = false;
var seccionArchivado = true;
var myModal;
var myModalModelo;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioProducto'));
  myModalModelo = new bootstrap.Modal($('#divFormularioModelo'));

  $('#btn_nuevo_producto').click(function() {
    limpiarFormulario();
    myModal.show();
  });
  
  $('#btn_editar_producto').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior')){
      pasarValoresAlFormulario();
      myModal.show();
    }
  });

  $('#btn_archivar_producto').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior')){
      abrirAlertaArchivarProducto();
    }
  });

  $('#btn_desarchivar_producto').click(function() {
    if(validarPositionGrilla(positionArchivado, 'Debe seleccionar un registro de la tabla')){
      abrirAlertaDesarchivarProducto();
    }
  });

  $('#btn_nuevo_modelo').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior')){
      limpiarFormularioModelo();
      myModalModelo.show();
    }
  });

  $('#btn_editar_modelo').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior e inferior') && validarPositionGrilla(positionDesarchivadoModelo, 'Debe seleccionar un registro de la tabla superior e inferior')){
      pasarValoresAlFormularioModelo();
      myModalModelo.show();
    }
  });

  $('#btn_archivar_modelo').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior e inferior') && validarPositionGrilla(positionDesarchivadoModelo, 'Debe seleccionar un registro de la tabla superior e inferior')){
      abrirAlertaArchivarModelo();
    }
  });

  $('#btn_desarchivar_modelo').click(function() {
    if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior e inferior') && validarPositionGrilla(positionDesarchivadoModelo, 'Debe seleccionar un registro de la tabla superior e inferior')){
      abrirAlertaDesarchivarModelo();
    }
  });

  $('#btn_actualizar').click(function() {
    getProducto('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioProducto'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          insProducto('#btn_guardar i', '#span_guardar');
        }
        $('#formularioProducto').addClass('was-validated');
      });
  });

  Array.prototype.slice.call($('#formularioModelo'))
    .forEach(function (form) {
      $('#btn_guardar_modelo').click(function() {
        if (form.checkValidity()) {
          insModelo('#btn_guardar_modelo i', '#span_guardar_modelo');
        }
        $('#formularioModelo').addClass('was-validated');
      });
  });

  $('#seccionDesarchivado').click(function() {
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetProducto(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    setTimeout(() => {
      if (seccionArchivado) {
        onGetProductoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function insProducto(i, clase) {
  if(!_id) _ajax.setUrl('../administrativo-producto/insProducto');
  else _ajax.setUrl('../administrativo-producto/updProducto');
  _ajax.go(
    ({
      function_response: onInsProducto,
      i, clase,
      params: ({ _id, descripcion: $('#descripcion').val(), marca: $('#marca').val() })
    })
  );
}

function onInsProducto(data) {
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto(null, null);
}

function insModelo(i, clase) {
  if(!idModelo) _ajax.setUrl('../administrativo-producto/insModelo');
  else _ajax.setUrl('../administrativo-producto/updModelo');
  _ajax.go(
    ({
      function_response: onInsModelo,
      i, clase,
      params: ({ _id, idModelo, modelo: {nombre: $('#modelo').val() }})
    })
  );
}

function onInsModelo(data) {
  myModalModelo.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
}

function getProducto(i, clase) {
  _id = null;
  idModelo = null;
  positionDesarchivadoModelo = null;
  positionDesarchivadoProducto = null;
  _ajax.setUrl('../administrativo-producto/getProducto');
  _ajax.go(
    ({
      function_response: onGetProducto,
      i, clase,
      params: ({})
    })
  );
}

function onGetProducto(data) {
  if(data != false) reg_producto = data.data;
  onGetModelo({modelo:[]});

  var table = $('#tbl_producto').DataTable({
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
    'data': reg_producto,
    'columns': [
        { data: 'marca' },
        { data: 'descripcion' }
    ],
    language: language
  });
  setDatos("#tbl_producto tbody", table);
}

function setDatos(tbody, table) {
  $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    idModelo = null;
    positionDesarchivadoModelo = null;
    positionDesarchivadoProducto = table.row( this ).index();
    $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      _id = data_row._id;
      onGetModelo(data_row);
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionDesarchivadoProducto = table.row( this ).index();
    $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
    $(tbody + ' tr').eq(positionDesarchivadoProducto).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla(positionDesarchivadoProducto, 'Debe seleccionar un registro de la tabla superior.')){
        pasarValoresAlFormulario();
        myModal.show();
      }
    }
  });
}

function onGetModelo(data) {
  var table = $('#tbl_modelo').DataTable({
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
    'data': data.modelo,
    'columns': [
        { data: 'nombre' },
        { 'render':
          function (data, type, row) {
            if(row.fechaArchivado){
              var date = new Date(row.fechaArchivado);
              return convertirFechaHora(row.fechaArchivado);
            } return '';
          }
        }
    ],
    language: language
  });
  setDatosModelo("#tbl_modelo tbody", table);
}

function setDatosModelo(tbody, table) {
  $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionDesarchivadoModelo = table.row( this ).index();
    $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row_modelo = data;
      idModelo = data_row_modelo._id;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    positionDesarchivadoModelo = table.row( this ).index();
    $(tbody + ' tr').css('background-color', 'rgb(220,220,220)');
    $(tbody + ' tr').eq(positionDesarchivadoModelo).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row_modelo = data;
      if(validarPositionGrilla(positionDesarchivadoModelo, 'Debe seleccionar un registro de la tabla inferior')){
        pasarValoresAlFormularioModelo();
        myModalModelo.show();
      }
    }
  });
}

function getProductoArchivado(i, clase) {
  positionArchivado = null;
  _ajax.setUrl('../administrativo-producto/getProductoArchivado');
  _ajax.go(
    ({
      function_response: onGetProductoArchivado,
      i, clase,
      params: ({})
    })
  );
}

function onGetProductoArchivado(data) {
  if(data != false) reg_producto_archivado = data.data;

  var table = $('#tbl_producto_archivado').DataTable({
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
    'data': reg_producto_archivado,
    'columns': [
        { data: 'marca' },
        { data: 'descripcion' },
        { 'render':
          function (data, type, row) {
            var date = new Date(row.fechaArchivado);
            return convertirFechaHora(row.fechaArchivado);
          }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_producto_archivado tbody", table);
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

function validarPositionGrilla(position, mensaje){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', mensaje, 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nuevo producto');
  $('#formularioProducto').removeClass('was-validated');
  positionDesarchivadoProducto = null;
  positionArchivado = null;
  _id = null;
  $('#descripcion').val('');
  $('#marca').val('');
}

function limpiarFormularioModelo(){
  $('#tituloFormularioModelo').text('Nuevo modelo');
  $('#formularioModelo').removeClass('was-validated');
  $('#modelo').val('');
  idModelo = null;
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar producto');
  $('#formularioProducto').removeClass('was-validated');
  _id = data_row._id;
  $('#descripcion').val(data_row.descripcion);
  $('#marca').val(data_row.marca);
}

function pasarValoresAlFormularioModelo(){
  $('#tituloFormularioModelo').text('Editar modelo');
  $('#formularioModelo').removeClass('was-validated');
  $('#modelo').val(data_row_modelo.nombre);
  idModelo = data_row_modelo._id;
}

function abrirAlertaArchivarProducto(){
  Swal.fire({
    title: 'Se archivar&aacute; el producto',
    text: '¿Archivar producto?',
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
          archivarProducto();
          resolve(true);
        }, 100);
      });
    }
  });
}

function archivarProducto(){
  positionDesarchivadoProducto = null;
  _ajax.setUrl('../administrativo-producto/archivarProducto');
  _ajax.go(
    ({
      function_response: onArchivarProducto,
      i: null,
      clase: null,
      params: ({ _id: data_row._id })
    })
  );
}

function onArchivarProducto(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}

function abrirAlertaDesarchivarProducto(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el producto',
    text: '¿Desarchivar producto?',
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
          desarchivarProducto();
          resolve(true);
        }, 100);
      });
    }
  });
}

function desarchivarProducto(){
  positionDesarchivadoProducto = null;
  _ajax.setUrl('../administrativo-producto/desarchivarProducto');
  _ajax.go(
    ({
      function_response: onDesarchivarProducto,
      i: null,
      clase: null,
      params: ({ _id: data_row._id })
    })
  );
}

function onDesarchivarProducto(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}

function abrirAlertaArchivarModelo(){
  Swal.fire({
    title: 'Se archivar&aacute; el modelo',
    text: '¿Archivar modelo?',
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
          archivarModelo();
          resolve(true);
        }, 100);
      });
    }
  });
}

function archivarModelo(){
  positionDesarchivadoProducto = null;
  _ajax.setUrl('../administrativo-producto/archivarModelo');
  _ajax.go(
    ({
      function_response: onArchivarModelo,
      i: null,
      clase: null,
      params: ({ idModelo })
    })
  );
}

function onArchivarModelo(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}

function abrirAlertaDesarchivarModelo(){
  Swal.fire({
    title: 'Se desarchivar&aacute; el modelo',
    text: '¿Desarchivar modelo?',
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
          desarchivarModelo();
          resolve(true);
        }, 100);
      });
    }
  });
}

function desarchivarModelo(){
  positionDesarchivadoProducto = null;
  _ajax.setUrl('../administrativo-producto/desarchivarModelo');
  _ajax.go(
    ({
      function_response: onDesarchivarModelo,
      i: null,
      clase: null,
      params: ({ idModelo })
    })
  );
}

function onDesarchivarModelo(data){
  seccionArchivado = true;
  seccionDesarchivado = true;
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
}