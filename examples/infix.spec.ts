import { check } from "./check";

xdescribe("infix", function () {
    it("Boo", function () {
        check("infix(true)", `true`);
        check("infix(false)", `false`);
        // check("infix((x+1)**2)", `"1 + 2 x + x**2"`);
    });
    it("Blade", function () {
        check("infix(ex)", `ex`);
    });
    it("Err", function () {
        check('infix(error(a))', `a`);
    });
    it("Flt", function () {
        check("infix(1.0)", `1`);
        check("infix(0.0)", `0`);
        check("infix(-1.0)", `-1`);
    });
    it("Hyp", function () {
        check('infix(differential(x))', `dx`);
    });
    it("Imu", function () {
        check("infix(sqrt(-1))", `i`);
    });
    it("Pi", function () {
        check("infix(pi)", `pi`);
    });
    it("Rat", function () {
        check("infix(1)", `1`);
        check("infix(0)", `0`);
        check("infix(-1)", `-1`);
    });
    it("Sym", function () {
        check("infix(x)", `x`);
        check("infix(pi)", `pi`);
        check("infix(exp(1))", `exp(1)`);
    });
    it("Tensor", function () {
        check("infix([[a,b],[c,d]])", `[[a,b],[c,d]]`);
    });
    it("Uom", function () {
        check("infix(meter)", `m`);
        check("infix(kilogram)", `kg`);
        check("infix(second)", `s`);
    });
    it("Expression", function () {
        check("infix((x+1)**2)", `1 + 2 x + x**2`);
    });
});
