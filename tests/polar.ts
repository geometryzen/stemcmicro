import { run_test } from '../test-harness';

run_test([
  'polar(1+i)',
  'exp(1/4*i*pi)*2^(1/2)',

  'polar(-1+i)',
  'exp(3/4*i*pi)*2^(1/2)',

  'polar(-1-i)',
  'exp(-3/4*i*pi)*2^(1/2)',

  'polar(1-i)',
  'exp(-1/4*i*pi)*2^(1/2)',

  'rect(polar(3+4*i))',
  '3+4*i',

  'rect(polar(-3+4*i))',
  '-3+4*i',

  'rect(polar(3-4*i))',
  '3-4*i',

  'rect(polar(-3-4*i))',
  '-3-4*i',

  'rect(polar((-1)^(1/2)))',
  'i',

  'rect(polar((-1)^(-5/6)))',
  '-1/2*3^(1/2)-1/2*i',
// TODO
//  'rect(polar((-1)^(-5/a)))',
//  'cos(5*pi/a)-i*sin(5*pi/a)',

  'rect(polar((-1)^(a)))',
  'cos(pi*a)+i*sin(pi*a)',

  '-i*(-2*rect(polar((-1)^(1/6)))/rect(polar((3^(1/2))))+2*rect(polar((-1)^(5/6)))/rect(polar((3^(1/2)))))^(1/4)*(2*rect(polar((-1)^(1/6)))/rect(polar((3^(1/2))))-2*rect(polar((-1)^(5/6)))/rect(polar((3^(1/2)))))^(1/4)/(2^(1/2))',
  //"-(-1)^(3/4)",
  '1/2^(1/2)-i/(2^(1/2))',

  // this is also "-(-1)^(3/4)" but we get to that after the simplification after
  // this test
  '-i*(-2*polar((-1)^(1/6))/polar((3^(1/2)))+2*polar((-1)^(5/6))/polar((3^(1/2))))^(1/4)*(2*polar((-1)^(1/6))/polar((3^(1/2)))-2*polar((-1)^(5/6))/polar((3^(1/2))))^(1/4)/(2^(1/2))',
  '-i*(-2*exp(1/6*i*pi)/(3^(1/2))+2*exp(5/6*i*pi)/(3^(1/2)))^(1/4)*(2*exp(1/6*i*pi)/(3^(1/2))-2*exp(5/6*i*pi)/(3^(1/2)))^(1/4)/(2^(1/2))',

  'simplify',
  '(1-i)/(2^(1/2))',

  '-i*(-2*rect(exp(1/6*i*pi))/(3^(1/2))+2*rect(exp(5/6*i*pi))/(3^(1/2)))^(1/4)*(2*rect(exp(1/6*i*pi))/(3^(1/2))-2*rect(exp(5/6*i*pi))/(3^(1/2)))^(1/4)/(2^(1/2))',
  //"-(-1)^(3/4)",
  '1/2^(1/2)-i/(2^(1/2))',

  'polar(-(-1)^(3/4))',
  'exp(-1/4*i*pi)',

  'polar(-i*(-2*(-1)^(1/6)/(3^(1/2))+2*(-1)^(5/6)/(3^(1/2)))^(1/4)*(2*(-1)^(1/6)/(3^(1/2))-2*(-1)^(5/6)/(3^(1/2)))^(1/4)/(2^(1/2)))',
  'exp(-1/4*i*pi)',

  // nothing to do for polar since we end
  // up with a real
  'polar((-1)^(1/6) - (-1)^(5/6))',
  '3^(1/2)',
]);
