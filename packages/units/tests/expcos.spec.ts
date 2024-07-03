import { check } from "../src/check";

xdescribe("expcos", function () {
    it("001", function () {
        check("expcos(z)", "1/2*e**(-i*z)+1/2*e**(i*z)");
    });
});
