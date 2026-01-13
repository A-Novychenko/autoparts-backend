const { Group } = require('../../models/asg/groups');
const { ASGProduct } = require('../../models/asg/products');

const { HttpError } = require('../../helpers');

const updProductGroup = async (req, res) => {
  const productId = req.params.id;

  const groupId = req.body.id;

  console.log('groupId', groupId);

  let group;

  if (groupId !== null) {
    group = await Group.findById(groupId);

    if (!group) {
      throw HttpError(404);
    }
  }

  const product = await ASGProduct.findById(productId);

  if (!product) {
    throw HttpError(404);
  }

  const upgGroupId = group ? group._id : null;
  const upgGroupName = group ? group.name : null;

  const updProduct = await ASGProduct.findByIdAndUpdate(
    productId,
    { groupId: upgGroupId, groupName: upgGroupName },
    { new: true },
  );

  console.log('updProduct', updProduct);

  res.json({
    status: 'OK',
    code: 200,
    product: updProduct,
  });
};

module.exports = updProductGroup;
