//login -> token jwt -> guardar -> entrar al sistema

import { useState } from "react";
import { FaBreadSlice, FaLock, FaEnvelope } from "react-icons/fa";

const [form, setForm] = useState([])

function Login(){
    return(
        <div className="login-container">
            <div className="login-card">
                <FaBreadSlice className="logo"/>
                <h1>Panaderia</h1>
                <p>Inicie sesion para continuar</p>

                <div className="input-group">
                    <FaEnvelope/>
                    <input type="email" placeholder="Correo" />
                </div>

                <div className="input-group">
                    <FaLock/>
                    <input type="password" placeholder="Contrasena" />
                </div>

                <button>Ingresar</button>
            </div>
        </div>
    )
}

export default Login;