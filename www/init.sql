-- Create the CyberPrint database
CREATE DATABASE IF NOT EXISTS CyberPrint;
USE CyberPrint;

-- Create the cards table
CREATE TABLE cards (
    id INT(11) NOT NULL AUTO_INCREMENT,
    card_number VARCHAR(16) NOT NULL,
    expiration_date DATE NOT NULL,
    cvc VARCHAR(3) NOT NULL,
    PRIMARY KEY (id)
);

-- Create the contact table
CREATE TABLE contact (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    inquiry_type VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    PRIMARY KEY (id)
);

-- Create the orders table
CREATE TABLE orders (
    guid CHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    filesize INT(11),
    -- NOTE: We are doing files by UUID
    filename VARCHAR(255),
    paid TINYINT(1) DEFAULT 0,
    PRIMARY KEY (guid)
);

-- Create the user_cards table
CREATE TABLE user_cards (
    email VARCHAR(255) NOT NULL,
    card_id INT(11) NOT NULL,
    PRIMARY KEY (email, card_id),
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- Create the privileges for the nextjs user
-- TODO: Change this to be a password hash
CREATE USER IF NOT EXISTS 'nextjs'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT ON CyberPrint.cards TO 'nextjs'@'%';
GRANT SELECT, INSERT ON CyberPrint.contact TO 'nextjs'@'%';
GRANT SELECT, INSERT, UPDATE ON CyberPrint.orders TO 'nextjs'@'%';
GRANT SELECT, INSERT ON CyberPrint.user_cards TO 'nextjs'@'%';

-- Create the keycloak database
CREATE DATABASE IF NOT EXISTS keycloak;
USE keycloak;

-- Create the keycloak user
-- TODO: Change this to be a password hash
CREATE USER IF NOT EXISTS 'keycloak'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON keycloak.* TO 'keycloak'@'%';

-- Update the root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';

-- Delete the root password for remote access
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost');

-- Flush the privileges
FLUSH PRIVILEGES;