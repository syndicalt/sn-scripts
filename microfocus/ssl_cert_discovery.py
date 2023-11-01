# coding: utf-8

 

from array import array as jarray
import logger

 

from ssl_cert import X509Certificate, LDAPDistinguishedObject, CertificateTypes

 

from javax.net.ssl import KeyManager
from javax.net.ssl import SSLContext
from javax.net.ssl import TrustManager
from java.security import SecureRandom
from javax.net.ssl import X509TrustManager
from java.net import InetSocketAddress
from distinguished_name import DnParser
from java.math import BigInteger
from java.util import Arrays
 

class SSLCertificateParser(object):
    '''
        Parse java representation of certificate to python's X509Certificate
    '''



    def __bytesToHex(self, data):
        '''
            Perform transform from list(byte) to format string, where each byte shown as hex and ":" as separator between each byte
            Example:
                04:7B:1A:63:8C:F1:EA
            list(byte) -> str
        '''

 

        # Note: x & 0xFF performing to get unsigned byte
        return ':'.join(["%02X" % (x & 0xFF) for x in data]).strip()

    def __getSubjectKeyId(self, javaCert):
        # Check if the certificate has the Subject Key Identifier extension
        if not javaCert.getNonCriticalExtensionOIDs().contains('2.5.29.14')
            return None
        
        # Return raw SKI value
        raw_ski_val = javaCert.getExtensionValue('2.5.29.14')

        # Extract inner octet
        ski_bytes = Arrays.copyOfRange(raw_ski_val, 4, len(raw_ski_val))

        return self.__bytesToHex(ski_bytes)

    def parse(self, javaCert):
        '''
            Perform transformation from java.security.X509Certificate to ssl_cert.X509Certificate
            @types: java.security.X509Certificate -> ssl_cert.X509Certificate
        '''
        typeCert = javaCert.getType()
        if typeCert == CertificateTypes.X509:
            objParser = DnParser()
            subject = javaCert.getSubjectDN().getName()
            issuedBy = javaCert.getIssuerDN().getName()
            subjectDn = objParser.parse(subject)
            issuedByDn = objParser.parse(issuedBy)
            version = javaCert.getVersion()
            create = javaCert.getNotBefore()
            expires = javaCert.getNotAfter()
            san_list = javaCert.getSubjectAlternativeNames()
            thumbprint = self.__getSubjectKeyId(javaCert)
            publicKeyAlgorithm = javaCert.getSigAlgName()
            serialNumber = self.__bytesToHex(BigInteger(str(javaCert.getSerialNumber())).toByteArray())

            param_list = [create, expires, LDAPDistinguishedObject(subjectDn, subject), LDAPDistinguishedObject(issuedByDn, issuedBy), 
                          version, serialNumber, javaCert.getSigAlgName(), typeCert, san_list, thumbprint, publicKeyAlgorithm, email]

            return X509Certificate(param_list)
        return None

class DefaultTrustManager (X509TrustManager):
    '''
        Trust store manager for accepting all certificates
    '''

 

    def checkClientTrusted(self, arg0, arg1):
        pass

 

    def checkServerTrusted(self, arg0, arg1):
        pass

 

    def getAcceptedIssuers(self):
        return None

 

 

def createSSLSocket(host, port):
    '''
        Creates SSL Socket
        @types: str, int -> javax.net.ssl.SSLSocket
    '''

 

    # Create own TrustManager to be able to accept all certificates (even invalid)
    # configure the SSLContext with a TrustManager
    ctx = SSLContext.getInstance("TLS")
    keyManagers = jarray(KeyManager)
    trustManagers = jarray(TrustManager)
    trustManagers.append(DefaultTrustManager())

 

    ctx.init(keyManagers, trustManagers, SecureRandom())

 

    # Gets the default static SSLSocketFactory that is inherited by new instances of this class.
    # The socket factories are used when creating sockets for secure https URL connections.
    factory = ctx.getSocketFactory()

 

    # Creates a socket and connects it to the specified remote host at the specified remote
    # port. This socket is configured using the socket options established for this
    # factory.
    # return factory.createSocket(host, int(port))

 

    socket = factory.createSocket()

 

    socket.connect(InetSocketAddress(host,int(port)),60000)

 

    return socket

 

 

def discoverCertificates(session):
    '''
        Default discovery function which discover SSL certificates from the javax.net.ssl.SSLSession

 

        @types: javax.net.ssl.SSLSession -> list(ssl_cert.X509Certificate)
    '''
    serverCerts = session.getPeerCertificates()
    certParser = SSLCertificateParser()
    return filter(None, map(certParser.parse, serverCerts))

 

 

def openSslSession(host, port, discoveryFn):
    '''
        Open ssl session and run on it discovery function

 

        @types: str, int, callable -> list(ssl_cert.X509Certificate)
    '''
    socket = None
    try:
        socket = createSSLSocket(host, int(port))

 

        # Starts an SSL handshake on this connection. Common reasons include a need to use new
        # encryption keys, to change cipher suites, or to initiate a new session. To force
        # complete reauthentication, the current session could be invalidated before starting
        # this handshake.
        socket.setSoTimeout(30000)
        socket.startHandshake()

 

        # Retrieve the server's certificate chain
        return discoveryFn(socket.getSession())
    finally:
        # Close the socket
        if socket:
            try:
                socket.close()
            except:
                pass