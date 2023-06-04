-- drop all tables in BarryDB
drop table Certificado;
drop table Minijuego;
drop table Estudiante;
drop table Maestro;
drop table CatalogoMinijuegos;

CREATE TABLE Estudiante(
Matricula CHAR(9) PRIMARY KEY NOT NULL, 
Nombre VARCHAR(50) NOT NULL,
ApPaterno VARCHAR(25), 
ApMaterno VARCHAR(25),
Correo VARCHAR(64),
CodigoAcceso VARCHAR (100),
Progreso INT,
Estado BIT
);

CREATE TABLE CatalogoMinijuegos(
Id INT PRIMARY KEY NOT NULL,
Nombre VARCHAR(20) NOT NULL,
Descripcion VARCHAR(100)
);

CREATE TABLE Minijuego(
Id INT IDENTITY PRIMARY KEY NOT NULL,
Matricula CHAR(9) FOREIGN KEY REFERENCES Estudiante(Matricula),
IdVideoJuego INT FOREIGN KEY REFERENCES CatalogoMinijuegos(Id),
Completado BIT
);

CREATE TABLE Maestro(
Matricula CHAR(9) PRIMARY KEY NOT NULL,
Nombre  VARCHAR(50) NOT NULL,
ApPaterno VARCHAR(25),
ApMaterno VARCHAR(25),
Correo VARCHAR(64),
CodigoAcceso VARCHAR (100)
);

CREATE TABLE Certificado(
NumeroSerie CHAR(10) PRIMARY KEY NOT NULL,
Matricula CHAR(9) FOREIGN KEY REFERENCES Estudiante(Matricula),
MaestroAutorizo CHAR(9) FOREIGN KEY REFERENCES Maestro(Matricula),
FechaVencimiento DATETIME,
FechaEmision DATETIME
);
