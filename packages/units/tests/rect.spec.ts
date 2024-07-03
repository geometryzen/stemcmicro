import { check } from "../src/check";

xdescribe("rect", function () {
    it("001", function () {
        check("rect(exp(sqrt(-1)*x))", "cos(x)+i*sin(x)");
    });
});
