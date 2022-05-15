
// s is a string here anyways
export function is_space(s: string): boolean {
    if (s == null) {
        return false;
    }
    return (
        s === ' ' ||
        s === '\t' ||
        s === '\n' ||
        s === '\v' ||
        s === '\f' ||
        s === '\r'
    );
}
