"use strict";

var parse = require('./src/parser')

function buildMessageFromAST(message, ast) {
  ast.map(function(entry) {
    var value;
    var field = message.$type.getChild(entry.name)
    if (entry.type === 'pair') {
      value = entry.value;
    } else if (entry.type === 'message') {
      var ChildMessageClass = field.resolvedType.build();
      var value = new ChildMessageClass();
      buildMessageFromAST(value, entry.values);
    }

    if (field.repeated) {
      message.add(entry.name, value);
    } else {
      message.set(entry.name, value);
    }
  });
};

module.exports.encode = require('./src/encoder');

module.exports.parse = function(builder, fqn, input) {
  var MessageClass = builder.build(fqn)
   , message = new MessageClass();

  var result = parse(input);

  if (result.status) {
    buildMessageFromAST(message, result.value);
    result.message = message;
  }
  return result;
};

