import { check } from "../src/check";

describe("factorial", function () {
    it("001", function () {
        check("factorial(20)", "2432902008176640000");
        // check("factorial(e+1)/(e+1)", "??");
    });
});
