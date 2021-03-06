let input = `d,"e, f",g` // --> { `a`, `b`, `c` }

const csv_parser = (str) => {
  const strArr = [];

  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '"');
    count++;
  }

  if (count % 2 != 0) {
    return new Error();
  }

  let value = '';
  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === ',') {
      strArr.push(value);
      value = '';
      continue
    } else if (str.charAt(i) === '"') {
      i++;
      while (str.charAt(i) !== '"') {
        value += str.charAt(i);
        i++;
      }
      continue;
    }
    value += str.charAt(i);
    } 
  strArr.push(value);
  return strArr;
}

console.log(csv_parser(`"""`))

// `d,"e, f",g` --> { `d`, `e, f`, `g` }