import { check } from "../src/check";

describe("quotient", function () {
    it("001", function () {
        check("quotient(a*x**3,b*x**2,x)", "a*x/b");
    });
});
