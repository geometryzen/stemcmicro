import { run_test } from '../test-harness';

run_test([
  'condense(a/(a+b)+b/(a+b))',
  '1',

  'psi(n) = exp(-r/n)*laguerre(2*r/n,n-1,1)',
  '',

  'psi(3)',
  '-2*r*exp(-1/3*r)+2/9*exp(-1/3*r)*r^2+3*exp(-1/3*r)',

  'condense(last)',
  '(3-2*r+2/9*r^2)*exp(-1/3*r)',

  'psi()=psi',
  '',

  // test case H

  'condense(-3 * exp(-1/3 * r + i * phi) * cos(theta) - 6 * exp(-1/3 * r + i * phi) * cos(theta) * sin(theta)^2 + 12 * exp(-1/3 * r + i * phi) * cos(theta)^3)',
  '3*exp(-1/3*r+i*phi)*(-1+4*cos(theta)^2-2*sin(theta)^2)*cos(theta)',

  'condense(7208+2736*5^(1/2))',
  '8*(901+342*5^(1/2))',
]);
