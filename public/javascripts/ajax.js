function Ajax() {
  var url = '';
  var action = '';
  var data_response = new Array();
  var type = 'POST';
  var contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
  var processData = true;

  this.setUrl = function setUrl(_url) {
    url = _url;
  }
  this.getUrl = function getUrl() {
    return url;
  }

  this.setAction = function setAction(_action) {
    action = _action;
  }
  this.getAction = function getAction() {
    return action;
  }

  this.setDataResponse = function setDataResponse(_data_response) {
    data_response.propt = _data_response;
  }
  this.getDataResponse = function getDataResponse(propt) {
    return data_response[propt];
  }

  this.setType = function setType(_type) {
    type = _type;
  }
  this.getType = function getType() {
    return type;
  }

  this.setContentType = function setContentType(_contentType) {
    contentType = _contentType;
  }
  this.getContentType = function getContentType() {
    return contentType;
  }

  this.setProcessData = function setProcessData(_processData) {
    processData = _processData;
  }
  this.getProcessData = function getProcessData() {
    return processData;
  }

  this.go = function go(obj) {
    $('.loading').show();
    console.log(obj);
    if (obj.i != null && obj.clase != null) {
      showSpinner(obj.i, obj.clase);
    }
    $.ajax({
      url: url,
      type: type,
      data: obj.params,
      context: document.body,
      contentType: contentType,
      processData: processData,
      success: function(data) {
        console.log(data);
        $('.loading').hide();
        if(!data.session) alertConRedireccion('Sesión expirada.', 'Inicie sesión nuevamente para poder continuar.', 'warning', false, 3000, '/');
        if (typeof obj.function_response == 'function') {
          hideSpinner(obj.i, obj.clase);
          obj.function_response(data);
        }
      },
      error: function(xhr, status) {
        $('.loading').hide();
        if (xhr.status == 404) {
          var respError = xhr.responseJSON;
          console.log('erro1');
          console.log(xhr);
          console.log(status);
          hideSpinner(obj.i, obj.clase);
          var functionError = xhr.responseJSON.text._message.split(' ')[0];
          eval(functionError)(xhr);
        }else if (xhr.status == 500) {
          var respError = xhr.responseJSON;
          console.log('erro2');
          console.log(xhr);
          console.log(status);
          hideSpinner(obj.i, obj.clase);
          var errores;
          //for (let i = 0; i < respError.text.errors.length; i++) {
           // errores += respError.text.errors[i]['']
          //}
          alertSinRedireccion(respError.title, respError.text, respError.icon, respError.showConfirmButton, respError.timer);
        }else if (xhr.status == 400) {
          var respError = xhr.responseJSON;
          console.log('erro3');
          console.log(xhr);
          console.log(status);
          hideSpinner(obj.i, obj.clase);
          var errores;
          alertSinRedireccion(respError.title, respError.text, respError.icon, respError.showConfirmButton, respError.timer);
        }
      }/*,
      complete: function(xhr, status) {
        if (status == 'error') {
            var respError = xhr.responseJSON;
            console.log('erro3');
            console.log(xhr);
            console.log(status);
            hideSpinner(obj.i, obj.clase);
            alertSinRedireccion(respError.title, respError.text, respError.icon, respError.showConfirmButton, respError.timer);
        }
      }*/
    });
  }

}