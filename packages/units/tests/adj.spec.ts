import { check } from "../src/check";

describe("adj", function () {
    it("001", function () {
        check("adj([[a,b],[c,d]])", "[[d,-b],[-c,a]]");
    });
});
