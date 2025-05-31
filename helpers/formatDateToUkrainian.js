const formatDateToUkrainian = dateString => {
  const date = new Date(dateString);

  const options = { timeZone: 'Europe/Kyiv' };

  const addLeadingZero = value => String(value).padStart(2, '0');

  const day = date.toLocaleString('uk-UA', { day: '2-digit', ...options });
  const month = date.toLocaleString('uk-UA', { month: '2-digit', ...options });
  const year = date.toLocaleString('uk-UA', { year: 'numeric', ...options });
  const hours = addLeadingZero(date.getHours());
  const minutes = addLeadingZero(date.getMinutes());
  const seconds = addLeadingZero(date.getSeconds());

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

module.exports = formatDateToUkrainian;
