import { check } from "../src/check";

xdescribe("contract", function () {
    it("001", function () {
        check("contract([[a,b],[c,d]])", "a+d");
    });
});
