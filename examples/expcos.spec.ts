import { check } from "./check";

describe("expcos", function () {
    it("001", function () {
        check("expcos(z)", "1/2*exp(-i*z)+1/2*exp(i*z)");
    });
});
