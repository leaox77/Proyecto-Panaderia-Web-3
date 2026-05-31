# Panadería Proyecto
Proyecto web para la gestión de una panadería. Incluye un **frontend** desarrollado con **React + Vite** y un **backend** desarrollado con **Express** usando **Nodemon** para reiniciar el servidor automáticamente durante el desarrollo.

## Tecnologías usadas
- **Frontend:** React + Vite
- **Backend:** Express
- **Desarrollo del backend:** Nodemon
- **Lenguaje:** JavaScript

## Estructura básica
```bash
panaderia-proyecto/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── backend/
│   ├── db.js
│   ├── server.js
│   └── package.json
└── README.md
```
> La estructura puede variar según cómo esté organizado el proyecto, pero esta es una base común para separar interfaz y servidor.

## Funcionalidad general
- El **frontend** se encarga de mostrar la interfaz de usuario.
- El **backend** expone rutas y lógica del servidor.
- El backend se ejecuta con **Nodemon** para detectar cambios en tiempo real durante el desarrollo.

## Requisitos previos
- Node.js instalado
- npm o yarn instalado

## Instalación

### 1. Clonar el proyecto

```bash
git clone https://github.com/leaox77/Proyecto-Panaderia-Web-3.git
cd Proyecto-Panaderia-Web-3
```

### 2. Instalar dependencias del frontend

```bash
cd frontend
npm install
```

### 3. Instalar dependencias del backend

```bash
cd ../backend
npm install
```

## Ejecución en desarrollo

### Frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

Esto iniciará el proyecto con Vite en modo desarrollo.

### Backend

Desde la carpeta `backend`:

```bash
npm run dev
```

Esto iniciará el servidor de Express con Nodemon, reiniciándose automáticamente cuando haya cambios en los archivos.

## Scripts comunes

### Frontend (`frontend/package.json`)

- `npm run dev` → inicia el servidor de desarrollo
- `npm run build` → genera la versión de producción
- `npm run preview` → previsualiza la versión compilada

### Backend (`backend/package.json`)

- `npm run dev` → ejecuta el backend con Nodemon
- `npm start` → ejecuta el servidor en modo normal

## Uso básico

1. Inicia el backend.
2. Inicia el frontend.
3. Abre el navegador en la URL que indique Vite.
4. Consume las rutas del backend desde el frontend según la lógica del proyecto.

## Notas

- Asegúrate de configurar correctamente las variables de entorno si el proyecto las utiliza.
- Si el frontend consume una API local, verifica que el puerto del backend coincida con la configuración del cliente.

## Autor

Proyecto de panadería desarrollado con React, Vite, Express y Nodemon.
