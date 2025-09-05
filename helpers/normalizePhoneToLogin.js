const normalizePhoneToLogin = phone => {
  let digits = phone.replace(/\D/g, ''); // только цифры
  if (digits.startsWith('38')) {
    digits = digits.slice(2); // убираем "38"
  }
  return digits; // например "0639993570"
};

module.exports = normalizePhoneToLogin;
