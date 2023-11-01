const arr = ["a", "a", "b", "c", "d", "d", "d", "e", "e"];

let res = []

arr.forEach(el => {
    if(!res.includes(el)) res.push(el)
})

console.log(res)