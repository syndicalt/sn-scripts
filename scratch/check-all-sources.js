var cert = [
    {
        "scn":"www.com",
        "san": "san",
        "email": "mail@mail.com",
        "managed_by_group": "group02394902852",
        "managed_by": "user320482468",
        "server": "server20824082" 
    }
]

var server = [
    {
        "id": "server20824082",
        "name": "server20824082",
        "support_group": "group2408248203"
    }
]

var groups = [
    {
        "id": "group02394902852",
        "name": "group02394902852",
        "email": "certgroup@email.com"
    },
    {
        "id": "group2408248203",
        "name": "group2408248203",
        "email": "servergroup@email.com"
    }
]

var user = [
    {
        "id": "user320482468",
        "name": "user320482468",
        "email": "user@email.com"
    }
]

var res = []
cert.forEach(el => {
    if(el.email) res.push(el.email)
    if(el.managed_by_group) res.push(groups.filter(function(g) { return g.id === el.managed_by_group })[0].email)
    if(el.managed_by) res.push(user.filter(function(u){ return u.id === el.managed_by })[0].email)
    if(el.server) res.push(groups.filter(function(g){ return g.id === server.filter(function(s){ return s.id === el.server })[0].support_group })[0].email)
})

res.forEach(el => console.log(el))
