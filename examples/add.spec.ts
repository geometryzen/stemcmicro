import { SyntaxKind } from "../src/parser/parser";
import { check } from "./check";

describe("add", function () {
    it("001", function () {
        check("1+2+3+4+5", "15");
        check("(+ 1 2 3 4 5)", "15", { syntaxKind: SyntaxKind.ClojureScript });
        check("(+ 1 2)", "3", { syntaxKind: SyntaxKind.ClojureScript });
        check("(+ 1)", "1", { syntaxKind: SyntaxKind.ClojureScript });
        check("(+)", "0", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("Blade, Blade", function () {
        check("ex + ex", "2*ex");
        // check("ex + ey", "ex + ey");
    });
});
