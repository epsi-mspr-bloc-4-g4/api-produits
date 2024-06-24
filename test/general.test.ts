import request from "supertest";
import app from "../src/app";

const baseURL = "http://localhost:7000";

describe("Product API Tests", () => {
  let createdProductId: number;

  const newProduct = {
    name: "Test Product",
    stock: 10,
    price: "19.99",
    description: "A test product description",
    color: "red"
  };

  it("should create a new product", async () => {
    const response = await request(app)
      .post(`${baseURL}/api/products`)
      .send(newProduct)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    createdProductId = response.body.id;
  });

  it("should retrieve a product by id", async () => {
    const response = await request(app)
      .get(`${baseURL}/api/products/${createdProductId}`)
      .expect(200);

    expect(response.body).toHaveProperty("name", newProduct.name);
    expect(response.body).toHaveProperty("stock", newProduct.stock);
    expect(response.body).toHaveProperty("price", newProduct.price);
    expect(response.body).toHaveProperty("description", newProduct.description);
    expect(response.body).toHaveProperty("color", newProduct.color);
  });
});