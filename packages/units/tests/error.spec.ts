import { check } from "../src/check";

xdescribe("error", function () {
    it("construction", function () {
        check('error("Something is rotten in Denmark.")', "Something is rotten in Denmark.");
    });
    it("Err + Err", function () {
        check('error("a") + error("b")', "a");
    });
    it("Err * Err", function () {
        check('error("a") * error("b")', "a");
    });
    it("Err ** Err", function () {
        check('error("a") ** error("b")', "a");
    });
    it("Err + Boo", function () {
        check('error("a") + true', "a");
    });
    it("Boo + Err", function () {
        check('true + error("a")', `Operator '+' cannot be applied to types 'boolean' and 'error'.`);
    });
    it("Err + Blade", function () {
        check('error("a") + ex', "a");
    });
    it("Blade + Err", function () {
        check('ex + error("a")', "a");
    });
    it("Err + Flt", function () {
        check('error("a") + 1.0', "a");
    });
    it("Flt + Err", function () {
        check('1.0 + error("a")', "a");
    });
    it("Err + Rat", function () {
        check('error("a") + 1', "a");
    });
    it("Rat + Err", function () {
        check('1 + error("a")', "a");
    });
    it("Err + Sym", function () {
        check('error("a") + x', "a");
    });
    it("Sym + Err", function () {
        check('x + error("a")', "a");
    });
    it("Err + Imu", function () {
        check('error("a") + sqrt(-1)', "a");
    });
    it("Imu + Err", function () {
        check('sqrt(-1) + error("a")', "a");
    });
    it("Operator cannot be applied ...", function () {
        check("true * 23", `Operator '*' cannot be applied to types 'boolean' and 'rational'.`);
    });
    it("Property 0 does not exist on type 1.", function () {
        check("foobar(23)", `Property 'foobar' does not exist on type 'rational'.`);
    });
});
