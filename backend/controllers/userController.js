const User = require('../models/User');
const logger = require('../config/logger');


exports.getAllUsers = async (req, res) => {
    try {
        logger.info('Fetching all users');
        const users = await User.find().select('-password');
        logger.info(`Successfully retrieved ${users.length} users`);
        res.json(users);
    } catch (error) {
        logger.error('Error fetching users', {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        logger.info('Fetching user by ID', { userId: req.params.id });
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            logger.warn('User not found', { userId: req.params.id });
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info('Successfully retrieved user', { userId: user._id });
        res.json(user);
    } catch (error) {
        logger.error('Error fetching user by ID', {
            userId: req.params.id,
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({ message: error.message });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, phone } = req.body;
        logger.info('Creating new user', { email: req.body.email });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('Email already registered', { email: req.body.email });
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User({
            firstName, 
            lastName,
            email,
            password,
            age,
            phone
        });

        const savedUser = await user.save();
        logger.info('User created successfully', { userId: savedUser._id });

        const userResponse = savedUser.toObject();
        delete userResponse.password;
        
        res.status(201).json(userResponse);
    } catch (error) {
        logger.error('Error creating user', {
            error: error.message,
            stack: error.stack,
            userData: req.body
        });
        res.status(400).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updates = req.body;
        
        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add login functionality
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        logger.info('User login attempt', { email });

        const user = await User.findOne({ email });
        if (!user) {
            logger.warn('Login failed - User not found', { email });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn('Login failed - Invalid password', { email });
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = user.generateAuthToken();
        logger.info(`User ${email} logged in successfully`);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            user: userResponse,
            token
        });

    } catch (error) {
        logger.error('Error during login', {
            error: error.message,
            stack: error.stack,
            email: req.body.email
        });
        res.status(500).json({ message: error.message });
    }
};
