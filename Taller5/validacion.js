const form = document.getElementById('form');
const inputs = document.querySelectorAll("#form input");
const icons = document.querySelectorAll("#form i");
const message = document.querySelectorAll("#form h6");

//Se utilizan algunas expresiones regulares para verificar los campos
const expresiones = {
    usuario: /^[a-zA-Z0-9]{5,12}$/, // El usuario debe tener entre 5 a 12 caracteres solo número y letras
    icon: /^(b|incorrect)/,
    contraseña:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#&])[A-Za-z\d@$!#%*?&]{10,20}$/,
    email:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    message:  /^m/
}

 // Verificar que los campos estén correctos
const campos = {
    nombre: false,
    apellido: false,
    password: false,
    email: false,
    usuario: false,
    vusuario: false,
}
const fechaNacimiento = document.getElementById("fechan");
const edad = document.getElementById("edad");



 // Calcular la edad a partir de la fecha de nacimiento
const calcularEdad = (fechaNacimiento) => {
    const fechaActual = new Date();
    const anoActual = parseInt(fechaActual.getFullYear());
    const mesActual = parseInt(fechaActual.getMonth()) + 1;
    const diaActual = parseInt(fechaActual.getDate());

    // Formato de fecha 2023-01-01 ("yyyy-mm-dd")
    
    const anoNacimiento = parseInt(String(fechaNacimiento).substring(0, 4));
    const mesNacimiento = parseInt(String(fechaNacimiento).substring(5, 7));
    const diaNacimiento = parseInt(String(fechaNacimiento).substring(8, 10));

    let edad = anoActual - anoNacimiento;
    if (mesActual < mesNacimiento) {
        edad--;
    } else if (mesActual === mesNacimiento) {
        if (diaActual < diaNacimiento) {
            edad--;
        }
    }
    return edad;
};

window.addEventListener('load', function () {

    fechaNacimiento.addEventListener('change', function () {
        if (this.value) {
            edad.innerText = ` Tu edad es: ${calcularEdad(this.value)} años`;
        }
    });

});


const validarFormulario = (e) => {
    switch (e.target.name) {
        case "nombre":
            const nombre = document.getElementById('nombre');
            const nombreV = nombre.value.trim();
            if(nombreV.length == 0 ){
                document.getElementById("m1").style.display="block";
                document.getElementById("b1").style.display="none";
                document.getElementById("incorrect1").style.display="block";
                document.getElementById("m2").style.display="none";
                campos.nombre = false;
            }
            else if (nombreV.length > 0 && nombreV.length < 25 ) {
                document.getElementById("m1").style.display="none";
                document.getElementById("b1").style.display="block";
                document.getElementById("m2").style.display="none";
                document.getElementById("incorrect1").style.display="none";
                campos.nombre = true;
            }

            else if (nombreV.length > 25 ) {
                document.getElementById("m1").style.display="none";
                document.getElementById("m2").style.display="block";
                document.getElementById("b1").style.display="none";
                document.getElementById("incorrect1").style.display="block";
                campos.nombre = false;
            }
        break;
        case "apellido":
            const apellido = document.getElementById('apellido');
            const apellidoV = apellido.value.trim();
            if(apellidoV.length == 0 ){
                document.getElementById("m3").style.display="block";
                document.getElementById("b2").style.display="none";
                document.getElementById("incorrect2").style.display="block";
                document.getElementById("m4").style.display="none";
                campos.apellido = false;
            }
            else if (apellidoV.length > 0 && apellidoV.length < 25 ) {
                document.getElementById("m3").style.display="none";
                document.getElementById("b2").style.display="block";
                document.getElementById("m4").style.display="none";
                document.getElementById("incorrect2").style.display="none";
                campos.apellido = true;
            }

            else if (apellidoV.length > 25 ) {
                document.getElementById("m3").style.display="none";
                document.getElementById("m4").style.display="block";
                document.getElementById("b2").style.display="none";
                document.getElementById("incorrect2").style.display="block";
                campos.apellido = false;
            }
        break;

        case "usuario":
            const usuario = document.getElementById('usuario');
            const usuarioV = usuario.value.trim();
            if(expresiones.usuario.test(usuarioV) ){
                document.getElementById("m6").style.display="none";
                document.getElementById("m7").style.display="none";
                document.getElementById("b4").style.display="block";
                document.getElementById("incorrect4").style.display="none";
                campos.usuario = true;
            }

            else if(usuarioV.length == 0 ){
                document.getElementById("m6").style.display="none";
                document.getElementById("m7").style.display="block";
                document.getElementById("b4").style.display="none";
                document.getElementById("incorrect4").style.display="block";
                campos.usuario = false;
            } 
            
            else{
                document.getElementById("m7").style.display="none";
                document.getElementById("m6").style.display="block";
                document.getElementById("b4").style.display="none";
                document.getElementById("incorrect4").style.display="block";
                campos.usuario = false;
            }
        break;

        case "Vusuario": verificar_usuario()
        break;
 
        case "password":
			const password = document.getElementById('password');
            const passwordV = password.value.trim();
			if(expresiones.contraseña.test(passwordV) ){
				document.getElementById("m8").style.display="none";
				document.getElementById("b5").style.display="block";
				document.getElementById("incorrect5").style.display="none";
			}
			
			else{
				document.getElementById("m8").style.display="block";
				document.getElementById("b5").style.display="none";
				document.getElementById("incorrect5").style.display="block";
			}
		break;
        case "password2": verificar_pass()
        break;
        case "email":
            const email = document.getElementById('email');
            const emailV = email.value.trim();
        if(expresiones.email.test(emailV) ){
            document.getElementById("m10").style.display="none";
            document.getElementById("b7").style.display="block";
            document.getElementById("incorrect7").style.display="none";
        }
        
        else{
            document.getElementById("m10").style.display="block";
            document.getElementById("b7").style.display="none";
            document.getElementById("incorrect7").style.display="block";
        };

        break;
        
    }
}

function verificar_pass()
{
   var c1 = document.getElementById('password').value
   var c2 = document.getElementById('password2').value

   if (c1 == c2){
	   document.getElementById("m9").style.display="none";
	   document.getElementById("b6").style.display="block";
	   document.getElementById("incorrect6").style.display="none";
	   campos.password = true;

   } else {
	   document.getElementById("m9").style.display="block";
	   document.getElementById("b6").style.display="none";
	   document.getElementById("incorrect6").style.display="block";
	   campos.password = false;
   }
}


function verificar_usuario()
{
   var u1 = document.getElementById('usuario').value
   var u2 = document.getElementById('Vusuario').value

   if (u1 == u2){
	   document.getElementById("m11").style.display="none";
	   document.getElementById("b41").style.display="block";
	   document.getElementById("incorrect41").style.display="none";
	   campos.vusuario = true;

   } else {
	   document.getElementById("m11").style.display="block";
	   document.getElementById("b41").style.display="none";
	   document.getElementById("incorrect41").style.display="block";
	   campos.vusuario = false;
   }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarFormulario);
    input.addEventListener('blur', validarFormulario);
});

 //Verificación al enviar el formulario

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if(campos.nombre && campos.apellido && campos.ccusuario){
       alert ("Se enviará el formulario") 
    }

    else{
        alert("Por favor complete correctamente los campos")
    }
});


// Ocultar los íconos y los mensajes al presionar el botón "borrar"
form.addEventListener("reset", (e) => {
    icons.forEach((i) => {
        if(expresiones.icon.test(i.id))
        i.style.display="none";
    });

    message.forEach((h6) => {
        if(expresiones.message.test(h6.id))
        h6.style.display="none"
    });
});


function mostrar(){
  document.getElementById("senfermedades").style.display="block"  ;
};

function mostrar1(){
    document.getElementById("enfermedadesc").style.display="block"  ;
  };

function ocultar(){
    document.getElementById("enfermedadesc").style.display="none"  ;
    document.getElementById("senfermedades").style.display="none" ;
};

function ocultar1(){
    document.getElementById("enfermedadesc").style.display="none"  ;
};
  


    
      // Or with jQuery
    
      $(document).ready(function(){
        $('.datepicker').datepicker();
      });

