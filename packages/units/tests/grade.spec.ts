import { check } from "../src/check";

describe("grade", function () {
    it("Flt", function () {
        check("grade(5.0,0)", "5.0");
        check("grade(5.0,1)", "0.0");
        check("grade(5.0,2)", "0.0");
    });
    it("Rat", function () {
        check("grade(5,0)", "5");
        check("grade(5,1)", "0");
        check("grade(5,2)", "0");
    });
    it("Sym", function () {
        check("grade(x,0)", "x");
        check("grade(x,1)", "0");
        check("grade(x,2)", "0");
    });
});
