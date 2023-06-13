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

INSERT INTO categories(category_id, title) VALUES 
    (1, 'fruits and vegetables'),
    (2, 'pastry');

INSERT INTO products(product_id, description, price, category_id) VALUES 
    (1, 'oranges', 3.99, 1),
    (2, 'apples', 2.99, 1),
    (3, 'croissants', 0.99, 2),
    (4, 'pastel de nata', 0.99, 2);