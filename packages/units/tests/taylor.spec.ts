import { check } from "../src/check";

xdescribe("taylor", function () {
    it("001", function () {
        check("taylor(1/(1-x),x,5)", "1+x+x**2+x**3+x**4+x**5");
    });
});
