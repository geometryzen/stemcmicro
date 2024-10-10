import { check } from "../src/check";

describe("laguerre", function () {
    it("001", function () {
        check("laguerre(x,1)", "1-x");
        // check("laguerre(x,2)", "1-2*x+1/2*x**2");
        check("laguerre(x,2)", "1/2*(-1+(1-x)*(3-x))");
    });
});
