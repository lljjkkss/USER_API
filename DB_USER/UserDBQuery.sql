USE master;
GO
              
DROP DATABASE IF EXISTS UserDB;
GO

CREATE DATABASE UserDB;
GO

USE UserDB;
GO

CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    LastModifiedDate DATETIME,
    IsDeleted BIT DEFAULT 0
);
GO

-- Ensure the Email is unique when IsDeleted = 0
CREATE UNIQUE INDEX IX_Users_Email_NotDeleted
    ON Users (Email)
    WHERE IsDeleted = 0;
GO

CREATE TABLE RefreshTokens (
    TokenId INT PRIMARY KEY IDENTITY(1,1),
    UserId INT NOT NULL,
    RefreshToken NVARCHAR(500) NOT NULL,
    ExpiryDate DATETIME NOT NULL,
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId)
        REFERENCES Users(UserId)
        ON DELETE CASCADE
);
GO

CREATE UNIQUE INDEX IX_RefreshTokens_Token
    ON RefreshTokens(RefreshToken);
GO

-- Create User
CREATE OR ALTER PROCEDURE spAddUser
    @UserName NVARCHAR(100),
    @Email VARCHAR(100),
    @PasswordHash VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (UserName, Email, PasswordHash)
    VALUES (@UserName, @Email, @PasswordHash);
    
    SELECT SCOPE_IDENTITY() AS NewUserId;
END;
GO

-- Read Users
CREATE OR ALTER PROCEDURE spGetUsers
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, UserName, Email, PasswordHash, CreatedDate, LastModifiedDate
    FROM Users
    WHERE IsDeleted = 0
    ORDER BY UserId DESC;
END;
GO

-- Read User by Id
CREATE OR ALTER PROCEDURE spGetUserById
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserId, UserName, Email, PasswordHash, CreatedDate, LastModifiedDate
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END;
GO

CREATE OR ALTER PROCEDURE spGetUserByEmail
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON
    SELECT UserId, UserName, Email, PasswordHash, CreatedDate, LastModifiedDate
    FROM Users
    WHERE Email = @Email AND IsDeleted = 0;
END;
GO

-- Update User
CREATE OR ALTER PROCEDURE spUpdateUser
    @UserId INT,
    @UserName NVARCHAR(100),
    @Email VARCHAR(100),
    @PasswordHash VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET UserName = @UserName,
        Email = @Email,
        PasswordHash = @PasswordHash,
        LastModifiedDate = GETDATE()
    WHERE UserId = @UserId AND IsDeleted = 0;

    SELECT UserId, UserName, Email, CreatedDate, LastModifiedDate
    FROM Users
    WHERE UserId = @UserId AND IsDeleted = 0;
END;
GO

-- Soft Delete User
CREATE OR ALTER PROCEDURE spDeleteUser
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET IsDeleted = 1
    WHERE UserId = @UserId AND IsDeleted = 0;
END;
GO

CREATE OR ALTER PROCEDURE spSaveRefreshToken
    @RefreshToken NVARCHAR(500),
    @UserId INT,
    @ExpiryDate DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO RefreshTokens (RefreshToken, UserId, ExpiryDate)
    VALUES (@RefreshToken, @UserId, @ExpiryDate);
END;
GO

CREATE OR ALTER PROCEDURE spGetRefreshToken
    @RefreshToken NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT TokenId, UserId, RefreshToken, ExpiryDate
    FROM RefreshTokens
    WHERE RefreshToken = @RefreshToken 
      AND ExpiryDate > GETDATE();
END;
GO

CREATE OR ALTER PROCEDURE spDeleteRefreshToken
    @RefreshToken NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM RefreshTokens 
    WHERE RefreshToken = @RefreshToken;
END;
GO