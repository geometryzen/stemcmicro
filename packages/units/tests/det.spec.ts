import { check } from "../src/check";

xdescribe("det", function () {
    it("001", function () {
        check("det([[a,b],[c,d]])", "a*d-b*c");
    });
});
