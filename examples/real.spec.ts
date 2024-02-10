import { check } from "./check";

describe("real", function () {
    it("001", function () {
        check("re(2-3*sqrt(-1))", "2");
    });
});
