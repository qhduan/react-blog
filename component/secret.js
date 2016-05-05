"use strict";

const crypto = require("browserify-cipher");
const algorithm = "aes-256-cbc";

function encode (data, key) {
  if (typeof data == "object") {
    data = JSON.stringify(data);
  }
  if (typeof data != "string") {
    return null;
  }
  var cipher = crypto.createCipher(algorithm, key);
  var chunks = [];
  chunks.push(cipher.update(data, "utf8", "base64"));
  chunks.push(cipher.final("base64"));
  return chunks.join("");
}


function decode (data, key) {
  try {
    var decipher = crypto.createDecipher(algorithm, key);
    var chunks = [];
    chunks.push(decipher.update(data, "base64", "utf8"));
    chunks.push(decipher.final("utf8"));
    var result = chunks.join("");
    var json = null;
    try {
      json = JSON.parse(result);
    } catch (e) {}
    if (json) return json;
    return result;
  } catch (e) {
    return null;
  }
}

module.exports = {
  encode,
  decode
};
