import { describe, it, expect } from "@jest/globals";
import {
  toPaise,
  toRupees,
  formatINR,
  formatINRShort,
  calculateDiscountPercent,
  calculateTax,
  isValidPaise,
  GST_RATES,
} from "@/lib/money";

describe("Money & Currency Utilities (Paise arithmetic)", () => {
  describe("toPaise & toRupees", () => {
    it("converts rupees to paise accurately", () => {
      expect(toPaise(100)).toBe(10000);
      expect(toPaise(49.99)).toBe(4999);
      expect(toPaise(0)).toBe(0);
    });

    it("converts paise to rupees accurately", () => {
      expect(toRupees(10000)).toBe(100);
      expect(toRupees(4999)).toBe(49.99);
      expect(toRupees(0)).toBe(0);
    });
  });

  describe("formatINR", () => {
    it("formats paise into Indian Rupee string with symbol", () => {
      const formatted = formatINR(149900);
      // Clean non-breaking spaces if any from Intl
      expect(formatted.replace(/\s/g, " ")).toContain("1,499.00");
    });
  });

  describe("formatINRShort", () => {
    it("formats whole rupee amounts without decimal places", () => {
      const formatted = formatINRShort(150000);
      expect(formatted.replace(/\s/g, " ")).toContain("1,500");
    });
  });

  describe("calculateDiscountPercent", () => {
    it("computes accurate discount percentages", () => {
      expect(calculateDiscountPercent(100000, 80000)).toBe(20);
      expect(calculateDiscountPercent(200000, 150000)).toBe(25);
    });

    it("returns 0 if selling price is equal to or greater than MRP", () => {
      expect(calculateDiscountPercent(100000, 100000)).toBe(0);
      expect(calculateDiscountPercent(100000, 120000)).toBe(0);
    });

    it("returns 0 if MRP is 0 or negative", () => {
      expect(calculateDiscountPercent(0, 5000)).toBe(0);
    });
  });

  describe("calculateTax", () => {
    it("computes tax in paise correctly", () => {
      expect(calculateTax(100000, GST_RATES.GST_18)).toBe(18000); // 18% of ₹1000 = ₹180
      expect(calculateTax(50000, GST_RATES.GST_5)).toBe(2500); // 5% of ₹500 = ₹25
    });
  });

  describe("isValidPaise", () => {
    it("validates positive integers as valid paise", () => {
      expect(isValidPaise(0)).toBe(true);
      expect(isValidPaise(500)).toBe(true);
      expect(isValidPaise(100000)).toBe(true);
    });

    it("rejects floats or negative numbers", () => {
      expect(isValidPaise(-10)).toBe(false);
      expect(isValidPaise(10.5)).toBe(false);
      expect(isValidPaise(NaN)).toBe(false);
    });
  });
});
