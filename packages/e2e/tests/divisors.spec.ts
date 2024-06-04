import { check } from "./check";

describe("divisors", function () {
    it("001", function () {
        check("divisors(a*b*c)", "[1,a,b,c,b*c,a*c,a*b,a*b*c]");
    });
});
