import { check } from "../src/check";

xdescribe("integral", function () {
    it("001", function () {
        check("integral(x**2,x)", "1/3*x**3");
    });
});
