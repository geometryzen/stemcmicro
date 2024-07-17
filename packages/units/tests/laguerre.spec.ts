import { check } from "../src/check";

xdescribe("laguerre", function () {
    it("001", function () {
        check("laguerre(x,1)", "1-x");
        check("laguerre(x,2)", "1-2*x+1/2*x**2");
    });
});
