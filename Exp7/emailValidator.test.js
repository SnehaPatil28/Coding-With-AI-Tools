const { isValidEmail } = require("./emailValidator");

describe("isValidEmail()", () => {
  // Normal inputs
  test("accepts a valid email", () => {
    expect(isValidEmail("student@example.com")).toBe(true);
  });

  test("accepts an email with a subdomain", () => {
    expect(isValidEmail("user@mail.example.com")).toBe(true);
  });

  // Boundary cases
  test("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  test("rejects a whitespace-only string", () => {
    expect(isValidEmail("   ")).toBe(false);
  });

  // Invalid inputs
  test("rejects an email without @", () => {
    expect(isValidEmail("studentexample.com")).toBe(false);
  });

  test("rejects an email without a domain extension", () => {
    expect(isValidEmail("student@example")).toBe(false);
  });

  test("rejects an email containing spaces", () => {
    expect(isValidEmail("student @example.com")).toBe(false);
  });

  test("rejects null", () => {
    expect(isValidEmail(null)).toBe(false);
  });

  test("rejects a numeric input", () => {
    expect(isValidEmail(12345)).toBe(false);
  });
});
