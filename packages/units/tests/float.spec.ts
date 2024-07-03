import { check } from "../src/check";

describe("float", function () {
    it("Blade", function () {
        check("float(ex)", "ex");
        check("float(ey)", "ey");
        check("float(ez)", "ez");
    });
    it("Err", function () {
        check("float(error(a))", "a");
    });
    it("Hyp", function () {
        check("float(differential(x))", "dx");
    });
    it("Imu", function () {
        check("float(sqrt(-1))", "i");
    });
    it("Pi", function () {
        check("float(pi)", "3.141593...");
    });
    it("Rat", function () {
        check("float(5)", "5.0");
        check("float(1)", "1.0");
        check("float(0)", "0.0");
    });
    it("Sym", function () {
        check("float(x)", "x");
    });
    it("Tensor", function () {
        check("float([1])", "[1.0]");
    });
    it("Uom", function () {
        check("float(kilogram)", "kg");
    });
});
