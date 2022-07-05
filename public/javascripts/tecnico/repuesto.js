var _ajax = new Ajax;
var reg_reclamo, reg_repuesto, data_row = new Array();
var position, _id, idTecnico = null;
var myModal;
var abrirPdf = false;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioRepuesto'));

  $('#btn_solicitar_repuesto').click(function() {
    limpiarFormulario();
    getReclamo('#btn_solicitar_repuesto i', '#span_solicitar_repuesto');
  });
  
  $('#btn_editar_proforma').click(function() {
    if(validarPositionGrilla()){
      pasarValoresAlFormulario();
      getProducto('#btn_editar_proforma i', '#span_editar_proforma');
    }
  });

  $('#btn_actualizar').click(function() {
    getRepuesto('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_actualizar_archivado').click(function() {
    getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  });

  Array.prototype.slice.call($('#formularioRepuesto'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          abrirPdf = false;
          insRepuesto('#btn_guardar i', '#span_guardar');
        }
        $('#formularioRepuesto').addClass('was-validated');
      });
  });

  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
});

function convertirBase64(blob){
  return new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
          // "data:image/jpg;base64,    =sdCXDSAsadsadsa"
      };
  });
}

function reducirImagen(imagenJson){
  return new Promise((resolve, reject) => {
      const $canvas = document.createElement("canvas");
			const imagen = new Image();
			imagen.onload = () => {
				$canvas.width = imagen.width;
				$canvas.height = imagen.height;
				$canvas.getContext("2d").drawImage(imagen, 0, 0);
				$canvas.toBlob(
					(blob) => {
						if (blob === null) reject(blob);
						else resolve(blob);
					},
					"image/jpeg",
					0.15
				);
			};
			imagen.src = URL.createObjectURL(imagenJson);
  });
}

async function comprobarTamanioImagen(imagenJson){
  while (imagenJson.size > 524288) {
     imagenJson = await reducirImagen(imagenJson);
  }
  return imagenJson;
}

async function insRepuesto(i, clase) {
  var fotoRepuesto = await comprobarTamanioImagen($('#fotoRepuesto')[0].files[0]);
  fotoRepuesto = await convertirBase64(fotoRepuesto);
  _ajax.setUrl('../tecnico-repuesto/insRepuesto');
  console.log(_ajax.getUrl());
  _ajax.go(
    ({
      function_response: onInsRepuesto,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        idTecnico: idTecnico,
        idProducto: $('#selectProducto option:selected').val(),
        idReclamo: $('#selectNumeroOrden option:selected').val(),
        repuesto: $('#repuesto').val(),
        observacion: $('#observacion').val(),
        fotoRepuesto: fotoRepuesto
      })
    })
  );
}

function onInsRepuesto(data) {
  console.log(data);
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getRepuesto('#btn_actualizar i', '#span_actualizar');
}

function getReclamo(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-repuesto/getReclamo');
  _ajax.go(
    ({
      function_response: onGetReclamo,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetReclamo(data){
  reg_reclamo = data.data;
  var options = '';
  for (var i = 0; i < reg_reclamo.length; i++) {
    options += '<option value="' + reg_reclamo[i]['_id'] + '">' + reg_reclamo[i]['numeroOrden'] + '</option>';
  }
  $('#selectNumeroOrden').append(options);
  $('#selectNumeroOrden').val(idReclamo);
  getProducto('#btn_solicitar_repuesto i', '#span_solicitar_repuesto');
}

function getProducto(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-repuesto/getProducto');
  _ajax.go(
    ({
      function_response: onGetProducto,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetProducto(data){
  reg_reclamo = data.data;
  var options = '';
  for (var i = 0; i < reg_reclamo.length; i++) {
    options += '<option value="' + reg_reclamo[i]['_id'] + '">' + reg_reclamo[i]['marca']  + ' ' + reg_reclamo[i]['modelo'] + '</option>';
  }
  $('#selectProducto').append(options);
  $('#selectProducto').val(idReclamo);
  myModal.show(); 
}

function getRepuesto(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-repuesto/getRepuesto');
  _ajax.go(
    ({
      function_response: onGetRepuesto,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetRepuesto(data) {
  reg_repuesto = data.data;
  idTecnico = data.idTecnico;

  var table = $('#tbl_repuesto').DataTable({
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
    'data': reg_repuesto,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idReclamo.numeroOrden'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        {
          data: 'idReclamo.idCliente.telefono'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idProducto.marca + ' ' + row.idProducto.modelo);
          }
        },
        {
          data: 'repuesto'
        },
        {
          data: 'observacion'
        }
    ],
    language: language
  });
  setDatos("#tbl_repuesto tbody", table);
}

function setDatos(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    position = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    position = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla()){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function getRepuestoArchivado(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-repuesto/getRepuestoArchivado');
  _ajax.go(
    ({
      function_response: onGetRepuestoArchivado,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetRepuestoArchivado(data) {
  reg_repuesto = data.data;
  idTecnico = data.idTecnico;

  var table = $('#tbl_repuesto_archivado').DataTable({
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
    'data': reg_repuesto,
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idReclamo.numeroOrden'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
          }
        },
        {
          data: 'idReclamo.idCliente.telefono'
        },
        {
          'render':
          function (data, type, row) {
              return (row.idProducto.marca + ' ' + row.idProducto.modelo);
          }
        },
        {
          data: 'repuesto'
        },
        {
          data: 'observacion'
        },
        {
          'render':
            function (data, type, row) {
              return convertirFechaHora(row.fechaArchivado);
            }
        }
    ],
    language: language
  });
  setDatosArchivado("#tbl_repuesto_archivado tbody", table);
}

function setDatosArchivado(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    position = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
    }
  });
  $(tbody).on('dblclick', 'td', function() {
    position = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $('tbody tr').eq(position).css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) {
      data_row = data;
      if(validarPositionGrilla()){
        pasarValoresAlFormulario();
        getProducto('#btn_editar_proforma i', '#span_editar_proforma');
      }
    }
  });
}

function convertirFechaHora(data){
  return (data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18]);
}

function validarPositionGrilla(){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  
  position = null;
  idReclamo = null;
  
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  limpiarSelect('#selectNumeroOrden');
  limpiarSelect('#selectProducto');
  $('#repuesto').val('');
  $('#observacion').val('');
  $('#selectNumeroOrden').val('');
  $('#selectRepuesto').val('');
  $('#fotoRepuesto').val('');
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  limpiarSelect('#selectProducto')
  functionBack = 'updProforma';
  _id = data_row._id;
  $('#observacion').val(data_row.observacion);
}

function abrirAlertaEliminarProducto(){
  Swal.fire({
    title: 'Se eliminar&aacute; el producto',
    text: '¿Eliminar producto?',
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
          //eliminarProducto();
          resolve(true);
        }, 500);
      });
    }
  });
}

function eliminarProducto(){
  position = null;
  _ajax.setUrl('../producto/delProducto');
  _ajax.go(
    ({
      function_response: onDelProducto,
      i: null,
      clase: null,
      params: ({
        _id: data_row._id
      })
    })
  );
}

function onDelProducto(data){
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProducto('#btn_actualizar i', '#span_actualizar');
}
