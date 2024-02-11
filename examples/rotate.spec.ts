import { check } from "./check";

describe("rotate", function () {
    it("001", function () {
        check("rotate([1,0,0,0],H,0)", "[2**(1/2),2**(1/2),0,0]");
    });
});
