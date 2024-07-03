import { check } from "../src/check";

describe("mag", function () {
    it("001", function () {
        check("mag(x+sqrt(-1)*y)", "(x**2+y**2)**(1/2)");
    });
    it("002", function () {
        check("sqrt(-1)", "i");
        check("mag(sqrt(-1))", "1");
        check("mag(sqrt(-1)**0)", "1");
        check("mag(sqrt(-1)**1)", "1");
    });
    it("0023", function () {
        check("simplify(mag(exp(x+sqrt(-1)*y)))", "e**x");
    });
    it("Rat", function () {
        check("mag(1)", "1");
        check("mag(-1)", "1");
    });
    it("Flt", function () {
        check("mag(1.0)", "1.0");
        check("mag(-1.0)", "1.0");
    });
    it("Sym", function () {
        check("mag(x)", "x");
    });
    it("Uom", function () {
        check(["mag(kg)"], "kg");
    });
    xit("Tensor", function () {
        check(["mag([1])"], "[1]");
    });
});
