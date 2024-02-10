import { check } from "./check";

describe("expsinh", function () {
    xit("001", function () {
        check("expsinh(z)", "-1/2*exp(-z)+1/2*exp(z)");
    });
});
