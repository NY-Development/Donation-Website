const express = require('express');
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorize');
const { validateRequest } = require('../middleware/validateRequest');
const { updateUserSchema } = require('../validation/user.validation');

const router = express.Router();

// Protected routes
router.use(authenticate);

router.get('/me', userController.getCurrentUser);
router.put('/me', validateRequest(updateUserSchema), userController.updateCurrentUser);
router.delete('/me', userController.deleteCurrentUser);

// Admin routes
router.get('/', authorize('ADMIN'), userController.getAllUsers);
router.get('/:id', authorize('ADMIN'), userController.getUserById);
router.put('/:id', authorize('ADMIN'), validateRequest(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('ADMIN'), userController.deleteUser);

module.exports = router;
