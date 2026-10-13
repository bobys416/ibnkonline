import { describe, it, expect } from "@jest/globals";
import {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  verifyAccessToken,
} from "@/lib/auth";

describe("Auth Utilities (Hashing & JWT Tokens)", () => {
  describe("Password Hashing & Verification", () => {
    it("hashes password and verifies it successfully", async () => {
      const password = "SecurePassword@2026";
      const hash = await hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2")).toBe(true);

      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword("WrongPassword123", hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe("Access Token Lifecycle", () => {
    it("generates and verifies a valid JWT access token", () => {
      const payload = {
        userId: "user_test_123",
        email: "test@buymecart.com",
        roles: ["customer", "admin"],
      };

      const token = generateAccessToken(payload);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const decoded = verifyAccessToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(payload.userId);
      expect(decoded?.email).toBe(payload.email);
      expect(decoded?.roles).toEqual(expect.arrayContaining(["customer", "admin"]));
    });

    it("returns null for malformed or forged tokens", () => {
      expect(verifyAccessToken("invalid.token.structure")).toBeNull();
      expect(verifyAccessToken("")).toBeNull();
    });
  });
});
