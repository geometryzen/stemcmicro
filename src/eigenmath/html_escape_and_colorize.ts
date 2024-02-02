export enum ColorCode {
    BLACK = 1,
    BLUE = 2,
    RED = 3
}

export function html_escape_and_colorize(s: string, color: ColorCode): string {
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/\r/g, "");

    switch (color) {
        case ColorCode.BLACK: {
            s = "<span style='color:black;font-family:courier'>" + s + "</span>";
            break;
        }
        case ColorCode.BLUE: {
            s = "<span style='color:blue;font-family:courier'>" + s + "</span>";
            break;
        }
        case ColorCode.RED: {
            s = "<span style='color:red;font-family:courier'>" + s + "</span>";
            break;
        }
    }
    return s;
}
