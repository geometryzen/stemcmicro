import { check } from "../src/check";

describe("sqrt", function () {
    it("001", function () {
        check("sqrt(10!)", "7**(1/2)*720");
    });
});
