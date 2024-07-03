import { check } from "../src/check";

xdescribe("power", function () {
    it("pow(Blade, Rat)", function () {
        check("ex**2", "1");
        check("ex**1", "ex");
        check("ex**0", "1");
        check("ex**-1", "ex");
        check("(ex^ey)**-1", "-ex^ey");
        check("(ex^ey^ez)**-1", "-ex^ey^ez");
        check("ex**-2", "1");
        check("ex**(2/3)", "1**(1/3)");
        check("ex**(1/5)", "ex**(1/5)");
        check("ex**(3/5)", "ex**(1/5)");
    });
    it("pow(Flt, Flt)", function () {
        check("2.0**3.0", "8.0");
    });
    it("pow(Flt, Rat)", function () {
        check("2.0**3", "8.0");
    });
    it("pow(Flt, Sym)", function () {
        check("2.0**x", "2.0**x");
    });
    it("pow(Rat, Sym)", function () {
        check("2**x", "2**x");
    });
    it("pow(Sym, Rat)", function () {
        check("x**(-1/2)", "1/x**(1/2)");
    });
});
