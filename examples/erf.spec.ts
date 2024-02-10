import { check } from "./check";

describe("erf", function () {
    it("001", function () {
        check("erf(1.0)", "0.842701...");
    });
});
