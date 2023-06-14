const pool = require("../db.js");
const logger = require("../logger.js");

const getAllProducts = (request, response) => {
  logger.error();
  pool.query("SELECT * FROM products", (error, results) => {
    if (error) {
      logger.error(error);
      response.status(500).send(error.message);
    } else {
      response.status(200).json(results.rows);
    }
  });
};

const getProductsById = (request, response) => {
  const id = request.params.product_id;

  pool.query(
    "SELECT * FROM products WHERE product_id = $1",
    [id],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

//I assumed categories would be searched by category title and not id
const getProductsByCategory = (request, response) => {
  const category = request.params.category;

  pool.query(
    `SELECT product_id, description, price, products.category_id FROM products 
    INNER JOIN categories ON products.category_id=categories.category_id 
    WHERE categories.title = $1`,
    [category],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const updateProductCategory = (request, response) => {
  const product_id = request.params.product_id;
  const category_id = request.body.category_id;

  pool.query(
    "UPDATE products SET category_id = $1 WHERE product_id = $2",
    [category_id, product_id],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        console.log(result);
        response
          .status(200)
          .send(`Category successfully updated for product ${product_id}`);
      }
    }
  );
};

const updateProduct = (request, response) => {
  const product_id = request.params.product_id;
  const { description, price, category_id } = request.body;

  pool.query(
    "UPDATE products SET description = $1, price = $2, category_id = $3 WHERE product_id = $4",
    [description, price, category_id, product_id],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        response.status(200).send(`Product modified with ID: ${product_id}`);
      }
    }
  );
};

const createProduct = (request, response) => {
  const { description, price, category_id } = request.body;

  pool.query(
    "INSERT INTO products (description, price, category_id) VALUES ($1, $2, $3) RETURNING *",
    [description, price, category_id],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        response
          .status(201)
          .send(`User added with ID: ${results.rows[0].product_id}`);
      }
    }
  );
};

const deleteProduct = (request, response) => {
  const product_id = request.params.product_id;

  pool.query(
    "DELETE FROM products WHERE product_id = $1",
    [product_id],
    (error, results) => {
      if (error) {
        logger.error(error);
        response.status(500).send(error.message);
      } else {
        response.status(200).send(`User deleted with ID: ${product_id}`);
      }
    }
  );
};

module.exports = {
  getAllProducts,
  getProductsById,
  getProductsByCategory,
  updateProductCategory,
  updateProduct,
  createProduct,
  deleteProduct,
};
