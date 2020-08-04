function matrix(arr, size) {
  let len = arr.length/size;
  let matrix = [];
  for (let i = 0; i < len; i++) {
    matrix[i] = arr.slice(i * size, (i + 1) * size);
  }
  return matrix;
}

export default {
  matrix
};
