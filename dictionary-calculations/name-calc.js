const firstName = 'John'
const lastName = 'Doe'
const preferredName = 'Johnny'
const middleName = 'B'
const oa = null

const fullName = `${ lastName }, ${ preferredName ?? firstName } ${ middleName } ${ oa ? '(' + oa + ')' : '' }`

console.log(fullName)