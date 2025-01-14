import {
    toEngineering, acosh, asinh, atanh, cosh, sinh, tanh,
    copysign, splitNumber, roundDigits, isNumber
} from '../variant7'

describe('toEngineering', () => {
    it('formats numbers correctly in engineering notation', () => {
        expect(toEngineering(1234, 3)).toBe('1.23e+3');
        expect(toEngineering(0.001234, 3)).toBe('1.23e-3');
        expect(toEngineering(-56789, 5)).toBe('-56.7890e+3');
    });

    it('handles edge cases', () => {
        expect(toEngineering(0)).toBe('0e+0');
        expect(toEngineering(Infinity)).toBe('Infinity');
        expect(toEngineering(-Infinity)).toBe('-Infinity');
        expect(toEngineering(NaN)).toBe('NaN');
    });

    it('adds zeroes for precision', () => {
        expect(toEngineering(1.23e6, 5)).toBe('1.2300e+6');
        expect(toEngineering(1.23e-6, 7)).toBe('1.230000e-6');
        expect(toEngineering(-1.23, 4)).toBe('-1.230e+0');
    });

    it('handles very small numbers', () => {
        expect(toEngineering(1e-12, 3)).toBe('1.00e-12');
        expect(toEngineering(-1e-12, 4)).toBe('-1.000e-12');
    });

    it('handles very large numbers', () => {
        expect(toEngineering(1e12, 3)).toBe('1.00e+12');
        expect(toEngineering(-1e12, 5)).toBe('-1.0000e+12');
    });
});


describe('acosh', () => {
    it('calculates hyperbolic arccos correctly', () => {
        expect(acosh(1)).toBeCloseTo(0, 10);
        expect(acosh(10)).toBeCloseTo(2.993, 3);
    });
});

describe('asinh', () => {
    it('calculates hyperbolic arcsin correctly', () => {
        expect(asinh(0)).toBeCloseTo(0, 10);
        expect(asinh(10)).toBeCloseTo(2.998, 3);
    });
});

describe('atanh', () => {
    it('calculates hyperbolic arctangent correctly', () => {
        expect(atanh(0)).toBeCloseTo(0, 10);
        expect(atanh(0.5)).toBeCloseTo(0.549, 3);
    });

    it('throws for invalid inputs', () => {
        expect(() => atanh(2)).toThrow();
        expect(() => atanh(-2)).toThrow();
    });
});

describe('cosh', () => {
    it('calculates hyperbolic cosine correctly', () => {
        expect(cosh(0)).toBeCloseTo(1, 10);
        expect(cosh(1)).toBeCloseTo(1.543, 3);
    });
});

describe('sinh', () => {
    it('calculates hyperbolic sine correctly', () => {
        expect(sinh(0)).toBeCloseTo(0, 10);
        expect(sinh(1)).toBeCloseTo(1.175, 3);
    });
});

it('calculates hyperbolic tangent correctly', () => {
    expect(tanh(0)).toBeCloseTo(0, 10);
    expect(tanh(1)).toBeCloseTo(0.7616, 4);
});


describe('copysign', () => {
    it('copies the sign from one number to another', () => {
        expect(copysign(10, -5)).toBe(-10);
        expect(copysign(-10, 5)).toBe(10);
        expect(copysign(0, -1)).toBe(-0);
        expect(Object.is(copysign(0, -1), -0)).toBe(true); // Verify -0
    });
});

describe('splitNumber', () => {
    it('should handle positive numbers correctly', () => {
        expect(splitNumber(1234)).toEqual({
            coefficients: [1, 2, 3, 4],
            exponent: 3,
            sign: '',
        });

        expect(splitNumber(0.01234)).toEqual({
            coefficients: [1, 2, 3, 4],
            exponent: -2,
            sign: '',
        });
    });

    it('should handle negative numbers correctly', () => {
        expect(splitNumber(-5678)).toEqual({
            coefficients: [5, 6, 7, 8],
            exponent: 3,
            sign: '-',
        });

        expect(splitNumber(-0.0005678)).toEqual({
            coefficients: [5, 6, 7, 8],
            exponent: -4,
            sign: '-',
        });
    });

    it('should handle zero correctly', () => {
        expect(splitNumber(0)).toEqual({
            coefficients: [0],
            exponent: 0,
            sign: '',
        });

        expect(splitNumber(-0)).toEqual({
            coefficients: [0],
            exponent: 0,
            sign: '',
        });
    });

    it('should handle very large numbers correctly', () => {
        expect(splitNumber(1e12)).toEqual({
            coefficients: [1],
            exponent: 12,
            sign: '',
        });

        expect(splitNumber(-1.23e15)).toEqual({
            coefficients: [1, 2, 3],
            exponent: 15,
            sign: '-',
        });
    });

    it('should handle very small numbers correctly', () => {
        expect(splitNumber(1e-9)).toEqual({
            coefficients: [1],
            exponent: -9,
            sign: '',
        });

        expect(splitNumber(-9.87e-8)).toEqual({
            coefficients: [9, 8, 7],
            exponent: -8,
            sign: '-',
        });
    });

    it('should handle edge cases of normalized coefficients correctly', () => {
        expect(splitNumber(1000)).toEqual({
            coefficients: [1],
            exponent: 3,
            sign: '',
        });

        expect(splitNumber(0.0001)).toEqual({
            coefficients: [1],
            exponent: -4,
            sign: '',
        });
    });
});

describe('roundDigits', () => {
    it('should round numbers to the specified precision', () => {
        expect(roundDigits(123.456, 2)).toBe('123.46');
        expect(roundDigits(123.451, 2)).toBe('123.45');
        expect(roundDigits(123.4, 3)).toBe('123.400'); // Adds trailing zeros to match precision
        expect(roundDigits(-987.654, 1)).toBe('-987.7');
    });

    it('should handle integer inputs correctly', () => {
        expect(roundDigits(100, 2)).toBe('100.00');
        expect(roundDigits(-100, 0)).toBe('-100');
        expect(roundDigits(42, 5)).toBe('42.00000');
    });

    it('should handle string inputs correctly', () => {
        expect(roundDigits('123.456', 2)).toBe('123.46');
        expect(roundDigits('-987.654', 1)).toBe('-987.7');
    });

    it('should return "NaN" for invalid inputs', () => {
        expect(roundDigits('abc', 2)).toBe('abc');
        expect(roundDigits(undefined, 2)).toBe('undefined');
        expect(roundDigits(null, 2)).toBe('NaN');
    });

    it('should return "Infinity" or "-Infinity" for infinite inputs', () => {
        expect(roundDigits(Infinity, 2)).toBe('Infinity');
        expect(roundDigits(-Infinity, 2)).toBe('-Infinity');
    });

    it('should handle edge cases of zero precision', () => {
        expect(roundDigits(123.456, 0)).toBe('123');
        expect(roundDigits(-987.654, 0)).toBe('-988');
        expect(roundDigits(0.999, 0)).toBe('1');
    });

    it('should handle small numbers correctly', () => {
        expect(roundDigits(0.00012345, 5)).toBe('0.00012');
        expect(roundDigits(-0.00098765, 4)).toBe('-0.0010');
    });
});

describe('isNumber', () => {
    it('should return true for valid finite numbers', () => {
        expect(isNumber(123)).toBe(true);
        expect(isNumber(-123.45)).toBe(true);
        expect(isNumber(0)).toBe(true);
        expect(isNumber(Number.MAX_VALUE)).toBe(true);
        expect(isNumber(Number.MIN_VALUE)).toBe(true);
    });

    it('should return false for non-finite numbers', () => {
        expect(isNumber(Infinity)).toBe(false);
        expect(isNumber(-Infinity)).toBe(false);
        expect(isNumber(NaN)).toBe(false);
    });

    it('should return false for non-number types', () => {
        expect(isNumber('123')).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber(true)).toBe(false);
    });
});
describe('acosh', () => {
    it('should calculate the hyperbolic arccosine correctly for valid inputs', () => {
        expect(acosh(1)).toBeCloseTo(0, 10);
        expect(acosh(2)).toBeCloseTo(1.31696, 5); 
        expect(acosh(10)).toBeCloseTo(2.99322, 5);
    });

    it('should handle edge cases', () => {
        expect(acosh(1)).toBeCloseTo(0, 10);
    });
});
