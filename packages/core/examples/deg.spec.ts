import { check } from "./check";

describe("degree", function () {
    it("001", function () {
        check("deg(a*x**2+b*x+c,x)", "2");
        check("deg(b*x+c,x)", "1");
        check("deg(c,x)", "0");
    });
});
