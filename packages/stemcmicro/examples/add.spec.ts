import { UndeclaredVars } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { check, CheckConfig } from "./check";

describe("add", function () {
    it("identity", function () {
        check("(+)", "0", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("singleton", function () {
        check("(+ 1)", "1", { syntaxKind: SyntaxKind.ClojureScript });
        check("(+ (* 2 3))", "6", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("two", function () {
        check("(+ 1 2)", "3", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("three", function () {
        check("(+ 1 2 3)", "6", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("four", function () {
        check("(+ 1 2 3 4)", "10", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("five", function () {
        check("1+2+3+4+5", "15");
        check("(+ 1 2 3 4 5)", "15", { syntaxKind: SyntaxKind.ClojureScript });
    });
    it("Blade, Blade", function () {
        check("ex + ex", "2*ex");
        check("ex + ey", "ex+ey");
    });
    it("Associativity", function () {
        const options: Partial<CheckConfig> = {
            syntaxKind: SyntaxKind.ClojureScript,
            allowUndeclaredVars: UndeclaredVars.Nil
        };
        check("(+ a (* -1 b))", "a-b", options);
        check("(+ a (* -1 b) (* -1 c))", "a-b-c", options);
        check('("a" + "b") + "c"', '"abc"');
        check(' "b" + "a" ', '"ba"');
        check("(a + b) + c", "a+b+c");
    });
    it("Flatten", function () {
        check("(a-b)-c", "a-b-c");
    });
    it("Probe", function () {
        check("a+b*(c+d)", "a+b*c+b*d");
    });
    it("Probe", function () {
        check("a+b*(c+(d+e))", "a+b*c+b*d+b*e");
    });
    it("Rat+Boo", function () {
        check("2+true", `Operator '+' cannot be applied to types 'rational' and 'boolean'.`);
        check("2+false", `Operator '+' cannot be applied to types 'rational' and 'boolean'.`);
    });
    it("Boo+Rat", function () {
        check("true+2", `Operator '+' cannot be applied to types 'boolean' and 'rational'.`);
        check("false+2", `Operator '+' cannot be applied to types 'boolean' and 'rational'.`);
    });
    it("Flt+Boo", function () {
        check("2.0+true", `Operator '+' cannot be applied to types 'number' and 'boolean'.`);
        check("2.0+false", `Operator '+' cannot be applied to types 'number' and 'boolean'.`);
    });
    it("Boo+Flt", function () {
        check("true+2.0", `Operator '+' cannot be applied to types 'boolean' and 'number'.`);
        check("false+2.0", `Operator '+' cannot be applied to types 'boolean' and 'number'.`);
    });
    it("Rat+Flt", function () {
        check("2+3.0", "5.0");
    });
    it("Flt+Rat", function () {
        check("2.0+3", "5.0");
    });
});
