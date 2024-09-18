const { StatusCodes } = require('http-status-codes')
const Category = require('../models/Category');

exports.createCategory = (req, res) => {
    const { name, description } = req.body;

    const newCategory = new Category({ name, description });

    newCategory.save((err, category) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        res.status(StatusCodes.CREATED).json({ message: 'Category created successfully', category });
    });
};

exports.getCategoryById = (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        if (!category) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
        res.status(StatusCodes.OK).json(category);
    });
};

exports.updateCategory = (req, res) => {
    const { name, description } = req.body;

    Category.findByIdAndUpdate(req.params.id, { name, description, updatedAt: Date.now() }, { new: true }, (err, category) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        if (!category) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
        res.status(StatusCodes.OK).json({ message: 'Category updated successfully', category });
    });
};

exports.deleteCategory = (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err, category) => {
        if (err) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        if (!category) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
        res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
    });
};
