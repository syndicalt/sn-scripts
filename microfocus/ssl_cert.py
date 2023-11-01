# coding: utf-8

import entity

import modeling

import logger

import json

 

from appilog.common.system.types import ObjectStateHolder

from appilog.common.system.types.vectors import ObjectStateHolderVector

 

import java

 

 

class CertificateTypes(object):

    X509 = "X.509"

 

    @staticmethod

    def values():

        return CertificateTypes.X509,

 

 

class LDAPDistinguishedObject(object):

 

    def __init__(self, dn, raw):

        '@types distinguished_name.DistinguishedName, str'

        self.dn = dn

        self.raw = raw

 

 

class X509Certificate(entity.Immutable):

    '''

        Domain Object which represents full information about SSL Certificate with type X509

    '''

 

    san_list = []

 

    def __init__(self, param_list):

        '''

            TODO: update docs

            @types: java.util.Date, java.util.Date, LDAPDistinguishedObject, LDAPDistinguishedObject, str, str,

            CertificateTypes, int, str

            @param0 create: date when certificate was created

            @param1 expires: expires date of certificate

            @param2 subject: represents information about certificate subject

            @param3 issuer: represents information about certificate issuer, whom this certificate was signed

            @param4 version: type version of used certificate

            @param5 sn: serial number of certificate in format (<hex byte1>:<hex byte2>:<hex byte3>:...)

            @param6 sigAlg: string representation of algorithm which used during encoding of this certificate

            @param7 certType: string representation of certificate type

            @param8 san_list: list representation of certificate alternative name list

            @param9 email: string representation of email which used during encoding of this certificate

            @param10 thumbprint: string representation of thumprint which used during encoding of this certificate

            @param11 publicKeyAlgorithm: string representation of thumprint algorithm which used during encoding of this certificate			

        '''

        create = param_list[0]

        expires = param_list[1]

        subject = param_list[2]

        issuer = param_list[3]

        version = param_list[4]

        sn = param_list[5]

        sigAlg = param_list[6] or None

        certType = param_list[7] or CertificateTypes.X509

        san_list = param_list[8] or []

        thumbprint = param_list[9]

        publicKeyAlgorithm = param_list[10]
    
        email = param_list[11] or None

        if not (expires and create and subject and issuer and sn):

            raise ValueError("Not all mandatory fields are filed")

 

        if not isinstance(expires, java.util.Date) or not isinstance(create, java.util.Date):

            raise ValueError("Expires and Create should be a date")

 

        if not isinstance(issuer, LDAPDistinguishedObject) or not isinstance(subject, LDAPDistinguishedObject):

            raise ValueError("issuer and subject should be a LDAPDistinguishedObject")

 

        if certType and not certType in CertificateTypes.values():

            raise ValueError("Invalid type")

 

        self.expiresOn = expires

        self.createOn = create

        self.subject = subject

        self.issuer = issuer

        self.version = version and int(version) or -1

        self.sn = sn

        self.signatureAlgorithm = sigAlg

        self.type = certType

        self.san_list = san_list

        self.email = email

        self.thumbprint = thumbprint

        self.publicKeyAlgorithm = publicKeyAlgorithm

 

    def set_san_list(self, san_list):

        self.san_list = san_list

 

    def __str__(self):

        return "\nType: %s, Version: %s\nExpires: %s, Created: %s\nSubject: %s, Issue: %s\n" % (self.type, self.version, self.expiresOn, self.createOn, self.subject, self.issuer)

 

    def __repr__(self):

        mandatory = (self.expiresOn, self.createOn, self.subject, self.issuer, self.sn, self.signatureAlgorithm, self.type, self.version, self.publicKeyAlgorithm, self.thumbprint, self.email)

        return 'X509Certificate(%s)' % (', '.join(map(repr, mandatory)))

 

    def getName(self):

        '''

            Getting name of certificate. Base on CN or O filed from subject

            @types: -> str

        '''

        cn = self.subject.dn.find_first('CN')

        o = self.subject.dn.find_first('O')

        common_name = cn and cn.value

        organization = o and o.value

        return common_name or organization

 

 

class RunningSoftwareBuilder(object):

 

    def buildWeak(self):

        return ObjectStateHolder('running_software')

 

 

#   Align with https://docs.oracle.com/javase/7/docs/api/java/security/cert/X509Certificate.html#getSubjectAlternativeNames()

SAN_SEQUENCE_GENERALNAMES_MAP = {

    0: 'OtherName',

    1: 'rfc822Name',

    2: 'DNSName',

    3: 'x400Address',

    4: 'DirectoryName',

    5: 'EDIPartyName',

    6: 'UniformResourceIdentifier',

    7: 'IPAddress',

    8: 'RegisteredID'

}

 

 

class CertificateBuilder(object):

    '''

        Helper to build SSL Certificate topology

    '''

 

    def build(self, certificate):

        '''

            Build ssl_certificate OSH from X509Certificate

            @types: X509Certificate -> ObjectStateHolderVector

        '''

        certOsh = ObjectStateHolder('digital_certificate')

        certOsh.setDateAttribute("valid_to", certificate.expiresOn)

        certOsh.setDateAttribute("create_on", certificate.createOn)

        certOsh.setStringAttribute("issuer", unicode(certificate.issuer.raw))

        certOsh.setStringAttribute("subject", unicode(certificate.subject.raw))

        certOsh.setStringAttribute("serial_number", certificate.sn)

        if certificate.san_list and len(certificate.san_list) > 0:

            logger.debug('san_list: ', certificate.san_list)

            san_dict = {}

            for san_item in certificate.san_list:

                if len(san_item) > 1 and SAN_SEQUENCE_GENERALNAMES_MAP.has_key(san_item[0]):

                    general_name = SAN_SEQUENCE_GENERALNAMES_MAP.get(san_item[0])

                    if san_dict.has_key(general_name):

                        san_dict[general_name].append(san_item[1])

                    else:

                        san_dict[general_name] = [san_item[1]]

            san_json_str = json.dumps(san_dict)

            logger.info('san_json: ', san_json_str)

            certOsh.setStringAttribute("subject_alt_names", san_json_str)

 

        if certificate.version:

            certOsh.setIntegerAttribute("version", certificate.version)

 

        if certificate.signatureAlgorithm:

            certOsh.setStringAttribute("signature_algorithm", certificate.signatureAlgorithm)

 

        if certificate.type:

            certOsh.setStringAttribute("type", certificate.type)

 

        organization = certificate.subject.dn.find_first('O')

        if organization:

            certOsh.setStringAttribute("organization", organization.value)

 

        organization_unit = certificate.subject.dn.lookup('OU')

        if organization_unit:

            ou = map(lambda obj: str(obj.value), organization_unit)

            certOsh.setListAttribute("organization_unit", ou)

 

        cnSubject = certificate.subject.dn.find_first('CN')

        if cnSubject and cnSubject.value:

            certOsh.setStringAttribute("common_name", cnSubject.value)

 

        cnIssuer = certificate.issuer.dn.find_first('CN')

        oIssuer = certificate.issuer.dn.find_first('O')

        issuerName = None

        if cnIssuer and cnIssuer.value:

            issuerName = cnIssuer.value

        else:

            issuerName = oIssuer and oIssuer.value

        certOsh.setStringAttribute("issuer_name", issuerName)

 

        isSelfSigned = certificate.subject.raw == certificate.issuer.raw

        certOsh.setBoolAttribute("is_self_signed", isSelfSigned)

        # Thumbprint
        if hasattr(certificate, 'thumbprint') and certificate.thumbprint:
            certOsh.setStringAttribute("thumbprint", certificate.thumbprint)

        # Public Key Algorithm
        if hasattr(certificate, 'publicKeyAlgorithm') and certificate.publicKeyAlgorithm:
            certOsh.setStringAttribute("publicKeyAlgorithm", certificate.publicKeyAlgorithm)

        # Email (assuming it might be in the SAN list)
        email_addresses = [san[1] for san in certificate.san_list if san[0].lower() == 'email']
        if email_addresses:
            certOsh.setListAttribute("email_addresses", email_addresses)

        return certOsh

 

 

class LinkBuilder:

    '''

        Link builder

    '''

    def build(self, cit, end1, end2):

        '''

            @types: str, ObjectStateHolder, ObjectStateHolder -> ObjectStateHolder

        '''

        return modeling.createLinkOSH(cit, end1, end2)

 

 

class CertificateReporter:

    '''

        Helper to build SSL Certificate topology as vector

    '''

 

    def __init__(self, certBuilder, linkBuilder):

        '''

            @types: CertificateBuilder, LinkBuilder

        '''

        self.__certBuilder = certBuilder

        self.__linkBuilder = linkBuilder

 

    def reportTopology(self, certs, softwareOsh):

        '''

            report certificates topology

            @types: list(X509Certificate), ObjectStateHolder

        '''

        if not certs:

            raise ValueError("Certificates are empty")

        if not softwareOsh:

            raise ValueError("Soft osh is empty")

 

        oshv = ObjectStateHolderVector()

        parentOsh = None

        for cert in reversed(certs):

 

            logger.debug("Reporting cert: %s" % cert.getName())

            certOsh = self.__certBuilder.build(cert)

            oshv.add(certOsh)

            if parentOsh:

                oshv.add(self.__linkBuilder.build("dependency", certOsh, parentOsh))

            parentOsh = certOsh

        oshv.add(self.__linkBuilder.build("usage", softwareOsh, parentOsh))

 

        return oshv