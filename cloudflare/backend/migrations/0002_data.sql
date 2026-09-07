-- Existing business records only; no catalog, user, order or contact seeds.
CREATE TABLE products (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data)='object' AND json_extract(data, '$.id') IS id));
CREATE TABLE product_variants (id TEXT PRIMARY KEY NOT NULL, product_id TEXT NOT NULL REFERENCES products(id), data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data)='object' AND json_extract(data, '$.id') IS id));
CREATE TABLE orders (id TEXT PRIMARY KEY NOT NULL, owner_id TEXT NOT NULL REFERENCES user(id), data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data)='object' AND json_extract(data, '$.id') IS id));
CREATE INDEX orders_owner ON orders(owner_id);
CREATE TABLE user_profiles (owner_id TEXT PRIMARY KEY NOT NULL REFERENCES user(id), data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data)='object' AND json_extract(data, '$.owner') IS owner_id));
CREATE TABLE contact_messages (id TEXT PRIMARY KEY NOT NULL, data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data)='object'));
CREATE TABLE contact_rate_limit (key TEXT PRIMARY KEY NOT NULL, window INTEGER NOT NULL, count INTEGER NOT NULL);
CREATE INDEX contact_rate_expiry ON contact_rate_limit(window);
