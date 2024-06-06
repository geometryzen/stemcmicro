import { check } from "./check";

describe("dot", function () {
    it("001", function () {
        check("dot(inv([[1,2],[3,4]]),[5,6])", "[-4,9/2]");
    });
});
