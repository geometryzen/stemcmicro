import { check } from "./check";

describe("arctan", function () {
    it("001", function () {
        check("arctan(1,0)", "1/2*pi");
    });
    it("001", function () {
        check("arctan(1,1)", "1/4*pi");
    });
});
