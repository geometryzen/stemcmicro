import { check } from "./check";

describe("degree", function () {
    it("001", function () {
        check("degree(a*x**2+b*x+c,x)", "2");
        check("degree(b*x+c,x)", "1");
        check("degree(c,x)", "0");
    });
});
