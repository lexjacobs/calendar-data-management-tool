export function serializedObject(array) {
  let result = {};
  array.forEach(x => {
    result[x.name] = x.value;
  });
  return result;
}

export function serializedAttributes(array, key) {
  return serializedObject.call(this, array)[key];
}
