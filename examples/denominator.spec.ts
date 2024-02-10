import { check } from "./check";

describe("denominator", function () {
    it("001", function () {
        check("denominator(a/b)", "b");
    });
});
