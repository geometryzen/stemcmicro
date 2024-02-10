import { check } from "./check";

describe("outer", function () {
    it("001", function () {
        check("outer([a,b,c],[x,y,z])", "[[a*x,a*y,a*z],[b*x,b*y,b*z],[c*x,c*y,c*z]]");
    });
});
