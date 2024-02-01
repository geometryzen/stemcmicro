export const BLACK = 1;
export const BLUE = 2;
export const RED = 3;

export function html_escape_and_colorize(s: string, color: 1 | 2 | 3): string {
    s = s.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/\r/g, "");

    switch (color) {

        case BLACK:
            s = "<span style='color:black;font-family:courier'>" + s + "</span>";
            break;

        case BLUE:
            s = "<span style='color:blue;font-family:courier'>" + s + "</span>";
            break;

        case RED:
            s = "<span style='color:red;font-family:courier'>" + s + "</span>";
            break;
    }

    return s;
}
