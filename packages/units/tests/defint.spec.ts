import { check } from "../src/check";

describe("defint", function () {
    it("constant", function () {
        check("defint(a,x,0,1)", "a");
    });
    it("x", function () {
        check("defint(a*x,x,0,1)", "1/2*a");
    });
    it("x**2", function () {
        check("defint(a*x**2,x,0,1)", "1/3*a");
    });
    it("x**2", function () {
        check("defint(a*x**2,x,0,1)", "1/3*a");
    });
    xit("BUG", function () {
        // check("defint((1+cos(theta)^2)*sin(theta), theta, 0, pi, phi, 0, 2, pi)", "16/3*pi", { syntaxKind: SyntaxKind.Eigenmath, useCaretForExponentiation: true });
    });
});
