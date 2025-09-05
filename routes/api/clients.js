const express = require('express');

const { authenticate, isValidId } = require('../../middlewares');
const { addClient, fetchClients } = require('../../controllers/clients');
const fetchShipmentsByClient = require('../../controllers/clients/fetchShipmentsByClient');

const router = express.Router();

router.post('/new', authenticate, addClient);

router.get('/', authenticate, fetchClients);

router.get('/shipments/:id', authenticate, isValidId, fetchShipmentsByClient);

module.exports = router;

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

// const express = require('express');

// const { authenticate } = require('../../middlewares');
// const { addClient } = require('../../controllers/clients');
// const { Order } = require('../../models/orders/order');
// const { Client } = require('../../models/clients/clients');

// const router = express.Router();

// router.post('/new', authenticate, addClient);

// // routes/utils/createClientsFromOrders.js

// // const express = require('express');
// // const router = express.Router();

// // вспомогательная функция для очистки телефона
// function normalizePhone(phone) {
//   let digits = phone.replace(/\D/g, '');
//   if (digits.startsWith('38')) {
//     digits = digits.slice(2);
//   }
//   return digits;
// }

// router.post('/migrate-clients', async (req, res) => {
//   try {
//     const orders = await Order.find();

//     let created = 0;
//     let skipped = 0;

//     for (const order of orders) {
//       // ⚠️ тут зависит от вашей схемы Order
//       const clientName = order.name;
//       const clientPhone = order.phone;
//       const clientEmail = order.email;

//       console.log('ORDER DATA:', { clientName, clientPhone, clientEmail });

//       if (!clientPhone) {
//         skipped++;
//         continue;
//       }

//       const login = normalizePhone(clientPhone);

//       // проверяем
//       const existing = await Client.findOne({ login });
//       if (existing) {
//         console.log(`Skip: client with login ${login} already exists`);
//         skipped++;
//         continue;
//       }

//       // создаём
//       const newClient = new Client({
//         name: clientName || 'No Name',
//         phone: clientPhone,
//         email: clientEmail || '',
//         login,
//         password: '',
//       });

//       await newClient.save();
//       console.log(`Created client: ${newClient.login}`);
//       created++;
//     }

//     res.json({ message: 'Migration complete', created, skipped });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
////////////////////////////////////////////\\

// routes/utils/migrateOrders.js

// routes/utils/migrateOrders.js
// const express = require('express');
// const { Order } = require('../../models/orders/order');
// const { Client } = require('../../models/clients/clients');
// const { Shipment } = require('../../models/clients/shipments');

// const router = express.Router();

// вспомогательная функция для очистки телефона
// function normalizePhone(phone) {
//   if (!phone) return '0000000000';
//   let digits = phone.replace(/\D/g, ''); // убираем всё кроме цифр
//   if (digits.startsWith('38')) {
//     digits = digits.slice(2);
//   }
//   return digits;
// }

// // подсчёт суммы заказа
// function calcTotals(products = []) {
//   let totalAmount = 0;

//   for (const p of products) {
//     const price = p.price_promo || p.price || 0;
//     const qty = p.quantity || 1;
//     totalAmount += price * qty;
//   }

//   return {
//     totalAmount,
//     totalAmountWithDiscount: totalAmount, // скидок пока нет
//     totalDiscount: 0,
//   };
// }

// router.post('/migrate-orders', async (req, res) => {
//   try {
//     const orders = await Order.find();
//     let updated = 0;

//     for (const order of orders) {
//       //   console.log('order', order);
//       //   const clientLogin = normalizePhone(order.phone);
//       //   console.log('clientLogin', clientLogin);
//       //   const { totalAmount, totalAmountWithDiscount, totalDiscount } =
//       //     calcTotals(order.products);

//       //     //   order.clientLogin = clientLogin;

//       const clientId = await Client.findOne({
//         login: normalizePhone(order.phone),
//       });

//       order.client = clientId._id;
//       order.message = order.message || '';
//       order.comment = order.comment || '';
//       order.delivery = order.delivery || 'post';
//       order.deliveryCity = order.deliveryCity || '';
//       order.postOffice = order.postOffice || '';
//       order.payment = order.payment || 'prepayment';
//       order.totalAmount = order.totalAmount;
//       order.totalAmountWithDiscount = order.totalAmountWithDiscount;
//       order.totalDiscount = order.totalDiscount;

//       //   // поля name, phone, email можно убрать если они больше не нужны:
//       //   order.name = undefined;
//       //   order.phone = undefined;
//       //   order.email = undefined;

//       await order.save();
//       updated++;
//     }

//     res.json({ message: 'Orders migration complete', updated });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// router.post('/migrate-shipments', async (req, res) => {
//   try {
//     const orders = await Order.find().populate('client');
//     let createdCount = 0;

//     for (const order of orders) {
//       if (!order.client) continue;

//       // проверка, чтобы не создавать дубли
//       if (order.shipment) continue;

//       const shipment = await Shipment.create({
//         client: order.client._id,
//         delivery: order.delivery || 'pickup',
//         deliveryCity: order.deliveryCity || '',
//         postOffice: order.postOffice || '',
//         payment: order.payment || 'card',
//       });

//       order.shipment = shipment._id;
//       await order.save();

//       createdCount++;
//     }

//     res.json({ message: 'Миграция завершена', created: createdCount });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Ошибка миграции' });
//   }
// });

// module.exports = router;
