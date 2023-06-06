CREATE PROCEDURE ObtenerDatosUsuario
@email char(60),
@password char(15)
AS
BEGIN
    -- Check if the user exists in the Estudiante table
    IF EXISTS (SELECT 1 FROM Estudiante WHERE Correo = @email AND CodigoAcceso = @password)
    BEGIN
        SELECT * FROM Estudiante WHERE Correo = @email AND CodigoAcceso = @password
    END
    ELSE
    BEGIN
        SELECT * FROM Maestro WHERE Correo = @email AND CodigoAcceso = @password
    END
END
GO

CREATE PROCEDURE ObtenerDatosUsuarioConId
@id char(9)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Estudiante WHERE Matricula = @id)
    BEGIN
        SELECT * FROM Estudiante WHERE Matricula = @id
    END
    ELSE
    BEGIN
        SELECT * FROM Maestro WHERE Matricula = @id
    END
END
GO

CREATE PROCEDURE ObtenerTodosLosEstudiantes
AS
BEGIN
    SELECT *
    FROM Estudiante
END
GO

CREATE PROCEDURE ObtenerCertificado
@Matricula CHAR(9)
AS
BEGIN

    SELECT e.Matricula, e.Nombre, e.ApPaterno, e.ApMaterno, e.Campus, c.NumeroSerie, c.FechaEmision, c.FechaVencimiento
    FROM Estudiante e
	INNER JOIN Certificado c
	ON e.Matricula = c.Matricula
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
    DECLARE @FechaEmision DATE
    DECLARE @NumeroSerie CHAR(10)

    -- Set the date of issuance to today's date
    SET @FechaEmision = GETDATE()

    -- Generate a unique certificate number
    SET @NumeroSerie = CONCAT('CERT-', @Matricula, '-', CONVERT(VARCHAR(8), GETDATE(), 112))

    -- Insert the certificate into the Certificado table
    INSERT INTO Certificado (NumeroSerie, Matricula, FechaEmision)
    VALUES (@NumeroSerie, @Matricula, @FechaEmision)
END
GO

CREATE PROCEDURE ActualizarMinijuegoCompletado
    @Matricula CHAR(9),
    @MinijuegoId INT
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM Estudiante WHERE Matricula = @Matricula)
    BEGIN
        RAISERROR ('The student does not exist.', 16, 1)
        RETURN
    END

    IF NOT EXISTS (SELECT * FROM CatalogoMinijuegos WHERE Id = @MinijuegoId)
    BEGIN
        RAISERROR ('Invalid minigame Id.', 16, 1)
        RETURN
    END

    IF EXISTS (SELECT * FROM Minijuego WHERE Matricula = @Matricula AND IdVideoJuego = @MinijuegoId)
    BEGIN
        UPDATE Minijuego
        SET Completado = 1
        WHERE Matricula = @Matricula AND IdVideoJuego = @MinijuegoId
    END
    ELSE
    BEGIN
        RAISERROR ('The user does has not started that minigame.', 16, 1)
        RETURN
    END
END

CREATE PROCEDURE ActualizarMinijuegoEmpezado
    @Matricula CHAR(9),
    @MinijuegoId INT
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM Estudiante WHERE Matricula = @Matricula)
    BEGIN
        RAISERROR ('The student does not exist.', 16, 1)
        RETURN
    END

    IF NOT EXISTS (SELECT * FROM CatalogoMinijuegos WHERE Id = @MinijuegoId)
    BEGIN
        RAISERROR ('Invalid minigame Id.', 16, 1)
        RETURN
    END

    IF NOT EXISTS (SELECT * FROM Minijuego WHERE Matricula = @Matricula AND IdVideoJuego = @MinijuegoId)
    BEGIN
        INSERT INTO Minijuego
        VALUES(@Matricula, @MinijuegoId, 0)
    END
END

CREATE PROCEDURE ObtenerCatalogoMinijuegos
AS
BEGIN
    SELECT *
    FROM CatalogoMinijuegos
END