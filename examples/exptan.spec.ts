import { check } from "./check";

describe("exptan", function () {
    it("001", function () {
        check("exptan(z)", "i/(e**(2*z*i)+1)-i*e**(2*z*i)/(e**(2*z*i)+1)");
    });
});
