import { check } from "../src/check";

describe("expsinh", function () {
    it("001", function () {
        check("expsinh(z)", "1/2*e**z-1/2*e**(-z)");
    });
});
