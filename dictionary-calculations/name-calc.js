let current = {
    'first_name':'John',
    'last_name':'Doe',
    'u_preferred_name':'Johnny',
    'middle_name':'B',
    'u_oa':'OST',
    'name': null
}

const fullNameSI = `${ current.last_name }, ${ current.u_preferred_name ? current.u_preferred_name : current.first_name } ${ current.middle_name } ${ current.u_oa ? '(' + current.u_oa + ')' : '' }`

var calcFirstName = current.preferred_name ? current.preferred_name : current.first_name
var calcMiddleName = current.middle_name ? current.middle_name : ''
var calcOa = current.u_oa ? '(' + current.u_oa + ')' : ''

current.name = current.last_name + ', ' + calcFirstName + ' ' + calcMiddleName + ' ' + calcOa

console.log(fullNameSI)
console.log(current)