"use strict";

/* Parser combinator based parser for the
 * protobuf text format.
 */

var Parsimmon = require('parsimmon');

var regex = Parsimmon.regex
  , string = Parsimmon.string
  , optWhitespace = Parsimmon.optWhitespace
  , lazy = Parsimmon.lazy
  , alt = Parsimmon.alt
  , seq = Parsimmon.seq;

var comment = regex(/#.+/).then(optWhitespace.atMost(1));
var whitespace = optWhitespace.then(comment.atMost(1));

var lexeme = function(p){ return p.skip(whitespace); }

var colon = lexeme(string(':'));

var lbrace = lexeme(string('{'))
  , rbrace = lexeme(string('}'));

var stripFirstLast = function(x) {
  return x.substr(1, x.length-2);
};

var identifier = lexeme(regex(/[a-zA-Z_][0-9a-zA-Z_+-]*/));
var doubleString = lexeme(regex(/\"([^\"\n\\\\]|\\\\.)*(\"|\\\\?$)/).map(stripFirstLast));
var singleString = lexeme(regex(/\'([^\'\n\\\\]|\\\\.)*(\'|\\\\?$)/).map(stripFirstLast));

var number = lexeme(regex(/[.]?[0-9+-][0-9a-zA-Z_.+-]*/)).map(Number);
var trueLiteral = lexeme(string('true')).result(true);
var falseLiteral = lexeme(string('false')).result(false);

var expr = lazy('an expression', function() { return alt(pair, message).many(); });

var message = seq(identifier, colon.times(0, 1).then(lbrace).then(expr).skip(rbrace))
                .map(function(message) {
                  return { type: 'message', name: message[0], values: message[1] };
                });

var value = alt(trueLiteral, falseLiteral, number, doubleString, singleString, identifier);

var pair = seq(identifier.skip(colon), value)
            .map(function(pair) {
              return { type: 'pair', name: pair[0], value: pair[1] };
            });

module.exports = function(input) {
  var result = whitespace.then(expr).parse(input);
  if (!result.status) {
    result.error = Parsimmon.formatError(input, result);
  }
  return result;
};

