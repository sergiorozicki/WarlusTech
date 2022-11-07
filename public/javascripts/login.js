$(function() {
  $('#login-button').click(function(){
    $('#login-button').fadeOut("slow",function(){
      $("#container").fadeIn();
    });
  });
  
  $(".close-btn").click(function(){
    $("#container, #forgotten-container").fadeOut(800, function(){
      $("#login-button").fadeIn(800);
    });
  });
  
  $('#forgotten').click(function(){
    $("#container").fadeOut(function(){
      $("#forgotten-container").fadeIn();
    });
  });

  $("#btn_login").click(function(){
    login('', '');
  });

  $("#btn_recuperar").click(function(){
    enviarEmail('', '');
  });

  $("#btn_cambiar").click(function(){
    cambiarPassword('', '');
  });

  $("#password").keyup(function(e){
    if(e.keyCode == 13) login('', '');
  });

  $("#passwordConfirmar").keyup(function(e){
    if(e.keyCode == 13) cambiarPassword('', '');
  });
});

function login(i, clase) {
  _ajax.setUrl('./login');
  _ajax.go(
    ({
      function_response: onLogin,
      i: i,
      clase: clase,
      params: ({ user: $('#user').val(), password: $('#password').val() })
    })
  );
}

function onLogin(data) { window.location = data.ruta; }

function enviarEmail(i, clase) {
  const dominio = document.URL.split('login')[0];
  _ajax.setUrl('./enviarEmail');
  _ajax.go(
    ({
      function_response: onEnviarEmail,
      i: i,
      clase: clase,
      params: ({ dominio, email: $('#email').val() })
    })
  );
}

function onEnviarEmail(data) { alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer); }

function cambiarPassword(i, clase) {
  const token = document.URL.split('/')[4];
  _ajax.setUrl('../cambiarPassword');
  _ajax.go(
    ({
      function_response: onCambiarPassword,
      i: i,
      clase: clase,
      params: ({ token, password: $('#password').val(), passwordConfirmar: $('#passwordConfirmar').val() })
    })
  );
}

function onCambiarPassword(data) { alertSinRedireccion(data.title, data.text, data.icon, data.showConfirmButton, data.timer); $('#password').val(''); $('#passwordConfirmar').val('') }