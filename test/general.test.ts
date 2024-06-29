import request from "supertest";
import app from "../src/app";

describe("Product API Tests", () => {
  let createdProductId: number;

  const newProduct = {
    name: "Test Product",
    stock: 10,
    details: {
      price: "19.99",
      description: "A test product description",
      color: "red",
    },
  };

  it("should create a new product", async () => {
    const response = await request(app)
      .post(`/api/products`)
      .send(newProduct)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    createdProductId = response.body.id;
  });

  it("should retrieve a product by id", async () => {
    const response = await request(app)
      .get(`/api/products/${createdProductId}`)
      .expect(200);

    expect(response.body).toHaveProperty("name", newProduct.name);
    expect(response.body).toHaveProperty("stock", newProduct.stock);
    expect(response.body).toHaveProperty("details");
    expect(response.body.details).toHaveProperty("price", newProduct.details.price);
    expect(response.body.details).toHaveProperty("description", newProduct.details.description);
    expect(response.body.details).toHaveProperty("color", newProduct.details.color);
  });
});