import { describe, it, expect } from "@jest/globals";
import {
  registerSchema,
  loginSchema,
  addressSchema,
  productSchema,
} from "@/lib/validation";

describe("Input Validation Schemas (Zod)", () => {
  describe("registerSchema", () => {
    it("validates valid registration payload", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "Password@123",
        confirmPassword: "Password@123",
        fullName: "Aarav Sharma",
        phone: "9876543210",
        acceptTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "Password@123",
        confirmPassword: "DifferentPassword@123",
        fullName: "Aarav Sharma",
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing acceptTerms", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "Password@123",
        confirmPassword: "Password@123",
        fullName: "Aarav Sharma",
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
    });

    it("rejects weak passwords", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "123",
        confirmPassword: "123",
        fullName: "Aarav Sharma",
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid emails", () => {
      const result = registerSchema.safeParse({
        email: "invalid-email",
        password: "Password@123",
        confirmPassword: "Password@123",
        fullName: "Aarav Sharma",
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
    });

    it("accepts passwords with at least 6 characters and tolerates phone normalization", () => {
      const result = registerSchema.safeParse({
        email: "bobys415@gmail.com",
        password: "password123",
        fullName: "Bobys",
        phone: "+91 9876543210",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe("9876543210");
        expect(result.data.acceptTerms).toBe(true);
      }
    });

    it("accepts registration when phone is empty string or omitted", () => {
      const result = registerSchema.safeParse({
        email: "bobys415@gmail.com",
        password: "mypassword",
        fullName: "Bobys User",
        phone: "",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBeUndefined();
      }
    });
  });

  describe("loginSchema", () => {
    it("validates valid login credentials", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "AnyPassword123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("addressSchema", () => {
    it("validates a compliant Indian delivery address with 6-digit PIN code", () => {
      const result = addressSchema.safeParse({
        fullName: "Vikram Malhotra",
        phone: "9876543210",
        addressLine1: "Flat 402, Sunshine Heights",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "400001",
        country: "India",
        addressType: "HOME",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid PIN codes", () => {
      const result = addressSchema.safeParse({
        fullName: "Vikram Malhotra",
        phone: "9876543210",
        addressLine1: "Flat 402",
        city: "Mumbai",
        state: "Maharashtra",
        pinCode: "123", // invalid length
      });
      expect(result.success).toBe(false);
    });
  });

  describe("productSchema", () => {
    it("validates valid product data", () => {
      const result = productSchema.safeParse({
        name: "Test Gadget Pro",
        categoryId: "cat_123",
        mrpPaise: 100000,
        sellingPricePaise: 80000,
      });
      expect(result.success).toBe(true);
    });
  });
});
