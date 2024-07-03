import { check } from "../src/check";

xdescribe("factor", function () {
    it("001", function () {
        check("factor(x**2-1, x)", "(1+x)*(-1+x)");
        check("factor(x^2-1, x)", "(1+x)*(-1+x)", { useCaretForExponentiation: true });
        check("factor(27)", "3**3");
        check("factor(56)", "2**3*7");
        check("factor(56)", "2**3*7", { language: "javascript" });
        check("factor(56)", "2**3*7", { language: "python" });
    });
});
