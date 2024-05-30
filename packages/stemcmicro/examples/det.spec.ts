import { check } from "./check";

describe("det", function () {
    it("001", function () {
        check("det([[a,b],[c,d]])", "a*d-b*c");
    });
});
