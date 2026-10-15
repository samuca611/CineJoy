IF SCHEMA_ID(N'CJ') IS NULL
BEGIN
    EXEC(N'CREATE SCHEMA CJ');
END;

IF OBJECT_ID(N'CJ.unidade', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.unidade (
        idUnidade int IDENTITY(1,1) PRIMARY KEY,
        nome varchar(80) NOT NULL,
        cidade varchar(80) NOT NULL
    );
END;

IF OBJECT_ID(N'CJ.sala', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.sala (
        idSala int IDENTITY(1,1) PRIMARY KEY,
        idUnidade int NOT NULL,
        numero varchar(10) NOT NULL,
        FOREIGN KEY (idUnidade) REFERENCES CJ.unidade(idUnidade)
    );
END;

IF OBJECT_ID(N'CJ.funcionario', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.funcionario (
        idFuncionario int IDENTITY(1,1) PRIMARY KEY,
        nome varchar(80) NOT NULL,
        email varchar(80) NOT NULL
    );
END;

