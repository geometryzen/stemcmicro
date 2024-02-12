import { check } from "./check";

describe("expcosh", function () {
    it("001", function () {
        check("expcosh(z)", "1/2*e**(-z)+1/2*e**z");
    });
});
