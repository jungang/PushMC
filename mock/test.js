
function sum() {
  console.log(arguments)
  console.log(arguments[0])
  Array.from(arguments).forEach(item => {
    console.log(item)
  })
}

const obj = {
  a: 1,
  b: 2,
  c: 3
}
sum(obj)

