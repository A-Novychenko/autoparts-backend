const { HttpError, buildAncestors } = require('../../helpers');
const { Group } = require('../../models/asg/groups');

// 3. Обновить группу (с пересчетом вложенности)
const updateCmsGroup = async (req, res) => {
  const { id } = req.params;
  const { name, slug, parent, margin, img, isVisible, description } = req.body;

  // Находим текущую группу
  const group = await Group.findById(id);
  if (!group) throw HttpError(404, 'Группа не найдена');

  // Проверка: нельзя назначить родителя самому себе или своим детям (циклическая ссылка)
  if (parent && parent === id) {
    throw HttpError(400, 'Нельзя выбрать самого себя родителем');
  }

  // Флаг, изменился ли родитель
  const isParentChanged =
    parent !== undefined && String(group.parent) !== String(parent);

  let newAncestors = group.ancestors;

  if (isParentChanged) {
    // Если родитель сменился, пересчитываем предков для ЭТОЙ группы
    newAncestors = await buildAncestors(parent, Group);
  }

  // Обновляем саму группу
  const updatedGroup = await Group.findByIdAndUpdate(
    id,
    {
      name,
      slug,
      parent: parent || null,
      ancestors: newAncestors,
      margin,
      img,
      isVisible,
      description: description || null,
    },
    { new: true },
  );

  // === МАГИЯ РЕКУРСИИ ===
  // Если родитель изменился, нужно обновить ancestors у ВСЕХ детей и внуков
  if (isParentChanged) {
    // Находим всех потомков, у которых в предках числится эта группа
    const children = await Group.find({ 'ancestors._id': id });

    // Для каждого потомка пересчитываем путь
    // Это тяжелая операция, но для категорий (которых обычно < 1000) это нормально
    for (const child of children) {
      // Находим индекс текущей группы в предках ребенка, чтобы отрезать старый "хвост" и приклеить новый
      const parentIndex = child.ancestors.findIndex(
        a => String(a._id) === String(id),
      );

      if (parentIndex !== -1) {
        // Оставляем только ту часть пути ребенка, которая идет ПОСЛЕ текущей группы
        const childPathSuffix = child.ancestors.slice(parentIndex + 1);

        // Новый путь: [Новые предки текущей группы] + [Текущая группа] + [Хвост ребенка]
        const newChildAncestors = [
          ...newAncestors,
          {
            _id: updatedGroup._id,
            name: updatedGroup.name,
            slug: updatedGroup.slug,
          },
          ...childPathSuffix,
        ];

        await Group.findByIdAndUpdate(child._id, {
          ancestors: newChildAncestors,
        });
      }
    }
  }

  res.json({
    status: 'OK',
    code: 200,
    group: updatedGroup,
  });
};

module.exports = updateCmsGroup;
