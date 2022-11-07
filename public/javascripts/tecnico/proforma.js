var reg_producto = new Array(), reg_proforma = new Array(), data_row = new Array();
var position = null, _id = null, idTecnico = null, idProducto = null, apellido = null, nombre = null, dni = null, telefono = null, observacion = null, email = null, direccion = null;
var functionBack = 'insProforma';
var myModal;
var myModalAsignarLogo;
var abrirPdf = false;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioProforma'));
  myModalAsignarLogo = new bootstrap.Modal($('#divFormularioAsignarLogo'));

  $('#btn_nueva_proforma').click(function() {
    limpiarFormulario();
    getProducto('#btn_nueva_proforma i', '#span_nueva_proforma');
  });
  
  $('#btn_editar_proforma').click(function() {
    if(validarPositionGrilla()){
      pasarValoresAlFormulario();
      getProducto('#btn_editar_proforma i', '#span_editar_proforma');
    }
  });

  $('#btn_generar_pdf').click(function() {
    if(validarPositionGrilla()){
      observacion = data_row.observacion;
      apellido = data_row.idCliente.apellido;
      nombre = data_row.idCliente.nombre;
      dni = data_row.idCliente.dni;
      telefono = data_row.idCliente.telefono;
      email = data_row.idCliente.email;
      direccion = data_row.idCliente.direccion;
      generarPdf();
    }
  });

  $('#btn_actualizar').click(function() {
    getProforma('#btn_actualizar i', '#span_actualizar');
  });

  $('#btn_asignar_logo').click(function() {
    limpiarFomularioAsignarLogo();
    myModalAsignarLogo.show();
  });

  Array.prototype.slice.call($('#formularioAsignarLogo'))
    .forEach(function (form) {
      $('#btn_guardar_asignar_logo').click(function() {
        if (form.checkValidity()) {
          if (validarExtensionArchivo()) {
            showSpinner('#btn_guardar_asignar_logo i', '#span_guardar_asignar_logo');
            insLogo('#btn_guardar_asignar_logo i', '#span_guardar_asignar_logo');
          }
        }
        $('#formularioAsignarLogo').addClass('was-validated');
      });
  });

  Array.prototype.slice.call($('#formularioProforma'))
    .forEach(function (form) {
      $('#btn_guardar').click(function() {
        if (form.checkValidity()) {
          abrirPdf = false;
          insProforma('#btn_guardar i', '#span_guardar');
        }
        $('#formularioProforma').addClass('was-validated');
      });
      $('#btn_guardar_generar_pdf').click(function() {
        if (form.checkValidity()) {
          abrirPdf = true;
          observacion = $('#observacion').val();
          insProforma('#btn_guardar i', '#span_guardar');
        }
        $('#formularioProforma').addClass('was-validated');
      });
  });

  $('#dni').keyup(function(e) {
    if ($('#dni').val() != '' || e.keyCode == 8) getCliente();
  });
  
  $("#selectProducto").change(function(){
	  cargarSelectModelos();
	});

  getProforma('#btn_actualizar i', '#span_actualizar');
});

function generarPdf(){
  var doc = new window.jspdf.jsPDF();

  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE “" + data_row.idTecnico.nombreServicio + "”", 60, 55);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text('Al servicio de IES', 150, 42);

  var url = '';
  if(UrlExists()) url = '/images/logoTecnico/'+ idTecnico +'.png';
  else url = '/images/logoTecnico/default.png';

  doc.addImage(url, "PNG", 30, 20, 25, 20);

  doc.line(10, 60, docWidth - 10, 60);

  doc.setFont("helvetica", "bold");
  doc.text('Cliente: ' + apellido + ', ' + nombre, 12, 70);
  doc.text('DNI-CUIT-CUIL: ' + dni, 12, 80);
  doc.text('Tel/Cel: ' + telefono, 12, 90);
  doc.text('Email: ' + email, 90, 90);
  doc.text('Direción: ' + direccion, 12, 100);
  doc.text('Depto: ', 90, 100);
  doc.text('Piso: ', 140, 100);
  doc.text('N°: ', 170, 100);

  doc.line(10, 110, docWidth - 10, 110);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(observacion, 12, 120);

  doc.line(10, docHeight - 60, docWidth - 10, docHeight - 60);

  doc.text('..............................................', 15, docHeight - 45);
  doc.text('Firma y aclaración del cliente', 15, docHeight - 35);
  doc.text('...............................................', 110, docHeight - 45);
  doc.text('Firma y aclaración del técnico', 110, docHeight - 35);

  doc.setFontSize(11)
  doc.text(`Técnico: ${data_row.idTecnico.apellido + ' ' + data_row.idTecnico.nombre}`, 15, docHeight - 20);
  doc.text(`${data_row.idTecnico.nombreServicio}`, 110, docHeight - 20);
  doc.text(`${data_row.idTecnico.dni}`, 150, docHeight - 20);
  window.open(doc.output('bloburl'), "Proforma pdf");
}

function UrlExists(){
  var url = '/images/logoTecnico/'+ idTecnico +'.png';
  var http = new XMLHttpRequest(); 
  http.open('HEAD', url, false); 
  http.send(); 
  return http.status != 404;
}

function cargarSelectModelos(){
  limpiarSelect('#selectModelo');
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) {
    if($('#selectProducto option:selected').val() == reg_producto[i]._id){
      for (let j = 0; j < reg_producto[i].modelo.length; j++) {
        options += '<option value="' + reg_producto[i].modelo[j]._id + '">' + reg_producto[i].modelo[j].nombre +'</option>';
      }
    }
  }
  $('#selectModelo').append(options);
}

function getCliente() {
  _ajax.setUrl('../tecnico-proforma/getCliente');
  _ajax.go(
    ({
      function_response: onGetCliente,
      params: ({
        dni: $('#dni').val()
      })
    })
  );
}

function onGetCliente(data) {
  if (data.data.length != 0) {
    $('#nombre').val(data.data[0].nombre);
    $('#apellido').val(data.data[0].apellido);
    $('#telefono').val(data.data[0].telefono);
    $('#email').val(data.data[0].email);
    $('#direccion').val(data.data[0].direccion);
    $('#localidad').val(data.data[0].localidad);
    $('#codigoPostal').val(data.data[0].codigoPostal);
  }else limpiarCamposCliente();
}

function validarExtensionArchivo(){
  var extenciones = /(.jpg|.jpeg|.png)$/i;
  if(!extenciones.exec($('#logo').val())){
    alertSinRedireccion('¡Ups!', 'Los archivos deben ser tipo imagen.', 'info', true, false);
    $('#logo').val('');
    return false;
  }
  return true;
}

function convertirBase64(blob){
  return new Promise((resolve, reject) =>{
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
  while (imagenJson.size > 524288) {
     imagenJson = await reducirImagen(imagenJson);
  }
  return imagenJson;
}

async function insLogo(i, clase) {
  var logo = await comprobarTamanioImagen($('#logo')[0].files[0]);
  logo = await convertirBase64(logo);
  _ajax.setUrl('../tecnico-proforma/insLogo');
  _ajax.go(
    ({
      function_response: onInsLogo,
      i: i,
      clase: clase,
      params: ({
        logo: logo
      })
    })
  );
}

function onInsLogo(data) {
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  myModalAsignarLogo.hide();
}

function limpiarCamposCliente(){
  $('#formularioProforma').removeClass('was-validated');
  $('#nombre').val('');
  $('#apellido').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
}

function limpiarFomularioAsignarLogo(){
  $('#formularioAsignarLogo').removeClass('was-validated');
  $('#logo').val('');
}

function insProforma(i, clase) {
  _ajax.setUrl('../tecnico-proforma/insOrUpdCliente');
  _ajax.go(
    ({
      function_response: onInsProforma,
      i: i,
      clase: clase,
      params: ({
        functionBack: functionBack,
        _id: _id,
        nombre: $('#nombre').val(),
        apellido: $('#apellido').val(),
        dni: $('#dni').val(),
        telefono: $('#telefono').val(),
        email: $('#email').val(),
        direccion: $('#direccion').val(),
        localidad: $('#localidad').val(),
        codigoPostal: $('#codigoPostal').val(),
        idTecnico: idTecnico,
        idProducto: $('#selectProducto option:selected').val(),
        idModelo: $('#selectModelo option:selected').val(),
        observacion: $('#observacion').val()
      })
    })
  );
}

function onInsProforma(data) {
  myModal.hide();
  alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer);
  getProforma('#btn_actualizar i', '#span_actualizar');
  if(abrirPdf) {
    observacion = $('#observacion').val();
    apellido = $('#apellido').val();
    nombre = $('#nombre').val();
    dni = $('#dni').val();
    telefono = $('#telefono').val();
    email = $('#email').val();
    direccion = $('#direccion').val();
    generarPdf();
  }
}

function getProducto(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-proforma/getProducto');
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
  reg_producto = data.data;
  var options = '';
  for (var i = 0; i < reg_producto.length; i++) {
    options += '<option value="' + reg_producto[i]['_id'] + '">' + reg_producto[i]['descripcion'] + ' '+ reg_producto[i]['marca'] + '</option>';
  }
  $('#selectProducto').append(options);
  $('#selectProducto').val(idProducto);
  if(idProducto != null){ cargarSelectModelos(); $('#selectModelo').val(data_row.idModelo); }
  myModal.show(); 
}

function getProforma(i, clase) {
  position = null;
  _ajax.setUrl('../tecnico-proforma/getProforma');
  _ajax.go(
    ({
      function_response: onGetProforma,
      i: i,
      clase: clase,
      params: ({})
    })
  );
}

function onGetProforma(data) {
  reg_proforma = data.data;
  idTecnico = data.idTecnico;

  var table = $('#tbl_proforma').DataTable({
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
    'data': reg_proforma,
    'columns': [
        { data: 'idCliente.nombre' },
        { data: 'idProducto.marca' },
        { 'render':
          function (data, type, row) {
            for (let i = 0; i < row.idProducto.modelo.length; i++) if(row.idProducto.modelo[i]._id == row.idModelo) return (row.idProducto.modelo[i].nombre);
            return ('');
          }
        },
        { data: 'observacion' }
    ],
    language: language
  });
  setDatos("#tbl_proforma tbody", table);
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

function validarPositionGrilla(){
  if(position != null){
    return true;
  }
  alertSinRedireccion('¡Ups!', 'Debe seleccionar un registro de la tabla.', 'warning', true, false);
  return false;
}

function limpiarFormulario(){
  $('#tituloFormulario').text('Nueva proforma');
  $('#formularioProforma').removeClass('was-validated');
  position = null;
  idProducto = null;
  limpiarSelect('#selectProducto');
  limpiarSelect('#selectModelo');
  $('tbody tr').css('background-color', 'rgb(220,220,220)');
  _id = null;
  functionBack = 'insProforma';
  $('#descripcion').val('');
  $('#marca').val('');
  $('#modelo').val('');
  $('#numeroSerie').val('');
  $('#dni').val('');
  $('#nombre').val('');
  $('#apellido').val('');
  $('#telefono').val('');
  $('#email').val('');
  $('#direccion').val('');
  $('#localidad').val('');
  $('#codigoPostal').val('');
  $('#observacion').val('');
  $('#selectProducto').val('');
  $('#selectModelo').val('');
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar proforma');
  $('#formularioProducto').removeClass('was-validated');
  limpiarSelect('#selectProducto')
  limpiarSelect('#selectModelo')
  functionBack = 'updProforma';
  _id = data_row._id;
  idProducto = data_row.idProducto._id;
  $('#dni').val(data_row.idCliente.dni);
  $('#nombre').val(data_row.idCliente.nombre);
  $('#apellido').val(data_row.idCliente.apellido);
  $('#telefono').val(data_row.idCliente.telefono);
  $('#email').val(data_row.idCliente.email);
  $('#direccion').val(data_row.idCliente.direccion);
  $('#localidad').val(data_row.idCliente.localidad);
  $('#codigoPostal').val(data_row.idCliente.codigoPostal);
  $('#descripcion').val(data_row.descripcion);
  $('#marca').val(data_row.marca);
  $('#modelo').val(data_row.modelo);
  $('#numeroSerie').val(data_row.numeroSerie);
  $('#observacion').val(data_row.observacion);
}