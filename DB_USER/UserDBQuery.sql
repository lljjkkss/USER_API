USE master;
GO
              
DROP DATABASE IF EXISTS UserDB;
GO

CREATE DATABASE UserDB;
GO

USE UserDB;
GO

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    UserName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0
);
GO

-- Ensure the Email is unique when IsDeleted = 0
CREATE UNIQUE INDEX IX_Users_Email_NotDeleted
    ON Users (Email)
    WHERE IsDeleted = 0;
GO

-- Create User
CREATE OR ALTER PROCEDURE spAddUser
    @UserName NVARCHAR(100),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Users (UserName, Email)
    VALUES (@UserName, @Email);
    
    SELECT SCOPE_IDENTITY() AS NewUserID;
END;
GO

-- Read Users
CREATE OR ALTER PROCEDURE spGetUsers
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserID, UserName, Email, CreatedDate
    FROM Users
    WHERE IsDeleted = 0
    ORDER BY UserID DESC;
END;
GO

-- Read User by ID
CREATE OR ALTER PROCEDURE spGetUserById
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserID, UserName, Email, CreatedDate
    FROM Users
    WHERE UserID = @UserID AND IsDeleted = 0;
END;
GO

CREATE OR ALTER PROCEDURE spGetUserByEmail
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON
    SELECT UserID, UserName, Email, CreatedDate
    FROM Users
    WHERE Email = @Email AND IsDeleted = 0;
END;
GO

-- Update User
CREATE OR ALTER PROCEDURE spUpdateUser
    @UserID INT,
    @UserName NVARCHAR(100),
    @Email VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET UserName = @UserName,
        Email = @Email
    WHERE UserID = @UserID AND IsDeleted = 0;

    SELECT UserID, UserName, Email, CreatedDate
    FROM Users
    WHERE UserID = @UserID AND IsDeleted = 0;
END;
GO

-- Soft Delete User
CREATE OR ALTER PROCEDURE spDeleteUser
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET IsDeleted = 1
    WHERE UserID = @UserID AND IsDeleted = 0;
END;
GO