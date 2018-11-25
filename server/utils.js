const replaceToCyrillic = str => {
  return str
    .toString()
    .replace(/ă/g, 'ӑ')
    .replace(/Ă/g, 'Ӑ')
    .replace(/ĕ/g, 'ӗ')
    .replace(/Ĕ/g, 'Ӗ')
    .replace(/ç/g, 'ҫ')
    .replace(/Ç/g, 'Ҫ')
    .replace(/ÿ/g, 'ӳ')
    .replace(/Ÿ/g, 'Ӳ');
};

module.exports = replaceToCyrillic;