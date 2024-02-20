import { check } from "./check";

xdescribe("infixform", function () {
    it("Boo", function () {
        check("infixform(true)", `"true"`);
        check("infixform(false)", `"false"`);
        // check("infixform((x+1)**2)", `"1 + 2 x + x**2"`);
    });
    it("Rat", function () {
        check("infixform(1)", `"1"`);
        check("infixform(0)", `"0"`);
        check("infixform(-1)", `"-1"`);
    });
    it("Flt", function () {
        check("infixform(1.0)", `"1"`);
        check("infixform(0.0)", `"0"`);
        check("infixform(-1.0)", `"-1"`);
    });
    it("Sym", function () {
        check("infixform(x)", `"x"`);
        check("infixform(pi)", `"pi"`);
        check("infixform(exp(1))", `"exp(1)"`);
    });
    it("Imu", function () {
        check("infixform(sqrt(-1))", `"i"`);
    });
    it("Blade", function () {
        check("infixform(ex)", `"ex"`);
    });
    it("Err", function () {
        check('infixform(error("a"))', `"a"`);
    });
});
