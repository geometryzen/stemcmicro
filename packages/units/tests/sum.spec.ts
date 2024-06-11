import { check } from "../src/check";

describe("sum", function () {
    it("001", function () {
        // check("sum([1,2,3,4])", "10");
        check("sum(x**j,j,1,5)", "x+x**2+x**3+x**4+x**5");
    });
});
