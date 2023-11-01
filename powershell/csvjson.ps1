# Given data
$data = @(
    "Extension Request ID", "Extension Name", "Extension Flags", "Extension Raw Value"
    "0239402", "Extension Name 1", "Extension Flags 1", "ERV 4
    ERV
    ERV
    ERV"
)

# Trim each item in the $data array for whitespace and quotes
$data = $data | ForEach-Object { $_.Trim('" ') }  # Remove spaces and quotes from both ends

# Extract headers
$headers = $data[0..3]

# Since "Data 4" is a multiline string, we'll concatenate it and then replace newline characters with commas
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

# Output the JSON data
$json
