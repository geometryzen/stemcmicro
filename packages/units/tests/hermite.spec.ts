import { check } from "../src/check";

describe("hermite", function () {
    it("001", function () {
        check("hermite(x,0)", "1");
        check("hermite(x,1)", "2*x");
        check("hermite(x,2)", "-2+4*x**2");
    });
});
