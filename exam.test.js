const { splitNumber } = require("./libs/variant5");

describe("splitNumber", () => {
  it("should correctly split a positive integer", () => {
    const result = splitNumber(12345);
    expect(result).toEqual({
      sign: '',
      coefficients: [1, 2, 3, 4, 5],
      exponent: 4,
    });
  });

  it("should correctly split a negative integer", () => {
    const result = splitNumber(-67890);
    expect(result).toEqual({
      sign: '-',
      coefficients: [6, 7, 8, 9], // Без 0 в кінці
      exponent: 4,
    });
  });

  it("should correctly split a positive decimal number", () => {
    const result = splitNumber(0.0123);
    expect(result).toEqual({
      sign: '',
      coefficients: [1, 2, 3],
      exponent: -2,
    });
  });

  it("should correctly split a negative decimal number", () => {
    const result = splitNumber(-0.00456);
    expect(result).toEqual({
      sign: '-',
      coefficients: [4, 5, 6],
      exponent: -3,
    });
  });

  it("should handle zero correctly", () => {
    const result = splitNumber(0);
    expect(result).toEqual({
      sign: '',
      coefficients: [0],
      exponent: 0,
    });
  });

  it("should throw an error for invalid input", () => {
    expect(() => splitNumber("abc")).toThrow(SyntaxError);
    expect(() => splitNumber(null)).toThrow(SyntaxError);
    expect(() => splitNumber(undefined)).toThrow(SyntaxError);
  });

  it("should correctly handle scientific notation", () => {
    const result = splitNumber("3.14e+5");
    expect(result).toEqual({
      sign: '',
      coefficients: [3, 1, 4],
      exponent: 5,
    });

    const negativeExponent = splitNumber("1.23e-4");
    expect(negativeExponent).toEqual({
      sign: '',
      coefficients: [1, 2, 3],
      exponent: -4,
    });
  });
});
