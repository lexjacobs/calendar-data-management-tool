export function serializedAttributes(array, key) {
  let result = {};
  array.forEach(x => {
    result[x.name] = x.value;
  });
  return result[key];
}

export function serializedObject(array) {
  let result = {};
  array.forEach(x => {
    result[x.name] = x.value;
  });
  return result;
}
