import { check } from "../src/check";

describe("broken", function () {
    it("001", function () {
        check("abs(x)", "abs(x)");
    });
});

describe("abs", function () {
    it("abs(x: rational)", function () {
        check("typeof(1)", "rational");
        check("abs(1)", "1");
        check("abs(0)", "0");
        check("abs(-1)", "1");
    });
    it("abs(x: number)", function () {
        check("typeof(1.0)", "number");
        check("abs(1.0)", "1.0");
        check("abs(0.0)", "0.0");
        check("abs(-1.0)", "1.0");
    });
    it("abs(x: symbol)", function () {
        check("typeof(x)", "symbol");
        check("abs(x)", "abs(x)");
    });
    it("abs(x: tensor", function () {
        check("typeof([x,y,z])", "tensor");
        check("abs([x,y,z])", "(x**2+y**2+z**2)**(1/2)");
    });
    it("abs(x: uom)", function () {
        check("typeof(second)", "uom");
        check("abs(second)", "s");
    });
    it("abs(x: blade)", function () {
        check("typeof(ex)", "blade");
        check("abs(ex)", "1");
    });
    it("abs(x+i*y)", function () {
        check(["i=sqrt(-1)", "i * i"], "-1");
        check(["i=sqrt(-1)", "abs(i)"], "1");
        check(["i=sqrt(-1)", "abs(x + i * y)"], "(x**2+y**2)**(1/2)");
    });
    it("abs(x*y*z)", function () {
        check(["abs(x*y*z)"], "abs(x)*abs(y)*abs(z)");
    });
    it("abs(1/x)", function () {
        check(["abs(1/x)"], "1/(abs(x))");
    });
});
