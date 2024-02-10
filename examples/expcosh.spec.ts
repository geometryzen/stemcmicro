import { check } from "./check";

describe("expcosh", function () {
    xit("001", function () {
        check("expcosh(z)", "1/2*exp(-z)+1/2*exp(z)");
    });
});
