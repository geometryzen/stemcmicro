
/**
 * 
 */
export function is_digit(str: string): boolean {
    if (str == null) {
        return false;
    }
    if (str === '') {
        return false;
    }
    return /^\d+$/.test(str);
}
