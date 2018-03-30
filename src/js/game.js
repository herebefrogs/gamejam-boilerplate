import { rand } from './utils';

const score = rand(1, 10);

const charset = 'not a picture';

let foo = (options = ['a']) => {
  console.log(options, `hello all you there, ${score} out of 10, ${charset}`);
}

foo([1, 3, 4]);