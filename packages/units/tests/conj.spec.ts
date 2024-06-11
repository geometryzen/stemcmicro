import { check } from "../src/check";

describe("conj", function () {
    it("001", function () {
        check("conj(2-3*sqrt(-1))", "2+3*i");
    });
});
