/**
 * Utilidad para evaluar la fortaleza de contraseñas
 * NOVEDAD: Clasifica contraseñas como Débil, Intermedia o Fuerte
 */

/**
 * Evalúa la fortaleza de una contraseña
 * @param {string} password - Contraseña a evaluar
 * @returns {Object} { score, level, message, color }
 */
export function evaluarFortalezaPassword(password) {
    if (!password) {
        return {
            score: 0,
            level: "",
            message: "",
            color: "#ddd"
        };
    }
    
    let score = 0;
    const criterios = [];
    
    // Criterio 1: Longitud mínima
    if (password.length >= 8) {
        score += 1;
        criterios.push("✓ 8+ caracteres");
    } else {
        criterios.push("✗ Mínimo 8 caracteres");
    }
    
    // Criterio 2: Contiene números
    if (/[0-9]/.test(password)) {
        score += 1;
        criterios.push("✓ Contiene números");
    } else {
        criterios.push("✗ Debe contener números");
    }
    
    // Criterio 3: Contiene mayúsculas
    if (/[A-Z]/.test(password)) {
        score += 1;
        criterios.push("✓ Contiene mayúsculas");
    } else {
        criterios.push("✗ Debe contener mayúsculas");
    }
    
    // Criterio 4: Contiene minúsculas
    if (/[a-z]/.test(password)) {
        score += 1;
        criterios.push("✓ Contiene minúsculas");
    } else {
        criterios.push("✗ Debe contener minúsculas");
    }
    
    // Criterio 5: Contiene caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += 1;
        criterios.push("✓ Caracteres especiales");
    } else {
        criterios.push("✗ Debe contener caracteres especiales");
    }
    
    // Determinar nivel según el puntaje
    let level = "";
    let message = "";
    let color = "";
    
    if (score <= 2) {
        level = "Débil";
        message = "⚠️ Contraseña débil - Mejórala para mayor seguridad";
        color = "#dc3545";
    } else if (score <= 4) {
        level = "Intermedia";
        message = "⚠️ Contraseña intermedia - Puedes mejorarla";
        color = "#ffc107";
    } else {
        level = "Fuerte";
        message = "✅ Contraseña fuerte - Excelente seguridad";
        color = "#28a745";
    }
    
    return {
        score,
        level,
        message,
        color,
        criterios,
        maxScore: 5
    };
}

/**
 * Valida si la contraseña cumple los requisitos mínimos
 * @param {string} password - Contraseña a validar
 * @returns {Object} { isValid, errors }
 */
export function validarRequisitosPassword(password) {
    const errors = [];
    
    if (!password || password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("La contraseña debe contener al menos un número");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("La contraseña debe contener al menos una mayúscula");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("La contraseña debe contener al menos una minúscula");
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}