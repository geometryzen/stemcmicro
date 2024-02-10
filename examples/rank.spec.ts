import { check } from "./check";

describe("rank", function () {
    it("001", function () {
        check("rank([[a,b],[c,d]])", "2");
    });
});
