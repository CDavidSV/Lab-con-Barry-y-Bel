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
    FROM CatalogoMinijuegos
        LEFT JOIN Minijuego ON Minijuego.IdVideoJuego = CatalogoMinijuegos.Id AND Minijuego.Matricula = @Matricula
END
GO

CREATE PROCEDURE CrearCertificado
    @Matricula CHAR(9)
AS
BEGIN
    DECLARE @FechaEmision DATE
    DECLARE @NumeroSerie CHAR(10)

    -- Set the date of issuance to today's date
    SET @FechaEmision = CONVERT(VARCHAR(10), getdate(), 111)

    -- Generate a unique certificate number
    SET @NumeroSerie = CONCAT('CERT-', @Matricula, DAY(GETDATE()), MONTH(GETDATE()), YEAR(GETDATE()))

    -- Insert the certificate into the Certificado table
    IF NOT EXISTS (SELECT 1 FROM Certificado WHERE Matricula = @Matricula)
    BEGIN
        INSERT INTO Certificado (NumeroSerie, Matricula, FechaEmision)
        VALUES (@NumeroSerie, @Matricula, @FechaEmision)
    END
END
GO

CREATE PROCEDURE ActualizarMinijuegoCompletado
    @Matricula CHAR(9),
    @MinijuegoId INT
AS
BEGIN
    -- Update the minigame state.
    UPDATE Minijuego
    SET Completado = 1
    WHERE Matricula = @Matricula AND IdVideoJuego = @MinijuegoId

    -- Update the student's progress.
    DECLARE @Progreso INT
    SET @Progreso = (SELECT Progreso FROM Estudiante WHERE Matricula = @Matricula)

    IF NOT @Progreso >= (SELECT COUNT(*) FROM CatalogoMinijuegos)
    BEGIN
        UPDATE Estudiante
        SET Progreso = @Progreso + 1
        WHERE Matricula = @Matricula
    END
    ELSE
    BEGIN
        -- Create the certificate if the student has completed all the minigames.
        EXEC CrearCertificado @Matricula = @Matricula
        RETURN
    END
END
GO

CREATE PROCEDURE ActualizarMinijuegoEmpezado
    @Matricula CHAR(9),
    @MinijuegoId INT
AS
BEGIN
    IF NOT EXISTS (SELECT * FROM Minijuego WHERE Matricula = @Matricula AND IdVideoJuego = @MinijuegoId)
    BEGIN
        INSERT INTO Minijuego
        VALUES(@Matricula, @MinijuegoId, 0)
    END
END
GO

CREATE PROCEDURE ObtenerCatalogoMinijuegos
AS
BEGIN
    SELECT *
    FROM CatalogoMinijuegos
END

CREATE PROCEDURE ObtenerMinijuego
    @MinijuegoId INT
AS
BEGIN
    SELECT *
    FROM CatalogoMinijuegos
    WHERE Id = @MinijuegoId
END