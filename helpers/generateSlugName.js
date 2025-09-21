/* eslint-disable quotes */
const generateSlugName = name => {
  const map = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'h',
    ґ: 'g',
    д: 'd',
    е: 'e',
    є: 'ye',
    ж: 'zh',
    з: 'z',
    и: 'y',
    і: 'i',
    ї: 'yi',
    й: 'y',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ь: '',
    ю: 'yu',
    я: 'ya',
    '’': '',
    "'": '',
    ʼ: '', // апострофи
  };

  return name
    .toLowerCase()
    .split('')
    .map(char => map[char] ?? char) // транслітерація
    .join('')
    .replace(/[^a-z0-9]+/g, '-') // заміна всього зайвого на дефіс
    .replace(/^-+|-+$/g, '') // обрізання дефісів з країв
    .replace(/-{2,}/g, '-'); // злиття множинних дефісів
};

module.exports = generateSlugName;
