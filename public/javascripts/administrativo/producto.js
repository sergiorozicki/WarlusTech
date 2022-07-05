var _ajax = new Ajax;
var reg_producto, data_row = new Array();
var _id, positionSuperior, positionInferior = null;
var myModal;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioProducto'));

  $('#btn_nuevo_producto').click(function() {
    limpiarFormulario();
    myModal.show();
  });
  
  $('#btn_editar_producto').click(function() {
    if(validarPositionGrillaSuperior()){
      pasarValoresAlFormulario();
      myModal.show();
    }
  });

  $('#btn_archivar_producto').click(function() {
    if(validarPositionGrillaSuperior()){
      abrirAlertaArchivarProducto();
    }
  });

  $('#btn_desarchivar_producto').click(function() {
    if(validarPositionGrillaInferior()){
      abrirAlertaDesarchivarProducto();
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

  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function insProducto(i, clase) {
  if(!_id) _ajax.setUrl('../administrativo-producto/insProducto');
  else _ajax.setUrl('../administrativo-producto/updProducto');
  console.log(_ajax.getUrl());
  _ajax.go(
    ({
      function_response: onInsProducto,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        descripcion: $('#descripcion').val(),
        marca: $('#marca').val(),
        modelo: $('#modelo').val(),
        numeroSerie: $('#numeroSerie').val()
      })
    })
  );
}

function onInsProducto(data) {
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto(null, null);
}

function getProducto(i, clase) {
  positionSuperior = null;
  _ajax.setUrl('../administrativo-producto/getProducto');
  _ajax.go(
    ({
      function_response: onGetProducto,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetProducto(data) {
  reg_producto = data.data;

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
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'descripcion'
        },
        {
          data: 'marca'
        },
        {
          data: 'modelo'
        },
        {
          data: 'numeroSerie'
        }
    ],
    language: language
  });
  setDatos("#tbl_producto tbody", table);
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
        myModal.show();
      }
    }
  });
}

function getProductoArchivado(i, clase) {
  positionInferior = null;
  _ajax.setUrl('../administrativo-producto/getProductoArchivado');
  _ajax.go(
    ({
      function_response: onGetProductoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetProductoArchivado(data) {
  reg_producto = data.data;

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
    'data': reg_producto,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'descripcion'
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
          'render':
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
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla superior.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nuevo producto');
  $('#formularioProducto').removeClass('was-validated');
  positionSuperior = null;
  positionInferior = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  $('#descripcion').val('');
  $('#marca').val('');
  $('#modelo').val('');
  $('#numeroSerie').val('');
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar producto');
  $('#formularioProducto').removeClass('was-validated');
  _id = data_row._id;
  $('#descripcion').val(data_row.descripcion);
  $('#marca').val(data_row.marca);
  $('#modelo').val(data_row.modelo);
  $('#numeroSerie').val(data_row.numeroSerie);
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
        }, 500);
      });
    }
  });
}

function archivarProducto(){
  positionSuperior = null;
  _ajax.setUrl('../administrativo-producto/archivarProducto');
  _ajax.go(
    ({
      function_response: onArchivarProducto,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onArchivarProducto(data){
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
        }, 500);
      });
    }
  });
}

function desarchivarProducto(){
  positionSuperior = null;
  _ajax.setUrl('../administrativo-producto/desarchivarProducto');
  _ajax.go(
    ({
      function_response: onDesarchivarProducto,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDesarchivarProducto(data){
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
  getProductoArchivado('#btn_actualizar_archivado i', '#spam_actualizar_archivado');
}
