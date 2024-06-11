import { check } from "../src/check";

describe("dim", function () {
    it("001", function () {
        check("dim([[1,2],[3,4],[5,6]],1)", "3");
    });
});
