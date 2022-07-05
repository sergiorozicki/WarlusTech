function alertSinRedireccion(title, text, icon, showConfirmButton, timer){
    Swal.fire({
        title: title,
        text: text,
        icon: icon ,
        showConfirmButton: showConfirmButton,
        timer: timer,
        customClass: {popup: 'form-swal'}
    });
}

function alertConRedireccion(title, text, icon, showConfirmButton, timer, ruta){
    Swal.fire({
        title: title,
        text: text,
        icon: icon ,
        showConfirmButton: showConfirmButton,
        timer: timer,
        customClass: {popup: 'form-swal'}
    }).then(()=>{
        window.location = ruta
    });
}

function showSpinner(i, clase){
    $(i).hide();
    $(clase).removeClass('visually-hidden');
    if (!$('.load').length > 0) $('body').append('<div class="load"></div>');
    $('.load').show();
}

function hideSpinner(i, clase){
    $(i).show();
    $(clase).addClass('visually-hidden');
    $('.load').hide();
}

function limpiarSelect(_id) {
    $(_id + ' option').each(function() {
      $(_id + ' option').eq(1).remove();
    });
}

var language = {
    "sProcessing": "Procesando...",
    "sLengthMenu": "Mostrar _MENU_ registros",
    "sZeroRecords": "No se encontraron resultados",
    "sEmptyTable": "Ningún dato disponible en esta tabla",
    "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
    "sInfoPostFix": "",
    "sSearch": "Buscar:",
    "sUrl": "",
    "sInfoThousands": ",",
    "sLoadingRecords": "Cargando...",
    "oPaginate": {
      "sFirst": "Primero",
      "sLast": "Último",
      "sNext": "Siguiente",
      "sPrevious": "Anterior"
    },
    "oAria": {
      "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
      "sSortDescending": ": Activar para ordenar la columna de manera descendente"
    }
};