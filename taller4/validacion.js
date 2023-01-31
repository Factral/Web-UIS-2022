const contenedor = document.getElementById('contenedor')
const inputs = document.querySelectorAll('#contenedor input')

const expresiones = {
    nombre:/^[a-zA-Z0-9\_\-]{1,25}$/,
    apellido:/^[a-zA-Z0-9\_\-]{1,25}$/,
    direccion:/^(cra|cll|av|anv|trans)(\s)?([a-zA-Z]{0,15}|[0-9]{1,3})(\s)?[a-zA-Z]?(\s)?(Este|Norte|Occidente|Oeste|Sur)?(\s)?([a-zA-Z]{0,15}|[0-9]{1,3})?(\s)?(#(\s)?[0-9]{1,2}(\s)?[a-zA-Z]?(\s)?(Este|Norte|Occidente|Oeste|Sur)?(\s)?(-)?(\s)?(Este|Norte|Occidente|Oeste|Sur)?)?((\s)?[1-9][0-9]{0,3})*$/   ,
    usuario:/\w{10,20}/,
    contraseña:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.#&])[A-Za-z\d@$!%*?&]{10,20}$/im,
    email:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    telefono:/^[0-9]{7,10}$/
}

const validarFormulario = (e) => {
    let id = e.target.id.replace(/[0-9]/g, '')
    validarCampo(expresiones[id], e.target, id)
}

const campos = {
    nombre: false,
    apellido: false,
    documento: false,
    email: false,
    usuario: false,
    contraseña: false,
    direccion: false,
    telefono: false
}

const validarCampo = (expresion, input, campo) => {
    if (expresion.test(input.value)){
        document.getElementById(`grupo_${campo}`).classList.add("validacion_grupo-correcto")
        document.getElementById(`grupo_${campo}`).classList.remove("validacion_grupo-incorrecto")
        document.querySelector(`#grupo_${campo} .fas`).classList.add("fa-check")
        document.querySelector(`#grupo_${campo} .fas`).classList.remove("fa-exclamation-triangle")
        document.getElementById(`grupo_${campo}`).classList.add("ayuda_nombre-correcto")
        document.getElementById(`grupo_${campo}`).classList.remove("ayuda_nombre-incorrecto")
        campos[campo] = true
    } else {
        document.getElementById(`grupo_${campo}`).classList.remove("validacion_grupo-correcto")
        document.getElementById(`grupo_${campo}`).classList.add("validacion_grupo-incorrecto")
        document.querySelector(`#grupo_${campo} .fas`).classList.remove("fa-check")
        document.querySelector(`#grupo_${campo} .fas`).classList.add("fa-exclamation-triangle")
        document.getElementById(`grupo_${campo}`).classList.add("ayuda_nombre-incorrecto")
        document.getElementById(`grupo_${campo}`).classList.remove("ayuda_nombre-correcto")
        campos[campo] = false
    }
} 

function verificar_pass()
{
    var c1 = document.getElementById('contraseña').value
    var c2 = document.getElementById('contraseña1').value

    if (c1 != c2){
        document.getElementById('grupo_confirmar_contraseña').classList.remove("validacion_grupo-correcto")
        document.getElementById('grupo_confirmar_contraseña').classList.add("validacion_grupo-incorrecto")
        document.getElementById('grupo_confirmar_contraseña').classList.add("ayuda_nombre-incorrecto")
        document.getElementById('grupo_confirmar_contraseña').classList.remove("ayuda_nombre-correcto")
        campos['contraseña'] = false

    } else {
        document.getElementById('grupo_confirmar_contraseña').classList.add("validacion_grupo-correcto")
        document.getElementById('grupo_confirmar_contraseña').classList.remove("validacion_grupo-incorrecto")
        document.getElementById('grupo_confirmar_contraseña').classList.add("ayuda_nombre-correcto")
        document.getElementById('grupo_confirmar_contraseña').classList.remove("ayuda_nombre-incorrecto")
        campos['contraseña'] = true
    }
}

inputs.forEach((input) => {
    input.addEventListener('blur', validarFormulario);
});


contenedor.addEventListener('submit', (e)=>{
    e.preventDefault();
});


