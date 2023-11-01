$oids = @(
    "Template1",
    "Template2",
    "Template3"
)

# Get certificates for each template
foreach ($template in $oids) {
    Get-CertificatesByTemplate -templateID $template
}

# ------------------ FUNCTIONS ------------------

<#
.SYNOPSIS
Retrieves certificates from the CA based on a specified template ID.
.DESCRIPTION
The `Get-CertificatesByTemplate` function fetches certificate information based on the provided template ID and saves it as a JSON file on a specified network path.
.PARAMETER templateID
The ID of the certificate template to retrieve.
.EXAMPLE
Get-CertificatesByTemplate -templateID "Template1"
.NOTES
This function requires the `Format-JSON` function to convert the certificate data to JSON format.
#>
function Get-CertificatesByTemplate {
    param (
        [Parameter(Mandatory=$true)]
        [string]$templateID
    )

    $idArr = @()
    $extJSON = @()
    $networkPath = "\\vp0smtbpkica003\snowcertdiscovery"

    try {
        # Fetch certificates from the CA based on the template ID
        $certOutput = certutil -restrict "certificatetemplate=$templateID" -gmt -out "RequestID,NotAfter,NotBefore,SerialNumber,PublicKeyAlgorithm,SubjectKeyIdentifier,Organization,OrgUnit,CommonName,State,Locality,EMail,Country,DistinguishedName,certificatetemplate,CertificateHash,disposition,IssuerNameID" -seconds -view csv

        # Check if the command succeeded
        if (-not $certOutput) {
            throw "Failed to retrieve certificates using certutil."
        }

        # Filter out irrelevant lines and split the records
        $certificates = $certOutput -notmatch "Row \d+:" -notmatch "CertificateTemplate:" -notmatch "^-----" -replace "  ", "" -split "\n" | Where-Object { $_ -ne "" }

        # Return the result as JSON
        $certJSON = Format-JSON -obj $certificates

        # Write the JSON to a file
        $certJSON | Out-File -FilePath "$networkPath\$templateId.json"

        # Extract the request IDs from the JSON
        foreach($item in $certJSON | ConvertFrom-Json){
            $idArr += $item."Issued Request ID"
        }

        # Get extension attributes for each certificate
        $extJSON += $idArr | Get-ExtensionByReqId
        # Write the JSON to a file
        $extJSON | Out-File -FilePath "$networkPath\$templateId-ext.json"
        return $result
    } catch {
        Write-Error $_.Exception.Message
        return $_.Exception.Message
    }
}

<#
.SYNOPSIS
Fetches extension attributes from the CA based on the provided request ID.
.DESCRIPTION
The `Get-ExtensionByReqId` function retrieves extension attributes of certificates based on a given request ID and returns the data as a JSON format.
.PARAMETER requestId
The ID of the certificate request to retrieve the extension for.
.EXAMPLE
Get-ExtensionByReqId -requestId "12345"
#>
function Get-ExtensionByReqId {
    param(
        [Parameter(ValueFromPipeline=$true)]
        $requestId
    )
    Process {
        try{
            # Fetch extension attributes from the CA based on requestId
            $extOutput = certutil -restrict "ExtensionName=2.5.29.17,ExtensionRequestId=$requestId" -gmt -view Ext csv 

            # Trim each item in the $data array for whitespace and quotes
            $data = $extOutput | ForEach-Object { $_.Trim('" ') }  # Remove spaces and quotes from both ends

            # Extract headers
            $headers = $data[0..3]

            # Since "Data 4" is a multiline string, concatenate and replace newline characters with commas
            $multilineData4 = -join $data[7..10].Trim('" ')  # Remove spaces and quotes from both ends
            $multilineData4Formatted = $multilineData4 -replace '\r?\n', ','

            # Create the data object using a hashtable
            $dataObject = @{
                $headers[0] = $data[4]
                $headers[1] = $data[5]
                $headers[2] = $data[6]
                $headers[3] = $multilineData4Formatted
            }

            # Convert the object to JSON format
            $json = $dataObject | ConvertTo-Json

            return $json
        } catch {
            Write-Error $_.Exception.message
            return $_.Exception.message
        }
    }
}

<#
.SYNOPSIS
Formats a multi-line string to a JSON object.
.DESCRIPTION
The `Format-JSON` function takes in a multi-line string, where the first line contains headers and the subsequent lines contain data. It returns a corresponding JSON object.
.PARAMETER obj
The multi-line string to be formatted to JSON.
.EXAMPLE
$data = @(
    "Header 1", "Header 2", "Header 3", "Header 4"
    "Data 1", "Data 2", "Data 3", "Data 4
    More data
    More data
    More data"
)
$json = Format-JSON -obj $data
Write-Output $json
#>
function Format-JSON {
    param(
        [Parameter(Mandatory=$true)]
        $obj
    )

    # Remove all double quotation marks
    $obj = $obj -replace '"', ''

    # Convert the multi-line string into an array of lines
    $lines = $obj -split "\r?\n"
    
    # Extract headers from the first line
    $headers = $lines[0] -split ','
    Write-Output $headers
    # Process each line and convert it into a hashtable (which can be converted to JSON)
    $output = $lines[1..($lines.Length - 1)] | ForEach-Object {
        $data = $_ -split ','
        $hash = @{}

        # Create a hashtable with the headers as keys and the data as values
        for ($i = 0; $i -lt $headers.Length; $i++) {
            $hash[$headers[$i].Trim()] = $data[$i].Trim() #-replace 'Empty', '' -replace ".*=", ""
        }
        
        return $hash
    }

    # Convert the array of hashtables to JSON
    return $output | ConvertTo-Json
} 

