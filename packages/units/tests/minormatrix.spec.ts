import { check } from "../src/check";

describe("minormatrix", function () {
    it("001", function () {
        check("minormatrix([[1,2,3],[4,5,6],[7,8,9]],1,1)", "[[5,6],[8,9]]");
    });
});
