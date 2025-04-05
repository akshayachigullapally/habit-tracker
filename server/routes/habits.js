const express = require('express');
const router = express.Router();
const { 
  createHabit, 
  getHabits, 
  getHabitById, 
  updateHabit, 
  deleteHabit, 
  completeHabit, 
  getHabitStats 
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createHabit)
  .get(protect, getHabits);

router.route('/stats')
  .get(protect, getHabitStats);

router.route('/:id')
  .get(protect, getHabitById)
  .put(protect, updateHabit)
  .delete(protect, deleteHabit);

router.route('/:id/complete')
  .post(protect, completeHabit);

module.exports = router;