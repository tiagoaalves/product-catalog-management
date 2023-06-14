DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS products;

CREATE TABLE categories(
   category_id SERIAL,
   title VARCHAR(50) NOT NULL,
   PRIMARY KEY(category_id)
);

CREATE TABLE products(
   product_id SERIAL,
   description VARCHAR NOT NULL,
   price numeric,
   category_id SERIAL,
   PRIMARY KEY(product_id),
   CONSTRAINT fk_customer
      FOREIGN KEY(category_id) 
	  REFERENCES categories(category_id)
);

INSERT INTO categories(title) VALUES 
    ('fruits and vegetables'),
    ('pastry');

INSERT INTO products(description, price, category_id) VALUES 
    ('oranges', 3.99, 1),
    ('apples', 2.99, 1),
    ('croissants', 0.99, 2),
    ('pastel de nata', 0.99, 2);