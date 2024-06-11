import { check } from "../src/check";

describe("mod", function () {
    it("001", function () {
        check("mod(5,3/8)", "1/8");
    });
});
