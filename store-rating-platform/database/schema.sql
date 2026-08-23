-- ============================================
-- Store Rating Platform - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS store_rating_platform;
USE store_rating_platform;

-- ============================================
-- USERS TABLE
-- Covers all 3 roles: admin, user, store_owner
-- ============================================
CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(60)  NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,           -- stores bcrypt hash, not plain text
    address       VARCHAR(400),
    role          ENUM('admin', 'user', 'store_owner') NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) BETWEEN 20 AND 60)
);

-- ============================================
-- STORES TABLE
-- Each store is linked to a store_owner user
-- ============================================
CREATE TABLE stores (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(60)  NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    address       VARCHAR(400),
    owner_id      INT NOT NULL,                    -- FK -> users.id (role = store_owner)
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_owner FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- RATINGS TABLE
-- One rating per (user, store) pair — enforced by UNIQUE constraint.
-- This is what lets "submit" and "modify" rating be the same
-- upsert operation on the backend.
-- ============================================
CREATE TABLE ratings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    store_id      INT NOT NULL,
    rating        TINYINT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rating_store FOREIGN KEY (store_id) REFERENCES stores(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT uq_user_store UNIQUE (user_id, store_id)   -- 1 rating per user per store
);

-- ============================================
-- Helpful indexes for filtering/sorting (Admin listings)
-- ============================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_stores_name ON stores(name);
CREATE INDEX idx_ratings_store ON ratings(store_id);

