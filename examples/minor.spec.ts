import { check } from "./check";

describe("minor", function () {
    it("001", function () {
        check("minor([[1,2,3],[4,5,6],[7,8,9]],1,1)", "-3");
    });
});
