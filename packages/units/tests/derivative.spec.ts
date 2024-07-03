import { check } from "../src/check";

xdescribe("derivative", function () {
    it("001", function () {
        check("derivative(sin(x),x)", "cos(x)");
    });
});
