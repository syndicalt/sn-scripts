function Validate-CertService {
    ## run cmd
    $certService = Get-Service -Name CertSvc -ErrorAction SilentlyContinue

    ## check if service is running
    if ($certService.Status -ne "Running") {
        #throw "Certificate service is not running."
        return $false
    }

    return $true
}

function Get-CertificatesByTemplate {
    param (
        [Parameter(Mandatory=$true)]
        [string]$templateID
    )

    try {
        # Fetch certificates from the CA based on the template ID
        $certOutput = certutil -restrict "certificatetemplate=$templateID" -gmt -out "NotAfter,NotBefore,SerialNumber,PublicKeyAlgorithm,SubjectKeyIdentifier,Organization,OrgUnit,CommonName,State,Locality,EMail,Country,DistinguishedName,certificatetemplate,CertificateHash,disposition,IssuerNameID" -seconds -view csv

        if (-not $certOutput) {
            throw "Failed to retrieve certificates using certutil."
        }

        # Filter out irrelevant lines and split the records
        $certificates = $certOutput -notmatch "Row \d+:" -notmatch "CertificateTemplate:" -notmatch "^-----" -replace "  ", "" -split "\n" | Where-Object { $_ -ne "" }

        # Return the result as JSON
        return Format-JSON -obj $certificates
    } catch {
        Write-Error $_.Exception.Message
        return $_.Exception.Message
    }
}

function Get-CertificatesByOffset {
    param (
        [Parameter(Mandatory=$true)]
        [string]$offsetStart,
        [Parameter(Mandatory=$true)]
        [string]$offsetEnd
    )

    try {
        # Fetch certificates from the CA based on the template ID
        $certOutput = certutil -restrict "RequestID > $offsetStart, RequestID < $offsetEnd" -gmt -out "NotAfter,NotBefore,SerialNumber,PublicKeyAlgorithm,SubjectKeyIdentifier,Organization,OrgUnit,CommonName,State,Locality,EMail,Country,DistinguishedName,certificatetemplate,CertificateHash,disposition,IssuerNameID,RequestID" -seconds -view csv

        if (-not $certOutput) {
            throw "Failed to retrieve certificates using certutil."
        }

        # Filter out irrelevant lines and split the records
        $certificates = $certOutput -notmatch "Row \d+:" -notmatch "CertificateTemplate:" -notmatch "^-----" -replace "  ", "" -split "\n" | Where-Object { $_ -ne "" }

        # Parse the certificates into a list of PSObjects
        $certificatesObjects = for($i = 0; $i -lt $certificates.Length; $i += 8) {
            [PSCustomObject]@{
                "NotAfter" = $certificates[$i].Split(":")[1].Trim();
                "NotBefore" = $certificates[$i+1].Split(":")[1].Trim();
                "SerialNumber" = $certificates[$i+2].Split(":")[1].Trim();
                "PublicKeyAlgorithm" = $certificates[$i+3].Split(":")[1].Trim();
                "SubjectKeyIdentifier" = $certificates[$i+4].Split(":")[1].Trim();
                "Organization" = $certificates[$i+5].Split(":")[1].Trim();
                "OrgUnit" = $certificates[$i+6].Split(":")[1].Trim();
                "CommonName" = $certificates[$i+7].Split(":")[1].Trim();
                "State" = $certificates[$i+8].Split(":")[1].Trim();
                "Locality" = $certificates[$i+9].Split(":")[1].Trim();
                "EMail" = $certificates[$i+10].Split(":")[1].Trim();
                "Country" = $certificates[$i+11].Split(":")[1].Trim();
                "DistinguishedName" = $certificates[$i+12].Split(":")[1].Trim();
                "CertificateTemplate" = $certificates[$i+13].Split(":")[1].Trim();
                "CertificateHash" = $certificates[$i+14].Split(":")[1].Trim();
                "Disposition" = $certificates[$i+15].Split(":")[1].Trim();
                "IssuerNameID" = $certificates[$i+16].Split(":")[1].Trim();
            }
        }

        # Return the result as JSON
        return Format-JSON -obj $certificates
    } catch {
        Write-Error $_.Exception.Message
        return $_.Exception.Message
    }
}

function Format-JSON {
    param(
        [Parameter(Mandatory=$true)] 
        [string]$obj
    )

     # Parse the certificates into a list of PSObjects
    $certificatesObjects = for($i = 0; $i -lt $obj.Length; $i += 8) {
        [PSCustomObject]@{
            "NotAfter" = $obj[$i].Split(":")[1].Trim();
            "NotBefore" = $obj[$i+1].Split(":")[1].Trim();
            "SerialNumber" = $obj[$i+2].Split(":")[1].Trim();
            "PublicKeyAlgorithm" = $obj[$i+3].Split(":")[1].Trim();
            "SubjectKeyIdentifier" = $obj[$i+4].Split(":")[1].Trim();
            "Organization" = $obj[$i+5].Split(":")[1].Trim();
            "OrgUnit" = $obj[$i+6].Split(":")[1].Trim();
            "CommonName" = $obj[$i+7].Split(":")[1].Trim();
            "State" = $obj[$i+8].Split(":")[1].Trim();
            "Locality" = $obj[$i+9].Split(":")[1].Trim();
            "EMail" = $obj[$i+10].Split(":")[1].Trim();
            "Country" = $obj[$i+11].Split(":")[1].Trim();
            "DistinguishedName" = $obj[$i+12].Split(":")[1].Trim();
            "CertificateTemplate" = $obj[$i+13].Split(":")[1].Trim();
            "CertificateHash" = $obj[$i+14].Split(":")[1].Trim();
            "Disposition" = $obj[$i+15].Split(":")[1].Trim();
            "IssuerNameID" = $obj[$i+16].Split(":")[1].Trim();
        }
    }

    return $certificatesObjects | Convert-To-Json
}