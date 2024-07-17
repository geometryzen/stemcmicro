import { check } from "../src/check";

xdescribe("leading", function () {
    it("001", function () {
        check("leading(a*x**2+b*x+c,x,0)", "a");
    });
});
