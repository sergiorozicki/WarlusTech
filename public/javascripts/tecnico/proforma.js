var _ajax = new Ajax;
var reg_producto, reg_proforma, data_row = new Array();
var position, _id, idTecnico, idProducto = null;
var apellido, nombre, dni, telefono, observacion, email, direccion = null;
var functionBack = 'insProforma';
var myModal;
var abrirPdf = false;

$(function() {
  myModal = new bootstrap.Modal($('#divFormularioProforma'));

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
    console.log($('#dni').val());
    if ($('#dni').val() != '' || e.keyCode == 8) getCliente();
  });

  getProforma('#btn_actualizar i', '#span_actualizar');
});

function generarPdf(){
  var doc = new window.jspdf.jsPDF();

  const docWidth = doc.internal.pageSize.getWidth();
  const docHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE “LA MORSA”", 60, 55);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text('Al servicio de IES', 150, 42);

  doc.addImage('/images/logoPDF.png', "PNG", 30, 20, 25, 20);

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
  doc.text('Técnico: Herrera Carlos Javier', 15, docHeight - 20);
  doc.text('LA MORZA', 110, docHeight - 20);
  doc.text('3764814854', 150, docHeight - 20);
  window.open(doc.output('bloburl'), "Proforma pdf");
}

function getCliente() {
  _ajax.setUrl('../tecnico-proforma/getCliente');
  console.log(_ajax.getUrl())
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
  console.log(data);
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

function insProforma(i, clase) {
  _ajax.setUrl('../tecnico-proforma/insOrUpdCliente');
  console.log(_ajax.getUrl());
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
        observacion: $('#observacion').val()
      })
    })
  );
}

function onInsProforma(data) {
  console.log(data);
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
    options += '<option value="' + reg_producto[i]['_id'] + '">' + reg_producto[i]['descripcion'] + ' '+ reg_producto[i]['marca'] + ' ' + reg_producto[i]['modelo'] + ' ' + reg_producto[i]['numeroSerie'] +'</option>';
  }
  $('#selectProducto').append(options);
  $('#selectProducto').val(idProducto);
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
    'columns': [{
          data: '_id',
          visible: false
        },
        {
          data: 'idCliente.nombre'
        },
        {
          data: 'idProducto.descripcion'
        },
        {
          data: 'observacion'
        }
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
}

function pasarValoresAlFormulario(){
  $('#tituloFormulario').text('Editar proforma');
  $('#formularioProducto').removeClass('was-validated');
  limpiarSelect('#selectProducto')
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
