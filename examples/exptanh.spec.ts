import { check } from "./check";

describe("exptanh", function () {
    it("001", function () {
        check("exptanh(z)", "-1/(e**(2*z)+1)+e**(2*z)/(e**(2*z)+1)");
    });
});
