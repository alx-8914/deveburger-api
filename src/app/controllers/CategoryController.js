import * as Yup from 'yup';
import Category from './models/Category';
import User from '../controllers/models/User'


class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
      return response.status(401).json({ error: 'Unauthorized. Only admins can perform this action.' });
    }

    if (!request.file) {
      return response.status(400).json({ error: 'File not provided' });
    }

    const { filename: path } = request.file
    const { name } = request.body;

    const categoryExists = await Category.findOne({
      where: {
        name
      },
    });
    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const { id } = await Category.create({
      name,
      path,
    });

    return response.status(201).json({ id, name });
  }

  async index(request, response) {
    const category = await Category.findAll();
  
    return response.json(category);
  }


  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().notRequired(), // Este campo é opcional no update
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
      return response.status(401).json({ error: 'Unauthorized. Only admins can perform this action.' });
    }

    const { id } = request.params;

    const categoryExists = await Category.findByPk(id);
    if (!categoryExists) {
      return response.status(400).json({ error: 'Invalid category ID' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name } = request.body;

    if (name) {
      const categoryNameExists = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryNameExists && categoryExists.id !== id) {
        return response.status(400).json({ error: 'Category with this name already exists' });
      }
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (path) updatedData.path = path;

    await Category.update(updatedData, {
      where: { id }
    });


    return response.status(200).json({ message: 'Category updated successfully' });
  }
}
export default new CategoryController();