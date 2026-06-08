/**
 * Componente indicador de fortaleza de contraseña
 * NOVEDAD: Muestra visualmente qué tan segura es la contraseña
 */

import { useState, useEffect } from "react";
import { evaluarFortalezaPassword } from "../utils/passwordStrength";

function PasswordStrengthIndicator({ password }) {
    const [fortaleza, setFortaleza] = useState({
        score: 0,
        level: "",
        message: "",
        color: "",
        criterios: []
    });

    useEffect(() => {
        if (password) {
            setFortaleza(evaluarFortalezaPassword(password));
        } else {
            setFortaleza({
                score: 0,
                level: "",
                message: "",
                color: "#ddd",
                criterios: []
            });
        }
    }, [password]);

    if (!password) return null;

    return (
        <div className="password-strength">
            <div className="strength-bar-container">
                <div 
                    className="strength-bar"
                    style={{
                        width: `${(fortaleza.score / fortaleza.maxScore) * 100}%`,
                        backgroundColor: fortaleza.color,
                        transition: "width 0.3s ease"
                    }}
                />
            </div>
            
            <div className="strength-info">
                <span className="strength-level" style={{ color: fortaleza.color }}>
                    {fortaleza.level}
                </span>
                <span className="strength-message">{fortaleza.message}</span>
            </div>
            
            <div className="strength-criterios">
                <small>Requisitos:</small>
                <ul>
                    {fortaleza.criterios.map((criterio, idx) => (
                        <li key={idx} className={criterio.includes("✓") ? "cumple" : "incumple"}>
                            {criterio}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PasswordStrengthIndicator;