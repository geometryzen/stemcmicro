import { check } from "../src/check";

xdescribe("transpose", function () {
    it("001", function () {
        check("transpose([[a,b],[c,d]])", "[[a,c],[b,d]]");
    });
});
