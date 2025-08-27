-- 1. Users table
CREATE TABLE tb_user (
    userId VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- hashed password
    createdAt DATETIME DEFAULT GETDATE()
);

-- 2. Projects table
CREATE TABLE tb_project (
    projectId VARCHAR(20) PRIMARY KEY,
    projectName VARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT GETDATE()
);

-- 3. Warehouses table
CREATE TABLE tb_warehouse (
    warehouseId VARCHAR(20) PRIMARY KEY,
    projectId VARCHAR(20) NOT NULL,
    warehouseName VARCHAR(100) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (projectId) REFERENCES tb_project(projectId)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 4. Item table
CREATE TABLE tb_item (
    itemCode VARCHAR(20) PRIMARY KEY,
    itemName VARCHAR(100) NOT NULL,
    itemDescription VARCHAR(200) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);

-- 5. Location table
CREATE TABLE tb_sk_location (
    locationId VARCHAR(20) PRIMARY KEY,
    warehouseId VARCHAR(20) NOT NULL,
    itemCode VARCHAR(20) NOT NULL,
    locationName VARCHAR(100) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (warehouseId) REFERENCES tb_warehouse(warehouseId)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (itemCode) REFERENCES tb_item(itemCode)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. StockCounts table
CREATE TABLE tb_stockCounts (
    itemCode VARCHAR(20) NOT NULL,
    warehouseId VARCHAR(20) NOT NULL,
    locationId VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    countedBy VARCHAR(20) NOT NULL, -- FK to Users.userId
    countedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (itemCode) REFERENCES tb_item(itemCode),
    FOREIGN KEY (locationId) REFERENCES tb_sk_location(locationId),
    FOREIGN KEY (countedBy) REFERENCES tb_user(userId)
);