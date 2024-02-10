import { check } from "./check";

describe("power", function () {
    it("001", function () {
        check("x**(-1/2)", "1/x**(1/2)");
    });
});
