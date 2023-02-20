import {React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode  from 'jwt-decode'
import "./Login.css"
import axios from 'axios'; 
import config from '../../../utils/Config.js';
import Spinner from 'react-bootstrap/Spinner';



const Login = () => {
    const MY_SERVER = config.todosUrl
    const [email, setEmail] = useState(localStorage.getItem('email'))
    const [name, setName] = useState(localStorage.getItem('name'))
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [loginWindow, setLoginWindow] = useState(true) 
    const [errMsg, setErrMsg] = useState("") 
    let navigate = useNavigate();
    
    useEffect(()=>{
        // console.log(localStorage.getItem('token')|| "No token")
        let token = localStorage.getItem('my-user-token')
        let decoded = (token)? jwt_decode(token):""
        // console.log(token)
        if ( token && Date.now() <= (decoded?.exp * 1000)) {
            console.log('valid token')
            navigate('/todo')    
        }
        if (password){
            setTimeout(()=>{
                setPassword("")
            },200)
        }
    },[loginWindow]);
   
    useEffect(()=>{
        if (localStorage.getItem('email') !== email){
            localStorage.setItem('email',email)
            // console.log("Changed Email")
            
        }
        if (localStorage.getItem('name') !== name){
            localStorage.setItem('name',name)
            // console.log("Changed Name")
        }
    },[email,name]);

    const errorHandler = (err)=>{
        if (err?.response?.data){
            setErrMsg(err.response.data)
        }
        else{
            setErrMsg("Could not connect to the server")
        }
        setTimeout(()=>{
            setErrMsg('')
        },6000)
    }

    const submitLogin = async (e) => {
        setLoading(true)
        e.preventDefault();
        await axios.post(config.loginUrl, {email, password})
        .then((response)=>{
            // console.log(response.data.token)
            localStorage.setItem('my-user-token',response.data.token)
            localStorage.setItem('email',"")
            localStorage.setItem('name',"")
            navigate('/todo')
            setEmail('')
            setPassword('')
            setName('')
            setErrMsg('')
        })
        .catch(err =>{
            errorHandler(err)
            })

        setLoading(false)
    }

    const submitSignup = async (e) => {
        setLoading(true)
        e.preventDefault();
        await axios.post(config.registerUrl, {name, email, password})
        .then((response)=>{
            // console.log(response.data.token)
            localStorage.setItem('my-user-token',response.data.token)
            localStorage.setItem('email',"")
            localStorage.setItem('name',"")
            navigate('/todo')
            setEmail('')
            setPassword('')
            setName('')
            setErrMsg('')
        })
        .catch(err =>{
            errorHandler(err)
        })
        setLoading(false) 
    }
  return (
    <section className='Login'>
	<div className="section">
		<div className="container">
			<div className="row full-height justify-content-center">
				<div className="col-12 text-center align-self-center py-5">
					<div className="section pb-5 pt-5 pt-sm-2 text-center">

						<h6 className="mb-0 pb-3"><span>Inicar sesion</span><span>Registrarse</span></h6>
			          	<input className="checkbox" onChange={()=> {setLoginWindow(!loginWindow)}} type="checkbox" id="reg-log" name="reg-log"/>
			          	<label htmlFor="reg-log"></label>
						<div className="card-3d-wrap mx-auto">
							<div className="card-3d-wrapper">
								<div className="card-front">
                                    {loading && <Spinner className='Spinner' animation="grow" variant="info" size="sm" />}
									<div className="center-wrap">
                                        <form onSubmit={submitLogin}>
                                        {errMsg && <span id="errMsg" className='px-3 py-2  start-50 translate-middle bg-danger '>{errMsg}</span>}
										<div className="section text-center">
											<h4 className="mb-4 pb-3">Inicio de sesion</h4>
											<div className="form-group">
												<input type="email" name="logemail" onChange={(e)=> setEmail(e.target.value)} value={email||""} className="form-control" placeholder="Correo" id="logemail1" autoComplete="off" required/>
												<i className="input-icon bi bi-at"></i>
											</div>	
											<div className="form-group mt-2">
												<input type="password" name="logpass" onChange={(e)=> setPassword(e.target.value)} value={password||""} className="form-control" placeholder="Contraseña" id="logpass1" autoComplete="off" required/>
												<i className="input-icon bi bi-key"></i>
											</div>
											<button className="btn mt-5">Enviar</button>
				      					</div>

                                        </form>
			      					</div>
			      				</div>
								<div className="card-back">
                                    {loading && <Spinner className='Spinner' animation="grow" variant="info" size="sm" />}
									<div className="center-wrap">
                                        {errMsg && <span id="errMsg" className='px-3 py-2 start-50 translate-middle bg-danger '>{errMsg}</span>}
                                        <form onSubmit={submitSignup}>

                                            <div className="section text-center">
                                                <h4 className="mb-4 pb-3">Registro</h4>
                                                <div className="form-group">
                                                    <input type="text" name="logname" onChange={(e)=> setName(e.target.value)} value={name||""} className="form-control" placeholder="Nombre Completo" id="logname" autoComplete="off" required/>
                                                    <i className="input-icon bi bi-person-vcard"></i>
                                                </div>	
                                                <div className="form-group mt-2">
                                                    <input type="email" name="logemail" onChange={(e)=> setEmail(e.target.value)} value={email||""} className="form-control" placeholder="Correo" id="logemail2" autoComplete="off" required/>
                                                    <i className="input-icon bi bi-at"></i>
                                                </div>	
                                                <div className="form-group mt-2">
                                                    <input  type="password" name="logpass" onChange={(e)=> setPassword(e.target.value)} value={password||""} className="form-control" placeholder="Contraseña" id="logpass2" autoComplete="off" required/>
                                                    <i className="input-icon bi bi-key"></i>
                                                </div>
                                                <button className="btn mt-5">Enviar</button>
                                            </div>
                                        </form>

			      					</div>
			      				</div>
			      			</div>
                            

			      		</div>
			      	</div>
		      	</div>
	      	</div>
	    </div>
	</div>
    </section>
  )
}

export default Login