export function isdigit(s: string): boolean {
    const c = s.charCodeAt(0);
    return c >= 48 && c <= 57;
}
