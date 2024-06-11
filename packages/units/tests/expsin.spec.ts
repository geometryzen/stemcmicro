import { check } from "../src/check";

describe("expsin", function () {
    it("001", function () {
        check("expsin(z)", "1/2*i*e**(-i*z)-1/2*i*e**(i*z)");
    });
});
