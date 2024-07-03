import { check } from "../src/check";

describe("exptan", function () {
    it("001", function () {
        check("exptan(z)", "-i*e**(2*i*z)/(1+e**(2*i*z))+i/(1+e**(2*i*z))");
    });
});
