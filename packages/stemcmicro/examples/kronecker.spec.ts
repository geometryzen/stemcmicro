import { check } from "./check";

describe("kronecker", function () {
    it("001", function () {
        check("kronecker([[1,2],[3,4]],[[a,b],[c,d]])", "[[a,b,2*a,2*b],[c,d,2*c,2*d],[3*a,3*b,4*a,4*b],[3*c,3*d,4*c,4*d]]");
    });
});
