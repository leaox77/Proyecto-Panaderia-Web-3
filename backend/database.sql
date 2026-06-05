create table roles (
    id int AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50) not null
)

create table usuarios (
    id int AUTO_INCREMENT PRIMARY key,
    nombre varchar(100) not null,
    correo varchar(100) UNIQUE not null,
    contrasena varchar(255) not null,
    rol_id int not null,
    estado tinyint DEFAULT 1,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
)

create table logs_acceso(
    id int AUTO_INCREMENT PRIMARY key,
    usuario_id int not null,
    ip varchar(50) not null,
    evento varchar(20),
    browser varchar(255),
    fecha_hora timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN key (usuario_id) REFERENCES usuarios(id)
)

create table categorias (
    id int AUTO_INCREMENT PRIMARY key,
    nombre varchar(100) not null,
    estado tinyint DEFAULT 1,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP
)

create table productos (
    id int AUTO_INCREMENT PRIMARY key,
    nombre varchar(100) not null,
    precio decimal(10,2) not null,
    stock int not null,
    descripcion text,
    categoria_id int not null,
    estado tinyint DEFAULT 1,
    fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN key (categoria_id) REFERENCES categorias(id)
)

-- ingreso de datos minimos

insert into roles (nombre)
VALUES
('Administrador'),
('Empleado');

insert into usuarios (nombre, correo, contrasena, rol_id)
VALUES
('Administrador', 'admin@panaderia.com', '12345678', 1);

insert into categorias (nombre)
VALUES
('Pan'),
('Queque'),
('Pastel'),
('Galleta');

insert into productos (nombre, precio, stock, descripcion, categoria_id)
VALUES
('Pan Frances', 0.50, 100, 'Pan tradicional', 1),
('Pan Integral', 0.80, 50, 'Pan integral', 1),
('Queque Chocolate', 25.00, 10, 'Queque Familiar', 2),
('Pastel Vainilla', 70.00, 5, 'Patel cumple', 3),
('Galleta Chips', 2.50, 40, 'Galleta chocolate', 4);