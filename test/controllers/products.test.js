const pool = require("../../app/db");
const {
  getAllProducts,
  getProductsById,
  getProductsByCategory,
  updateProductCategory,
  updateProduct,
  createProduct,
  deleteProduct,
} = require("../../app/controllers/products.js");

jest.mock("../../app/db");

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("getAllProducts", () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
    send: jest.fn(),
  };

  it("should handle an error and send a 500 response", () => {
    const mockError = new Error("An error occurred!");
    const mockReq = {};

    pool.query.mockImplementationOnce((query, callback) => {
      callback(mockError);
    });

    getAllProducts(mockReq, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM products",
      expect.any(Function)
    );
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
  it("should return all products when the query is successful", () => {
    const mockResults = {
      rows: [
        { id: 1, description: "oranges", price: 3.99, category_id: 1 },
        { id: 2, description: "apples", price: 2.99, category_id: 1 },
      ],
    };
    const mockReq = {};

    pool.query.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    getAllProducts(mockReq, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM products",
      expect.any(Function)
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockResults.rows);
  });
});

const mockResponseAgain = {
  status: jest.fn(() => mockResponseAgain),
  json: jest.fn(),
  send: jest.fn(),
};

describe("getProductsById", () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
    send: jest.fn(),
  };
  const sql = "SELECT * FROM products WHERE product_id = $1";

  it("should return a product with the given id when the query is successful", () => {
    const mockId = 1;
    const mockRows = [
      { id: 1, description: "oranges", price: 3.99, category_id: 1 },
    ];

    const mockRequest = {
      params: {
        product_id: mockId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockId]);
      callback(null, { rows: mockRows });
    });

    getProductsById(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockRows);
  });

  it("should handle an error and send a 500 response", () => {
    const mockId = 1;
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      params: {
        product_id: mockId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockId]);
      callback(mockError);
    });

    getProductsById(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});

describe("getProductsByCategory", () => {
  const sql = `SELECT product_id, description, price, products.category_id FROM products 
    INNER JOIN categories ON products.category_id=categories.category_id 
    WHERE categories.title = $1`;

  const mockResponse = {
    status: jest.fn(() => mockResponse),
    json: jest.fn(),
    send: jest.fn(),
  };

  it("should return products by category when the query is successful", () => {
    const mockCategory = "pastry";
    const mockRows = [
      { id: 1, description: "croissants", price: 0.99, category_id: 2 },
    ];

    const mockRequest = {
      params: {
        category: mockCategory,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockCategory]);
      callback(null, { rows: mockRows });
    });

    getProductsByCategory(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockRows);
  });

  it("should handle an error and send a 500 response", () => {
    const mockCategory = "pastry";
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      params: {
        category: mockCategory,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockCategory]);
      callback(mockError);
    });

    getProductsByCategory(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});

describe("updateProductCategory", () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
  };
  const sql = "UPDATE products SET category_id = $1 WHERE product_id = $2";

  it("should try to update product category and return a success message when the query is successful and changes are made", () => {
    const mockProductId = 1;
    const mockCategoryId = 2;

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        category_id: mockCategoryId,
      },
    };

    const mockResults = {
      rowCount: 1,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockCategoryId, mockProductId]);
      callback(null, mockResults);
    });

    updateProductCategory(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `Category successfully updated for product ${mockProductId}`
    );
  });

  it('should try to update product category and return a "No changes done" message when the query is successful but no changes are made', () => {
    const mockProductId = 1;
    const mockCategoryId = 2;

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        category_id: mockCategoryId,
      },
    };

    const mockResults = {
      rowCount: 0,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockCategoryId, mockProductId]);
      callback(null, mockResults);
    });

    updateProductCategory(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith("No changes done");
  });

  it("should handle an error and send a 500 response", () => {
    const mockProductId = 1;
    const mockCategoryId = 2;
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        category_id: mockCategoryId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockCategoryId, mockProductId]);
      callback(mockError);
    });

    updateProductCategory(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});

describe("updateProduct", () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
  };
  const sql =
    "UPDATE products SET description = $1, price = $2, category_id = $3 WHERE product_id = $4";
  const mockProductId = 1;
  const mockDescription = "apples";
  const mockPrice = 1.99;
  const mockCategoryId = 1;

  it("should try to update product and return a success message when the query is successful and changes are made", () => {
    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        description: mockDescription,
        price: mockPrice,
        category_id: mockCategoryId,
      },
    };

    const mockResults = {
      rowCount: 1,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([
        mockDescription,
        mockPrice,
        mockCategoryId,
        mockProductId,
      ]);
      callback(null, mockResults);
    });

    updateProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `Product modified with ID: ${mockProductId}`
    );
  });

  it('should try to update product and return a "No changes done" message when the query is successful but no changes are made', () => {
    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        description: mockDescription,
        price: mockPrice,
        category_id: mockCategoryId,
      },
    };

    const mockResults = {
      rowCount: 0,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([
        mockDescription,
        mockPrice,
        mockCategoryId,
        mockProductId,
      ]);
      callback(null, mockResults);
    });

    updateProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith("No changes done");
  });

  it("should handle an error and send a 500 response", () => {
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
      body: {
        description: mockDescription,
        price: mockPrice,
        category_id: mockCategoryId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([
        mockDescription,
        mockPrice,
        mockCategoryId,
        mockProductId,
      ]);
      callback(mockError);
    });

    updateProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});

describe("createProduct", () => {
  const mockProductId = 1;
  const mockDescription = "apples";
  const mockPrice = 1.99;
  const mockCategoryId = 1;
  const sql =
    "INSERT INTO products (description, price, category_id) VALUES ($1, $2, $3) RETURNING *";

  const mockResponse = {
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
  };

  it("should try to create a product and return the id when the query is successful", () => {
    const mockRequest = {
      body: {
        description: mockDescription,
        price: mockPrice,
        category_id: mockCategoryId,
      },
    };

    const mockResults = {
      rows: [{ product_id: mockProductId }],
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockDescription, mockPrice, mockCategoryId]);
      callback(null, mockResults);
    });

    createProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `User added with ID: ${mockProductId}`
    );
  });

  it("should handle an error and send a 500 response", () => {
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      body: {
        description: mockDescription,
        price: mockPrice,
        category_id: mockCategoryId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockDescription, mockPrice, mockCategoryId]);
      callback(mockError);
    });

    createProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});

describe("deleteProduct", () => {
  const mockResponse = {
    status: jest.fn(() => mockResponse),
    send: jest.fn(),
  };
  const sql = "DELETE FROM products WHERE product_id = $1";

  it("should try to delete a product and return a success message when the query is successful and changes are made", () => {
    const mockProductId = 1;

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
    };

    const mockResults = {
      rowCount: 1,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockProductId]);
      callback(null, mockResults);
    });

    deleteProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith(
      `User deleted with ID: ${mockProductId}`
    );
  });

  it('should try to delete a product and return a "No changes done" message when the query is successful but no changes are made', () => {
    const mockProductId = 1;

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
    };

    const mockResults = {
      rowCount: 0,
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockProductId]);
      callback(null, mockResults);
    });

    deleteProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith("No changes done");
  });

  it("should handle an error and send a 500 response", () => {
    const mockProductId = 1;
    const mockError = new Error("An error occurred!");

    const mockRequest = {
      params: {
        product_id: mockProductId,
      },
    };

    pool.query.mockImplementationOnce((query, params, callback) => {
      expect(query).toBe(sql);
      expect(params).toEqual([mockProductId]);
      callback(mockError);
    });

    deleteProduct(mockRequest, mockResponse);

    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
  });
});
