var reg_reclamo = new Array(), reg_repuesto = new Array(), reg_repuesto_archivado = new Array(), data_row = new Array();
var positionArchivado = null, positionDesarchivado = null, _id = null, idTecnico = null, idReclamo = null;
var seccionDesarchivado = false;
var seccionArchivado = true;
var myModal, myModalPresentacionFotos;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioRepuesto'));
  myModalPresentacionFotos = new bootstrap.Modal($('#divPresentacionFotos'));

  $('#btn_solicitar_repuesto').click(function() {
    limpiarFormulario();
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
          insRepuesto('#btn_guardar i', '#span_guardar');
        }
        $('#formularioRepuesto').addClass('was-validated');
      });
  });

  $('#seccionDesarchivado').click(function() {
    setTimeout(() => {
      if(seccionDesarchivado) {
        onGetRepuesto(false);
        seccionDesarchivado = false;
      }
    }, 250);
  });

  $('#seccionArchivado').click(function() {
    setTimeout(() => {
      if (seccionArchivado) {
        onGetRepuestoArchivado(false);
        seccionArchivado = false;
      }
    }, 250);
  });

  $('#selectNumeroOrden').change(function() {
    pasaProductoModeloInput();
  });

  $('#btn_ver_foto_repuesto_desarchivado').click(function() {
    if(validarPositionGrilla(positionDesarchivado)) getFoto('#btn_ver_foto_repuesto_desarchivado i', '#span_ver_foto_repuesto_desarchivado');
  });

  $('#btn_ver_foto_repuesto_archivado').click(function() {
    if(validarPositionGrilla(positionArchivado)) getFoto('#btn_ver_foto_repuesto_archivado i', '#span_ver_foto_repuesto_archivado');
  });

  $('#btn_descargar_presentacion_foto_repuesto').click(function() {
    descargarFoto();
  });

  getRepuesto('#btn_actualizar i', '#span_actualizar');
  getRepuestoArchivado('#btn_actualizar_archivado i', '#span_actualizar_archivado');
  getReclamo('#btn_solicitar_repuesto i', '#span_solicitar_repuesto');
});

function getFoto(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-repuesto/getFoto');
  _ajax.go(
    ({
      function_response: onGetFoto,
      i: i,
      clase: clase,
      params: ({ _id: data_row._id })
    })
  );
}

function onGetFoto(data) {
  $('#presentacionFotoRepuesto').attr('src', 'data:image/png;base64,' + data.data.fotoRepuesto);
  myModalPresentacionFotos.show();
}

function descargarFoto() {
  window.location = '../tecnico-repuesto/downloadFoto?_id=' + data_row._id;
}

function pasaProductoModeloInput(){
  for (let i = 0; i < reg_reclamo.length; i++)
    if(reg_reclamo[i]._id == $('#selectNumeroOrden option:selected').val()){
      $('#producto').val(reg_reclamo[i].idProducto.marca);
      for (let j = 0; j < reg_reclamo[i].idProducto.modelo.length; j++)
        if(reg_reclamo[i].idProducto.modelo[j]._id == reg_reclamo[i].idModelo)
          $('#modelo').val(reg_reclamo[i].idProducto.modelo[j].nombre);
    }
}

function convertirBase64(blob){
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
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
  while (imagenJson.size > 1572864) imagenJson = await reducirImagen(imagenJson);
  return imagenJson;
}

async function insRepuesto(i, clase) {
  var fotoRepuesto = await comprobarTamanioImagen($('#fotoRepuesto')[0].files[0]);
  fotoRepuesto = await convertirBase64(fotoRepuesto);
  _ajax.setUrl('../tecnico-repuesto/insRepuesto');
  _ajax.go(
    ({
      function_response: onInsRepuesto,
      i: i,
      clase: clase,
      params: ({
        _id: _id,
        idTecnico: idTecnico,
        idReclamo: $('#selectNumeroOrden option:selected').val(),
        repuesto: $('#repuesto').val(),
        observacion: $('#observacion').val(),
        fotoRepuesto: fotoRepuesto
      })
    })
  );
}

function onInsRepuesto(data) {
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
  if(data != false) {
    reg_repuesto = data.data;
    idTecnico = data.idTecnico;
  }
  

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
    'columns': [
      { data: 'idReclamo.numeroOrden' },
      { 'render':
        function (data, type, row) {
            return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
        }
      },
      { data: 'idReclamo.idCliente.telefono' },
      { data: 'idReclamo.idProducto.marca' },
      { 'render':
        function (data, type, row) {
          for (let i = 0; i < row.idReclamo.idProducto.modelo.length; i++) if(row.idReclamo.idProducto.modelo[i]._id == row.idReclamo.idModelo) return (row.idReclamo.idProducto.modelo[i].nombre);
          return ('');
        }
      },
      { data: 'repuesto' },
      { data: 'observacion' }
    ],
    language: language
  });
  setDatos("#tbl_repuesto tbody", table);
}

function setDatos(tbody, table) {
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $(tbody).on('click', 'td', function() {
    positionDesarchivado = table.row( this ).index();
    $('tbody tr').css('background-color', 'rgb(220,220,220)');
    $(this).parents('tr').css('background-color', 'rgb(180,180,180)');
    var data = table.row($(this).parents('tr')).data();
    if (data != undefined) data_row = data;
  });
}

function getRepuestoArchivado(i, clase) {
  positionArchivado = null;
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
  if(data != false) {
    reg_repuesto_archivado = data.data;
    idTecnico = data.idTecnico;
  }

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
    'data': reg_repuesto_archivado,
    'columns': [
      { data: 'idReclamo.numeroOrden' },
      { 'render':
        function (data, type, row) {
            return (row.idReclamo.idCliente.apellido + ' ' + row.idReclamo.idCliente.nombre);
        }
      },
      { data: 'idReclamo.idCliente.telefono' },
      { data: 'idReclamo.idProducto.marca' },
      { 'render':
        function (data, type, row) {
          for (let i = 0; i < row.idReclamo.idProducto.modelo.length; i++) if(row.idReclamo.idProducto.modelo[i]._id == row.idModelo) return (row.idReclamo.idProducto.modelo[i].nombre);
          return ('');
        }
      },
      { data: 'repuesto' },
      { data: 'observacion' },
        { 'render':
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
  if(position != null) return true;
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  _id = null;
  positionArchivado = null;
  positionDesarchivado = null;
  idReclamo = null;
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  $('#selectNumeroOrden').val('');
  $('#repuesto').val('');
  $('#modelo').val('');
  $('#observacion').val('');
  $('#fotoRepuesto').val('');
  myModal.show();
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar solicitud');
  $('#formularioRepuesto').removeClass('was-validated');
  _id = data_row._id;
  $('#observacion').val(data_row.observacion);
}