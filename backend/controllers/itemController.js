const Item = require('../models/Item');
const categories = [
    { _id: 1, name: 'Electronics' },
    { _id: 2, name: 'Clothing' },
    { _id: 3, name: 'Books' },
    { _id: 4, name: 'Home & Garden' },
    { _id: 5, name: 'Sports' },
    { _id: 6, name: 'Toys' },
    { _id: 7, name: 'Health & Beauty' },
    { _id: 8, name: 'Automotive' },
    { _id: 9, name: 'Other' }
];

exports.getAllItems = async (req, res) => {
    try {

        const {
            search,           // Search in name and description
            minPrice,
            maxPrice,
            category,
        } = req.query;

        // Build query object
        const query = {
            seller: { $ne: req.user._id } // Exclude user's own items
        };

        // Search in both name and description using regex
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

          // Price range
          if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined) query.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }

        // Category filter
        if (category && category !== '') {
            query.category = category;
        }

        const items = await Item.find(query);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const item = new Item(req.body);
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
