export default function getSortedMbti(array) {
  const res = [];
  const counts = array.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});

  for (let mbti in counts) {
    res.push([mbti, counts[mbti]]);
  }

  res.sort((a, b) => {
    return b[1] - a[1];
  });

  return res;
}
