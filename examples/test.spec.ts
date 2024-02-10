import { check } from "./check";

describe("test", function () {
    it("001", function () {
        check('test(true,"yes","no")', '"yes"');
        check('test(false,"yes","no")', '"no"');
    });
});
