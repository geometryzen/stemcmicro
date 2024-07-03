import { check } from "../src/check";

xdescribe("approxratio", function () {
    it("001", function () {
        check("approxratio(3.0000)", "3");
        check("approxratio(3.1000)", "28/9");
        check("approxratio(3.1400)", "22/7");
        check("approxratio(3.1410)", "223/71");
        check("approxratio(3.1415)", "311/99");
    });
});
