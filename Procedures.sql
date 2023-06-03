CREATE PROCEDURE ObtenerDatoEstudiante
@email char(60),
@password char(15)
AS
BEGIN
	SELECT * FROM Estudiante WHERE Correo = @email AND CodigoAcceso = @password
END
GO

CREATE PROCEDURE ObtenerDatoMaestro
@email char(60),
@password char(15)
AS
BEGIN
	SELECT * FROM Maestro WHERE Correo = @email AND CodigoAcceso = @password
END
GO

CREATE PROCEDURE ObtenerTodosLosEstudiantes
@limit INT
AS
BEGIN
    SELECT TOP (@limit) *
    FROM Estudiante
END
GO

CREATE PROCEDURE ObtenerCertificado
@Matricula INT
AS
BEGIN
    SELECT *
    FROM Certificado
    WHERE Matricula = @Matricula
END
GO

CREATE PROCEDURE ObtenerEstudiante
@Matricula CHAR(9)
AS
BEGIN
    SELECT *
    FROM Estudiante
    WHERE Matricula = @Matricula
END
GO

CREATE PROCEDURE ObtenerMinijuegosPorEstudiante
@Matricula CHAR(9)
AS
BEGIN
    SELECT CatalogoMinijuegos.Nombre, Minijuego.Completado
    FROM Minijuego
             JOIN CatalogoMinijuegos ON Minijuego.IdVideoJuego = CatalogoMinijuegos.Id
    WHERE Minijuego.Matricula = @Matricula
END
GO

CREATE PROCEDURE CrearCertificado
    @Matricula CHAR(9)
AS
BEGIN
    DECLARE @NombreEstudiante VARCHAR(100)
    DECLARE @FechaEmision DATE
    DECLARE @NumeroSerie CHAR(10)

    -- Get the name of the student
    SELECT @NombreEstudiante = CONCAT(Nombre, ' ', ApPaterno, ' ', ApMaterno)
    FROM Estudiante
    WHERE Matricula = @Matricula

    -- Set the date of issuance to today's date
    SET @FechaEmision = GETDATE()

    -- Generate a unique certificate number
    SET @NumeroSerie = CONCAT('CERT-', @Matricula, '-', CONVERT(VARCHAR(8), GETDATE(), 112))

    -- Insert the certificate into the Certificado table
    INSERT INTO Certificado (NumeroSerie, Matricula, FechaEmision)
    VALUES (@NumeroSerie, @Matricula, @FechaEmision)
END
GO

CREATE PROCEDURE ActualizarEstatusEstudiante
    @Matricula CHAR(9),
    @NuevoEstatus BIT
AS
BEGIN
    UPDATE Estudiante
    SET Estatus = @NuevoEstatus
    WHERE Matricula = @Matricula
END
GO

CREATE PROCEDURE ActualizarProgresoEstudiante
    @Matricula CHAR(9),
    @NuevoProgreso INT
AS
BEGIN
    UPDATE Estudiante
    SET Progreso = @NuevoProgreso
    WHERE Matricula = @Matricula
END
GO

CREATE PROCEDURE UpdateMinijuegoState
    @MinijuegoId INT,
    @AlumnoMatricula CHAR(9),
    @NuevoEstado BIT
AS
BEGIN
    UPDATE Minijuego
    SET Completado = @NuevoEstado
    WHERE IdVideoJuego = @MinijuegoId AND Matricula = @AlumnoMatricula
END
GO

CREATE PROCEDURE CreateRegistrosForUser
    @Matricula CHAR(9)
AS
BEGIN
    DECLARE @CatalogoMinijuegosId INT
    DECLARE @MinijuegoId INT

    -- Get the Id of the CatalogoMinijuegos
    SELECT @CatalogoMinijuegosId = Id FROM CatalogoMinijuegos

    -- Insert a new row in Minijuego for each CatalogoMinijuegos
    INSERT INTO Minijuego (Matricula, IdVideoJuego, Completado)
    SELECT @Matricula, Id, 0 FROM CatalogoMinijuegos

END
GO

CREATE PROCEDURE CredencialesProfesor
    @Correo VARCHAR(60),
    @CodigoAcceso VARCHAR(15)
AS
BEGIN
    SELECT *
    FROM Maestro
    WHERE Correo = @Correo AND CodigoAcceso = @CodigoAcceso
END