import { check } from "../src/check";

describe("floor", function () {
    it("001", function () {
        check("floor(1/2)", "0");
    });
});
