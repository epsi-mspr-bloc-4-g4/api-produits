import request from "supertest";
import app from "../src/app";

describe("Product API Tests", () => {
  let createdProductId: number;

  const newProduct = {
    name: "Test Product",
    stock: 10,
    price: "19.99",
    description: "A test product description",
    color: "red",
    };

  it("should create a new product", async () => {
    const response = await request(app)
      .post(`/api/products`)
      .send(newProduct)
      .expect(200);

    expect(response.body).toContain("bien");
    createdProductId = parseInt(response.body.split(" ")[4]);
  });

  it("should retrieve a product by id", async () => {
    const response = await request(app)
      .get(`/api/products/${createdProductId}`)
      .expect(200);

    expect(response.body).toHaveProperty("name", newProduct.name);
    expect(response.body).toHaveProperty("stock", newProduct.stock);
    expect(response.body.details).toHaveProperty("price", newProduct.price);
    expect(response.body.details).toHaveProperty("description", newProduct.description);
    expect(response.body.details).toHaveProperty("color", newProduct.color);
  });
});