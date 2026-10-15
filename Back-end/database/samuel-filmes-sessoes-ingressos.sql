IF SCHEMA_ID(N'CJ') IS NULL
BEGIN
    EXEC(N'CREATE SCHEMA CJ');
END;

IF OBJECT_ID(N'CJ.filme', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.filme (
        idFilme int IDENTITY(1,1) PRIMARY KEY,
        titulo varchar(80) NOT NULL,
        genero varchar(40) NOT NULL,
        classificacao varchar(5) NOT NULL
    );
END;

IF OBJECT_ID(N'CJ.sessao', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.sessao (
        idSessao int IDENTITY(1,1) PRIMARY KEY,
        idFilme int NOT NULL,
        dataSessao varchar(10) NOT NULL,
        horario varchar(10) NOT NULL,
        idSala int NOT NULL,
        FOREIGN KEY (idFilme) REFERENCES CJ.filme(idFilme),
        FOREIGN KEY (idSala) REFERENCES CJ.sala(idSala)
    );
END;

IF OBJECT_ID(N'CJ.ingresso', N'U') IS NULL
BEGIN
    CREATE TABLE CJ.ingresso (
        idIngresso int IDENTITY(1,1) PRIMARY KEY,
        idFilme int NOT NULL,
        idSessao int NOT NULL,
        assento varchar(5) NOT NULL,
        preco decimal(10,2) NOT NULL,
        FOREIGN KEY (idFilme) REFERENCES CJ.filme(idFilme),
        FOREIGN KEY (idSessao) REFERENCES CJ.sessao(idSessao),
        UNIQUE (idSessao, assento)
    );
END;

