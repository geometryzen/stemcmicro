import { create_int, create_rat, Rat } from 'math-expression-atoms';

export { Rat };

/**
 * The canonical representation of the identity element for ordinary addition. 
 */
export const zero = create_int(0);
/**
* The canonical representation of the identity element for ordinary multiplication. 
*/
export const one = zero.succ();
export const two = create_int(2);
export const three = create_int(3);
export const four = create_int(4);
export const five = create_int(5);
export const six = create_int(6);
export const seven = create_int(7);
export const eight = create_int(8);
export const nine = create_int(9);
export const ten = create_int(10);
export const eleven = ten.succ();
export const negOne = one.neg();
export const negTwo = two.neg();
export const negThree = three.neg();
export const negFour = four.neg();
export const negFive = five.neg();
export const negSix = six.neg();
export const negSeven = seven.neg();
export const negEight = eight.neg();
export const negNine = nine.neg();
export const negTen = ten.neg();
export const negEleven = eleven.neg();
export const half = create_rat(1, 2);
export const negHalf = half.neg();
export const third = create_rat(1, 3);
