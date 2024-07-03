import { check } from "../src/check";

describe("simplify", function () {
    it("Blade", function () {
        check("simplify(ex)", "ex");
    });
    it("Boo", function () {
        check("simplify(true)", "true");
        check("simplify(false)", "false");
    });
    it("Err", function () {
        check("simplify(error(a))", "a");
    });
    it("Flt", function () {
        check("simplify(3.0)", "3.0");
    });
    it("Hyp", function () {
        check("simplify(differential(x))", "dx");
    });
    it("Imu", function () {
        check("simplify(sqrt(-1))", "i");
    });
    it("Pi", function () {
        check("simplify(pi)", "pi");
    });
    it("Rat", function () {
        check("simplify(23)", "23");
    });
    it("Sym", function () {
        check("simplify(x)", "x");
    });
    it("Tensor", function () {
        check("simplify([x])", "[x]");
    });
    it("Uom", function () {
        check("simplify(kilogram)", "kg");
    });
    it("cos squared plus sin squared", function () {
        check("simplify(cos(x)**2+sin(x)**2)", "1");
    });
});
