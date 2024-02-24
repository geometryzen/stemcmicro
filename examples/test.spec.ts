import { check } from "./check";

describe("test", function () {
    it("001", function () {
        check('test(true,  red, blue)', 'red');
        check('test(false, red, blue)', 'blue');
    });
});
