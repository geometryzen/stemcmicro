import { check } from "./check";

describe("multiply", function () {
    it("Blade * Blade", function () {
        check("ex * ex", "1");
        check("ex * ey", "ex^ey");
    });
    it("Blade * Err", function () {
        check("ex*error(a)", "a");
    });
    it("Blade * Flt", function () {
        check("ex * 2.0", "2.0*ex");
        check("ex * 1.0", "1.0*ex");
        check("ex * 0.0", "0.0");
    });
    it("Blade * Hyp", function () {
        check("ex*differential(x)", "dx*ex");
    });
    it("Blade * Imu", function () {
        check("ex*sqrt(-1)", "i*ex");
    });
    it("Blade * Pi", function () {
        check("ex*pi", "pi*ex");
    });
    it("Blade * Rat", function () {
        check("ex * 2", "2*ex");
        check("ex * 1", "ex");
        check("ex * 0", "0");
    });
    it("Blade * Sym", function () {
        check("ex*x", "x*ex");
    });
    it("Blade * Tensor", function () {
        check("ex * [ey]", "[ex^ey]");
    });
    it("Blade * Uom", function () {
        check("ex * meter", "ex*m");
    });
    it("Err * Blade", function () {
        check("error(a) * ex", "a");
    });
    it("Err * Err", function () {
        check("error(a) * error(b)", "a");
    });
    it("Err * Flt", function () {
        check("error(a) * 2.0", "a");
        check("error(a) * 1.0", "a");
        check("error(a) * 0.0", "a");
    });
    it("Err * Hyp", function () {
        check("error(a) * differential(x)", "a");
    });
    it("Err * Imu", function () {
        check("error(a) * sqrt(-1)", "a");
    });
    it("Err * Pi", function () {
        check("error(a) * pi", "a");
    });
    it("Err * Rat", function () {
        check("error(a) * 2", "a");
        check("error(a) * 1", "a");
        check("error(a) * 0", "a");
    });
    it("Err * Sym", function () {
        check("error(a) * x", "a");
    });
    it("Err * Tensor", function () {
        check("error(a) * [x]", "a");
    });
    it("Err * Uom", function () {
        check("error(a) * kilogram", "a");
    });
    it("Flt * Blade", function () {
        check("2.0 * ex", "2.0*ex");
        check("1.0 * ex", "1.0*ex");
        check("0.0 * ex", "0.0");
    });
    it("Flt * Err", function () {
        check("2.0 * error(3)", "3");
        check("1.0 * error(3)", "3");
        check("0.0 * error(3)", "3");
    });
    it("Flt * Flt", function () {
        check("2.0 * 3.0", "6.0");
        check("1.0 * 3.0", "3.0");
        check("0.0 * 3.0", "0.0");
    });
    it("Flt * Hyp", function () {
        check("2.0 * differential(x)", "2.0*dx");
        check("1.0 * differential(x)", "1.0*dx");
        check("0.0 * differential(x)", "0.0");
    });
    it("Flt * Imu", function () {
        check("2.0 * sqrt(-1)", "2.0*i");
        check("1.0 * sqrt(-1)", "1.0*i");
        check("0.0 * sqrt(-1)", "0.0");
    });
    it("Flt * Pi", function () {
        check("2.0 * pi", "2.0*pi");
        check("1.0 * pi", "1.0*pi");
        check("0.0 * pi", "0.0");
    });
    it("Flt * Rat", function () {
        check("2.0 * 3", "6.0");
        check("1.0 * 3", "3.0");
        check("0.0 * 3", "0.0");
        check("2.0 * 0", "0.0");
        check("1.0 * 0", "0.0");
        check("0.0 * 0", "0.0");
    });
    it("Flt * Sym", function () {
        check("2.0 * x", "2.0*x");
        check("1.0 * x", "1.0*x");
        check("0.0 * x", "0.0");
    });
    it("Flt * Tensor", function () {
        check("2.0 * [x]", "[2.0*x]");
        check("1.0 * [x]", "[1.0*x]");
        check("0.0 * [x]", "[0.0]");
    });
    it("Flt * Uom", function () {
        check("2.0 * joule", "2.0*J");
        check("1.0 * joule", "1.0*J");
        check("0.0 * joule", "0.0");
    });
    it("Hyp * Blade", function () {
        check("differential(x) * ex", "dx*ex");
    });
    it("Hyp * Err", function () {
        check("differential(x) * error(a)", "a");
    });
    it("Hyp * Flt", function () {
        check("differential(x) * -1.0", "-dx");
        check("differential(x) * 0.0", "0.0");
        check("differential(x) * 1.0", "1.0*dx");
        check("differential(x) * 2.0", "2.0*dx");
    });
    it("Hyp * Hyp", function () {
        check("differential(x) * differential(y)", "dx*dy");
    });
    it("Hyp * Imu", function () {
        check("differential(x) * sqrt(-1)", "i*dx");
    });
    it("Hyp * Pi", function () {
        check("differential(x) * pi", "pi*dx");
    });
    it("Hyp * Rat", function () {
        check("differential(x) * -1", "-dx");
        check("differential(x) * 0", "0");
        check("differential(x) * 1", "dx");
        check("differential(x) * 2", "2*dx");
    });
    it("Hyp * Sym", function () {
        check("differential(x) * s", "s*dx");
    });
    it("Hyp * Tensor", function () {
        check("differential(x) * [s]", "[s*dx]");
    });
    it("Hyp * Tensor", function () {
        check("differential(x) * [s]", "[s*dx]");
    });
    it("Hyp * Uom", function () {
        check("differential(x) * kilogram", "dx*kg");
    });
    it("Imu * Blade", function () {
        check("sqrt(-1)*ex", "i*ex");
    });
    it("Imu * Err", function () {
        check("sqrt(-1)*error(a)", "a");
    });
    it("Imu * Flt", function () {
        check("sqrt(-1) * 2.0", "2.0*i");
        check("sqrt(-1) * 1.0", "1.0*i");
        check("sqrt(-1) * 0.0", "0.0");
    });
    it("Imu * Hyp", function () {
        check("sqrt(-1) * differential(x)", "i*dx");
    });
    it("Imu * Imu", function () {
        check("sqrt(-1) * sqrt(-1)", "-1");
    });
    it("Imu * Pi", function () {
        check("sqrt(-1) * pi", "i*pi");
    });
    it("Imu * Rat", function () {
        check("sqrt(-1) * 2", "2*i");
        check("sqrt(-1) * 1", "i");
        check("sqrt(-1) * 0", "0");
    });
    it("Imu * Sym", function () {
        check("sqrt(-1) * x", "i*x");
    });
    it("Imu * Tensor", function () {
        check("sqrt(-1) * [kilogram]", "[i*kg]");
    });
    it("Imu * Uom", function () {
        check("sqrt(-1) * kilogram", "i*kg");
    });
    it("Pi * Blade", function () {
        check("pi * ex", "pi*ex");
    });
    it("Pi * Err", function () {
        check("pi * error(a)", "a");
    });
    it("Pi * Flt", function () {
        check("pi * 7.0/22.0", "0.999598...");
    });
    it("Pi * Hyp", function () {
        check("pi * differential(x)", "pi*dx");
    });
    it("Pi * Imu", function () {
        check("pi * sqrt(-1)", "i*pi");
    });
    it("Pi * Pi", function () {
        check("pi * pi", "pi**2");
    });
    it("Pi * Rat", function () {
        check("pi * 7/22", "7/22*pi");
    });
    it("Pi * Sym", function () {
        check("pi * x", "pi*x");
    });
    it("Pi * Tensor", function () {
        check("pi * [x]", "[pi*x]");
    });
    it("Pi * Uom", function () {
        check("pi * joule", "pi*J");
    });
    it("Rat * Blade", function () {
        check("2 * ex", "2*ex");
        check("1 * ex", "ex");
        check("0 * ex", "0");
    });
    it("Rat * Err", function () {
        check("2 * error(3)", "3");
        check("1 * error(3)", "3");
        check("0 * error(3)", "3");
    });
    it("Rat * Flt", function () {
        check("2 * 3.0", "6.0");
        check("2 * -3.0", "-6.0");
    });
    it("Rat * Hyp", function () {
        check("-1 * differential(x)", "-dx");
        check("0 * differential(x)", "0");
        check("1 * differential(x)", "dx");
        check("2 * differential(x)", "2*dx");
    });
    it("Rat * Imu", function () {
        check("2 * sqrt(-1)", "2*i");
        check("1 * sqrt(-1)", "i");
        check("0 * sqrt(-1)", "0");
    });
    it("Rat * Pi", function () {
        check("2 * pi", "2*pi");
    });
    it("Rat * Rat", function () {
        check("2 * 3", "6");
        check("2 * -3", "-6");
    });
    it("Rat * Sym", function () {
        check("2 * x", "2*x");
    });
    it("Rat * Tensor", function () {
        check("2 * [x]", "[2*x]");
        check("1 * [x]", "[x]");
        check("0 * [x]", "[0]");
    });
    it("Rat * Uom", function () {
        check("5 * second", "5*s");
        check("1 * second", "s");
        check("0 * second", "0");
    });
    it("Sym * Blade", function () {
        check("x * ex", "x*ex");
    });
    it("Sym * Err", function () {
        check('x * error("a")', "a");
    });
    it("Sym * Flt", function () {
        check("x * 2.0", "2.0*x");
        check("x * 1.0", "1.0*x");
        check("x * 0.0", "0.0");
        check("x * -1.0", "-x"); // issue with print_multiply_when_no_denominators
    });
    it("Sym * Hyp", function () {
        check("x * differential(x)", "x*dx");
    });
    it("Sym * Imu", function () {
        check("x * sqrt(-1)", "i*x");
    });
    it("Sym * Pi", function () {
        check("x * pi", "pi*x");
    });
    it("Sym * Rat", function () {
        check("x * 2", "2*x");
        check("x * 1", "x");
        check("x * 0", "0");
        check("x * -1", "-x");
    });
    it("Sym * Tensor", function () {
        check("x * [1]", "[x]");
    });
    it("Sym * Uom", function () {
        check("x * kilogram", "x*kg");
    });
    it("Tensor * Blade", function () {
        check("[ex] * ey", "[ex^ey]");
    });
    it("Tensor * Err", function () {
        check("[ex] * error(a)", "a");
    });
    it("Tensor * Flt", function () {
        check("[x] * 2.0", "[2.0*x]");
        check("[x] * 1.0", "[1.0*x]");
        check("[x] * 0.0", "[0.0]");
    });
    it("Tensor * Hyp", function () {
        check("[ex] * differential(x)", "[dx*ex]");
    });
    it("Tensor * Imu", function () {
        check("[ex] * sqrt(-1)", "[i*ex]");
    });
    it("Tensor * Pi", function () {
        check("[ex] * pi", "[pi*ex]");
    });
    it("Tensor * Rat", function () {
        check("[x] * 2", "[2*x]");
        check("[x] * 1", "[x]");
        check("[x] * 0", "[0]");
    });
    it("Tensor * Sym", function () {
        check("[1] * x", "[x]");
    });
    it("Tensor * Tensor", function () {
        check("[[a]] * [[b]]", "[[a*b]]"); // CHeck [a] * [b]
    });
    it("Tensor * Uom", function () {
        check("[x] * kilogram", "[x*kg]");
    });
    it("Uom * Blade", function () {
        check("meter * ex", "ex*m");
    });
    it("Uom * Err", function () {
        check("meter * error(a)", "a");
    });
    it("Uom * Flt", function () {
        check("meter * 2.0", "2.0*m");
        check("meter * 1.0", "1.0*m");
        check("meter * 0.0", "0.0");
    });
    it("Uom * Hyp", function () {
        check("kilogram * differential(x)", "dx*kg");
    });
    it("Uom * Imu", function () {
        check("kilogram * sqrt(-1)", "i*kg");
    });
    it("Uom * Pi", function () {
        check("kilogram * pi", "pi*kg");
    });
    it("Uom * Rat", function () {
        check("meter * 2", "2*m");
        check("meter * 1", "m");
        check("meter * 0", "0");
    });
    it("Uom * Sym", function () {
        check("kilogram * x", "x*kg");
    });
    it("Uom * Tensor", function () {
        check("kilogram * [x]", "[x*kg]");
    });
    it("Uom * Uom", function () {
        check("meter * meter", "m ** 2");
        check("newton * meter", "J");
    });
});
