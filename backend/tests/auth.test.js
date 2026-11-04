const request = require("supertest");
const app = require("../app");

describe("API Đăng ký / Đăng nhập (Hotel System)", () => {
  const username = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const password = "SecurePassword@123";

  test("1. Đăng ký tài khoản thành công", async () => {
    const response = await request(app).post("/api/auth/register").send({ username, password });
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(username);
    expect(response.body.user.passwordHash).toBeUndefined(); // Chống lộ hash
  });

  test("2. Không cho đăng ký trùng tên", async () => {
    const response = await request(app).post("/api/auth/register").send({ username, password });
    expect(response.status).toBe(409);
  });

  test("3. Đăng nhập thành công", async () => {
    const response = await request(app).post("/api/auth/login").send({ username, password });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Đăng nhập thành công");
  });

  test("4. Từ chối mật khẩu sai", async () => {
    const response = await request(app).post("/api/auth/login").send({ username, password: "WrongPass123" });
    expect(response.status).toBe(401);
  });

  test("5. Từ chối mật khẩu quá ngắn (Dưới 8 ký tự)", async () => {
    const response = await request(app).post("/api/auth/register").send({ username: `short_${Date.now()}`, password: "123" });
    expect(response.status).toBe(400);
  });

  test("6. Từ chối tên đăng nhập chỉ chứa khoảng trắng", async () => {
    const response = await request(app).post("/api/auth/register").send({ username: "   ", password });
    expect(response.status).toBe(400);
  });

  test("7. Từ chối khi thiếu thông tin mật khẩu", async () => {
    const response = await request(app).post("/api/auth/register").send({ username: `missing_${Date.now()}` });
    expect(response.status).toBe(400);
  });
});