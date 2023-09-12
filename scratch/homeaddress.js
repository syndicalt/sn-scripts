var obj = {
    "home_address_line_1": "123 Main St",
    "home_address_line_2": "Apt 1",
    "home_address_line_3": null,
    "home_city": "Anytown",
    "home_state": "NY",
    "home_zip": "12345",
    "home_country": "US",
    "birth_city": "Omaha",
    "birth_state": "NE",
    "birth_country": "US"
}

// loop through object and create key-value pairs
var str = Object.keys(obj).reduce(function(acc, curr) {
    acc += 'u_' + curr + '=' + obj[curr] + '\n'

    return acc
}
, '')

console.log(str)