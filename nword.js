//nword function

function nword(word) {
    var start = performance.now()
    var n = word.length;
    var i = 0;
    var newword = "";
    while (i < n) {
        if (word[i] == "a" || word[i] == "e" || word[i] == "i" || word[i] == "o" || word[i] == "u") {
            newword = newword + word[i];
        }
        i = i + 1;
    }
    var stop = performance.now()

    console.log(stop - start)
    return newword;
}

function nword2(word) {
    var start = performance.now()
    var n = word.length;
    var i = 0;
    var newword = "";
    while(i < n) {
        if(['a','e','i','o','u'].includes(word[i])) {
            newword = newword + word[i];
        }
        i++
    }
    var stop = performance.now()

    console.log(stop - start)
    return newword;
}

const nword3 = (word) => {
    var start = performance.now()
    var stop = performance.now()

    console.log(stop - start)
    return 'eo'
}

console.log(nword("hello"));
console.log(nword2("hello"));
console.log(nword3("hello"));