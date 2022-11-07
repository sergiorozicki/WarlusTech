function Reclamo(xhr){
    var errors = xhr.responseJSON.text.errors
    var respError = xhr.responseJSON;
    var mensaje = null;
    console.log(errors.marca.message);
    if (errors.descripcion)
        mensaje = errors.descripcion.message + ' '
    if(errors.marca)
        mensaje += errors.marca.message + ' '
    if(errors.modelo)
        mensaje += errors.modelo.message + ' '
    if(errors.numeroSerie)
        mensaje += errors.numeroSerie.message
    alertSinRedireccion(respError.title, mensaje, respError.icon, respError.showConfirmButton, respError.timer);
}

function Tecnico(xhr){
    var errors = xhr.responseJSON.text.errors
    var respError = xhr.responseJSON;
    var mensaje = null;
    console.log(errors.marca.message);
    if (errors.descripcion)
        mensaje = errors.descripcion.message + ' '
    if(errors.marca)
        mensaje += errors.marca.message + ' '
    if(errors.modelo)
        mensaje += errors.modelo.message + ' '
    if(errors.numeroSerie)
        mensaje += errors.numeroSerie.message
    alertSinRedireccion(respError.title, mensaje, respError.icon, respError.showConfirmButton, respError.timer);
}

function Producto(xhr){
    var errors = xhr.responseJSON.text.errors
    var respError = xhr.responseJSON;
    var mensaje = null;
    console.log(errors.marca.message);
    if (errors.descripcion)
        mensaje = errors.descripcion.message + ' '
    if(errors.marca)
        mensaje += errors.marca.message + ' '
    if(errors.modelo)
        mensaje += errors.modelo.message + ' '
    if(errors.numeroSerie)
        mensaje += errors.numeroSerie.message
    alertSinRedireccion(respError.title, mensaje, respError.icon, respError.showConfirmButton, respError.timer);
}

function Usuario(xhr){
    var errors = xhr.responseJSON.text.errors
    var respError = xhr.responseJSON;
    var mensaje = null;
    console.log(errors.marca.message);
    if (errors.descripcion)
        mensaje = errors.descripcion.message + ' '
    if(errors.marca)
        mensaje += errors.marca.message + ' '
    if(errors.modelo)
        mensaje += errors.modelo.message + ' '
    if(errors.numeroSerie)
        mensaje += errors.numeroSerie.message
    alertSinRedireccion(respError.title, mensaje, respError.icon, respError.showConfirmButton, respError.timer);
}