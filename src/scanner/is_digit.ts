
/**
 * 
 */
export function is_digit(str: string): boolean {
    if (str == null) {
        return false;
    }
    return /^\d+$/.test(str);
}
