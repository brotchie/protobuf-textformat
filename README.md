
Parser and encoder for TextFormat protobuf messages. Based on the C++ and Java TextFormat code in the Google implementation (https://github.com/google/protobuf). Uses ProtoBuf.js (https://github.com/dcodeIO/ProtoBuf.js) to validate and structure parsed messages.

# Getting Started

Install from npm:

```bash
$ npm install protobuf-textformat
```

Parse text into ProtoBuf.js message objects:

```javascript
var ProtoBuf = require('protobufjs')
  , TextFormat = require('protobuf-textformat');

/* Load a protobuf schema. */
var builder = ProtoBuf.loadProtoFile('./test/caffe.proto');

/* Read a protobuf text format file that is valid
   under the schema. */
var input = require('fs').readFileSync('./test/basic.prototxt', 'utf-8');

/* Parse the schema into a ProtoBuf.js messsage object. */
var result = TextFormat.parse(builder, 'caffe.NetParameter', input);

if (result.status) {
    console.log(JSON.stringify(result.message, null, 2));
} else {
    console.error('Parsing failed', result.error);
}

```
# License
[MIT](LICENSE)
