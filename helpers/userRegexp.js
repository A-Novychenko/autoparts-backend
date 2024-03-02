// // може містити тільки латинські символи у верхньому та нижньому регістрі та цифри
// const loginRegexp = /^[a-zA-Z0-9]+$/;

// // регулярний вираз відповідає рядку, який містить слова,
// //     де кожне слово може містити літери латинського або кириличного алфавіту,
// //         розділені пробілами або апострофами,
// //     з можливістю наявності тире або пробілу після апострофа або тире.
// const nameRegexp = /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/;

// // вираз відповідає рядку, який містить літери латинського алфавіту у верхньому
// // та нижньому регістрі, цифри та спеціальні символи: !@#$ %^&* ()_
// const passwordRegexp = /^[A-Za-z0-9!@#$%^&*()_]+$/;

// const userRegexp = { loginRegexp, nameRegexp, passwordRegexp };

// module.exports = userRegexp;

const loginRegexp = /^.*/;

const nameRegexp = /^.*/;

const passwordRegexp = /^.*/;

const userRegexp = { loginRegexp, nameRegexp, passwordRegexp };

module.exports = userRegexp;
