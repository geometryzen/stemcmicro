import { check } from "./check";

describe("abs", function () {
    it("001", function () {
        check("abs([x,y,z])", "(x**2+y**2+z**2)**(1/2)");
    });
});
