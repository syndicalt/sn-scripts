const asn1js = require('asn1js');

const pemCsr = `-----BEGIN CERTIFICATE REQUEST-----
MIICyjCCAbICAQAwgZMxCzAJBgNVBAYTAkNIMQswCQYDVQQIDAJDQTEQMA4GA1UE
BwwHUmVzdG9uZTEcMBoGA1UECgwTU2VjdXJpdHkgSW5mb3JtYXRpb24xEDAOBgNV
BAsMB0RldmVsb3BtZW50MRAwDgYDVQQDDAdUZXN0IENBMjCCASIwDQYJKoZIhvcN
AQEBBQADggEPADCCAQoCggEBAKj7eERZfNFgwwDnW8XvEve7h1y36/SIJg7U4Qyt
L4sJcRZUxbCN6S/a8TxjPzNMppaTxDq3T6fMyMB/29wFPEZcr/VRq3OqNzO9d/Ei
yNzbHzOIRGTf5W5rr5wH7/zL2jgZI0iM9XzE29GjK5MSgyfg5LLvOjC0W8LgH43D
JZfKbwV7Jb8XN+aV7fOyN0A4sU2EInaAdh6Rfo0xvS0LGhoyDQL8YtM10ip+CBBG
tOcQ2o8RtUDZQ9dS39vDebAP07i8EOLwLRn4qFvBMnH5i/R8ITjmPWpX9dPJZCX6
FTAmVfkRz6EB2NV6iDRF6mGon6fhCZzsELX9L7NlOa2sHzsCAwEAAaAAMA0GCSqG
SIb3DQEBCwUAA4IBAQBLIclAGQfVdByyBrLxc7Jcq1Lo+ExT7T3owJZ9r3dJ19x6
dc+VUJcpwUQ7DvGz6U+H6a5FO5m2g5vce35xHMCAD5YfsztAZ4gq3vP0JdfW8/Ht
N/v9X05OvOxN0WJhNlGw+pO/5tLcOQEZLKG14X7VgngsJ58nt2mOJZaizh7VY0yL
T7zvFbTweq7rNpOZazqqNAmvNc6OXgJfUmuRwU/8/KUe+6oXQgMW5ue5JKH8JvCn
/sa4eY4CEuxJW8bLhByiB+7DnZPfDHy8fIDJxHtY+hFtYn/JtWQhHkK89X9AvE0t
PmD0`

// Remove the PEM header and footer
const base64Csr = pemCsr
    .replace(/-----BEGIN CERTIFICATE REQUEST-----\r?\n/, '')
    .replace(/-----END CERTIFICATE REQUEST-----\r?\n/, '');

// Convert the base64 string to a Uint8Array
const binaryCsr = Uint8Array.from(atob(base64Csr), c => c.charCodeAt(0));

// Extract the subject from the CSR
const asn1 = asn1js.fromBER(binaryCsr.buffer);
const csr = CertificationRequest.decode(asn1.result);
const subject = csr.subject.typesAndValues
    .map(x => `${x.type}=${x.value.value}`)
    .join(', ');

console.log(subject);