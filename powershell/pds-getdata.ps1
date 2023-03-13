Clear-Host
# Set the API endpoint and initial parameters
$headers = @{}
$endpoint = "https://api.instantwebtools.net/v1/passenger"
$params = @{
    page = 182
    size = 100
}

# Create an empty array to store the data
$data = @()

# Loop through the API results until no more data is returned
do {
    # Make the API request with the current parameters
    $response = Invoke-RestMethod -Uri $endpoint -Method Get -Body $params
    # Process the data returned by the API
    foreach ($record in $response) {
        # Do something with the record
        $data += $record.data
    }

    $response.data.count
    # Increment the page number to get the next set of records
    $params.page++
    
} while ($response.data.count -gt 0)

# Process the data
# $endpoint = "https://irs.service-now.com/api/now/table/sys_user"
# $headers = @{}

# foreach($item in $data) {
#     $params = @{
#         name = $item.name
#         airline = $item.airline.name
#     } | ConvertTo-Json

#     $response = Invoke-RestMethod -Uri $endpoint -Method PUT -Body $params
    
# }