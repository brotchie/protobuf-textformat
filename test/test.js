"use strict";

var assert = require('assert')
  , fs = require('fs');

var ProtoBuf = require('protobufjs');

var sut = require('..');

describe('parse', function() {
  it('should successfully load the basic prototype text format', function() {
    var builder = ProtoBuf.loadProtoFile('./test/caffe.proto')
      , fqn = 'caffe.NetParameter';

    var input = fs.readFileSync('./test/basic.prototxt', 'utf-8');

    var result = sut.parse(builder, fqn, input)
      , message = result.message;

    assert.equal(true, result.status);
    assert.equal('FlickrStyleCaffeNet', message.name);
    assert.equal(1, message.layers.length);
    assert.equal('data', message.layers[0].name);
    assert.equal(12, message.layers[0].type);
  });

  it('should successfully round-trip a more complex document', function() {
     var builder = ProtoBuf.loadProtoFile('./test/caffe.proto')
      , fqn = 'caffe.NetParameter';

    var input = fs.readFileSync('./test/complex.prototxt', 'utf-8');

    var result = sut.parse(builder, fqn, input)
      , message = result.message;

    var encoded = sut.encode(message);
    assert.equal(encoded, input);
  });
});

