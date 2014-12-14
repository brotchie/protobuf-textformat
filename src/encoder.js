"use strict";

/* Encodes ProtoBuf.js message into the
 * protobuf text format.
 */

var _ = require('lodash');

function encodeString(metadata, value, indent) {
  return indent + metadata.name + ': "' + value + '"';
};

function encodeNumber(metadata, value, indent) {
  return indent + metadata.name + ': ' + value ;
};

function encodeBoolean(metadata, value, indent) {
  return indent + metadata.name + ': ' + (value ? 'true' : 'false');
};

function encodeEnum(metadata, value, indent) {
  var object = metadata.resolvedType.object
    , mnemonic = _.findKey(object, function(x) { return x == value; });
  return indent + metadata.name + ': ' + (mnemonic || value);
};

function encodeMessage(metadata, message, indent) {
  indent = indent || '';

  var children = _(message.$type.children)
    .filter(function(metachild) {
      return metachild.className === 'Message.Field';
    })
    .map(function(metachild) {
      var values = message.get(metachild.name);
      if (values !== null && !metachild.repeated) {
        values = [values];
      }
      if (values) {
        return encodeValues(values, metachild, indent);
      } else {
        return [];
      }
    })
    .flatten()
    .value();

  if (metadata && children.length > 0) {
    return [
      indent + metadata.name + ' {',
      children,
      indent + '}'
    ];
  } else {
    return children;
  }
};

var ENCODERS = {
    'message'  : encodeMessage
  , 'group'    : encodeMessage
  , 'enum'     : encodeEnum

  , 'string'   : encodeString
  , 'bytes'    : encodeString

  , 'float'    : encodeNumber
  , 'double'   : encodeNumber

  , 'bool'     : encodeBoolean

  , 'int32'    : encodeNumber
  , 'sint32'   : encodeNumber
  , 'sfixed32' : encodeNumber
  , 'uint32'   : encodeNumber
  , 'fixed32'  : encodeNumber

  , 'int64'    : encodeNumber
  , 'sint64'   : encodeNumber
  , 'sfixed64' : encodeNumber
  , 'uint64'   : encodeNumber
  , 'fixed64'  : encodeNumber
};

function encodeValues(values, metadata, indent) {
  var encoder = ENCODERS[metadata.type.name];
  if (encoder) {
    return values.map(function(value) {
      return encoder(metadata, value, indent);
    });
  } else {
    console.error('No encoder for', metadata.type.name);
    return [];
  }
};

module.exports = function(message) {
  var lines = _.flatten(encodeMessage(null, message));
  return lines.join('\n');
};
