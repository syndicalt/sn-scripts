var crypto = window.crypto || window.msCrypto;
var encryptAlgorithm = {
  name: "RSA-OAEP",
  hash: {
    name: "SHA-1"
  }
};

function arrayBufferToBase64String(arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer)
  var byteString = '';
  for (var i=0; i<byteArray.byteLength; i++) {
    byteString += String.fromCharCode(byteArray[i]);
  }
  return btoa(byteString);
}

function base64StringToArrayBuffer(b64str) {
  var byteStr = atob(b64str);
  var bytes = new Uint8Array(byteStr.length);
  for (var i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return bytes.buffer;
}

function textToArrayBuffer(str) {
  var buf = unescape(encodeURIComponent(str)); // 2 bytes for each char
  var bufView = new Uint8Array(buf.length);
  for (var i=0; i < buf.length; i++) {
    bufView[i] = buf.charCodeAt(i);
  }
  return bufView;
}

function convertPemToBinary(pem) {
  var lines = pem.split('\n');
  var encoded = '';
  for(var i = 0;i < lines.length;i++){
    if (lines[i].trim().length > 0 &&
        lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 && 
        lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
        lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
        lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
      encoded += lines[i].trim();
    }
  }
  return base64StringToArrayBuffer(encoded);
}

function importPublicKey(pemKey) {
  return new Promise(function(resolve) {
    var importer = crypto.subtle.importKey("spki", convertPemToBinary(pemKey), encryptAlgorithm, false, ["encrypt"]);
    importer.then(function(key) { 
      resolve(key);
    });
  });
}


if (crypto.subtle) {
      let pubKey = `-----BEGIN NEW CERTIFICATE REQUEST-----
      MIIB4DCCAUkCAQAwcDELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAldWMRYwFAYDVQQH
      Ew1LZWFybmV5c3ZpbGxlMREwDwYDVQQKEwhUcmVhc3VyeTEMMAoGA1UECxMDSVJT
      MRswGQYDVQQDExIxMDI0LmRzLmlyc25ldC5nb3YwgZ8wDQYJKoZIhvcNAQEBBQAD
      gY0AMIGJAoGBAJEYKNLFvBqQi5rIOo9x/XU9ns42A8XqNWHm0ttMb7MIuVqIexmE
      o1GjCty7eRRe0OVZohbFipr0G225XfSMYq6TSzrUzUaONiWtxzQ1aaXhFY5646uz
      MVEH2Zvg5TcOpb16l+1SbtfCXmTKc48/etheoVchaTchN87nS4RXwc31AgMBAAGg
      MDAuBgkqhkiG9w0BCQ4xITAfMB0GA1UdDgQWBBTmRF2JwHXjQcqK3etihX9vXvmM
      nTANBgkqhkiG9w0BAQsFAAOBgQBQ+z6BEWNSVtmIVkNLCWMx4SlbvTYXBk5QOQQ+
      jJiidk5oOYe91/i3Ii8MoQTeFlqVNqsMqws+/axYO8u9Yo4MUDVoAw5/WevUDcZk
      9cjrPkWkBeqHwBt2yVuHUGBwTMyv6vsYv04tKGKFSLkOgUY0t29yQ5lCifT4fqKz
      6kt3SA==
      -----END NEW CERTIFICATE REQUEST-----`
      
      start = new Date().getTime();
      importPublicKey($('#pubkey').val()).then(function(key) {
        crypto.subtle.encrypt(encryptAlgorithm, key, textToArrayBuffer($('#txtClear').val())).then(function(cipheredData) {
            cipheredValue = arrayBufferToBase64String(cipheredData);
            console.log(cipheredValue);

        });
      });
}