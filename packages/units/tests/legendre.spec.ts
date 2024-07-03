import { check } from "../src/check";

describe("legendre", function () {
    it("001", function () {
        check("legendre(x,0)", "1");
        check("legendre(x,1)", "x");
        check("legendre(x,2)", "-1/2+3/2*x**2");
    });
});
