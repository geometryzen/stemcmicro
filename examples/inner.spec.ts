import { check } from "./check";

describe("inner", function () {
    it("001", function () {
        check("inner([[a,b],[c,d]],[x,y])", "[a*x+b*y,c*x+d*y]");
    });
});
