import { check } from "./check";

describe("coeff", function () {
    it("001", function () {
        check("coeff(a*x**2+b*x+c,x,0)", "c");
        check("coeff(a*x**2+b*x+c,x,1)", "b");
        check("coeff(a*x**2+b*x+c,x,2)", "a");
    });
});
