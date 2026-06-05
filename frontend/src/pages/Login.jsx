//login -> token jwt -> guardar -> entrar al sistema

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBreadSlice, FaLock, FaEnvelope } from "react-icons/fa";
import axios from "axios";


function Login(){
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [contrasena, setPassword] = useState("");

    const iniciarSesion = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:3000/login",
                {
                    correo, contrasena
                }
            );
            localStorage.setItem(
                "token", response.data.token
            );
            navigate('/dashboard')
        } catch (error){
            alert(
                "correo o contrasena incorrectos"
            );
            console.log(error)
        } 
    }
    return(
        <div className="login-container">
            <form className="login-card" onSubmit={iniciarSesion}>
                <FaBreadSlice className="logo"/>
                <h1>Panaderia</h1>
                <p>Inicie sesion para continuar</p>

                <div className="input-group">
                    <FaEnvelope/>
                    <input type="email" placeholder="Correo" value={correo} onChange={(e)=> setCorreo(e.target.value)} />
                </div>

                <div className="input-group">
                    <FaLock/>
                    <input type="password" placeholder="Contrasena" value={contrasena} onChange={(e)=> setPassword(e.target.value)} />
                </div>

                <button type="submit">Ingresar</button>
            </form>
        </div>
    )
}

export default Login;