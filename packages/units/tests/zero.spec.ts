import { check } from "../src/check";

describe("zero", function () {
    it("001", function () {
        check("zero(3,3)", "[[0,0,0],[0,0,0],[0,0,0]]");
    });
});
