import { Str } from "@stemcmicro/atoms";

const Chars: Record<string, Str> = {};

export class Char {
    constructor(readonly value: string) {}
    static get(c: string): Str {
        if (Chars[c] === undefined) return new Str(c);
        else return Chars[c];
    }
}

//
// Char
//
/*
const Chars = {};

const Char = Class.create({
  initialize: function(c){
    Chars[ this.value = c ] = this;
  },
  to_write: function(){
    switch(this.value){
      case '\n': return "#\\newline";
      case ' ':  return "#\\space";
      case '\t': return "#\\tab";
      default:   return "#\\"+this.value;
    }
  },
  inspect: function(){
    return this.to_write();
  }
});

Char.get = function(c) {
  if(typeof(c) != "string") {
    throw new Bug("Char.get: " + inspect(c) + " is not a string");
  }
  if( Chars[c] === undefined )
    return new Char(c);
  else
    return Chars[c];
};

export default Char;
*/
