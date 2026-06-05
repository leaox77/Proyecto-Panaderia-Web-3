import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard(){

    const navigate = useNavigate();

    useEffect(()=> {
        const token = localStorage.getItem("token");

        if(!token){
            navigate("/")
        }
    }, [])
    return (
        <div>
            <h1>Bienvenido</h1>
        </div>
    )
}

export default Dashboard;