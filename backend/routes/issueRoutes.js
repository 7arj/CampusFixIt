const express = require('express');
const multer = require('multer');
const Issue = require('../models/Issue');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Image Upload Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, `${Date.now()}-${file.originalname}`); },
});
const upload = multer({ storage });

// Create Issue
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { title, description, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const issue = await Issue.create({
    user: req.user._id,
    title,
    description,
    category,
    imageUrl,
  });
  res.status(201).json(issue);
});

// Get All Issues (Admin sees all, Student sees theirs)
router.get('/', protect, async (req, res) => {
  let issues;
  if (req.user.isAdmin) {
    issues = await Issue.find().populate('user', 'name email');
  } else {
    issues = await Issue.find({ user: req.user._id });
  }
  res.json(issues);
});

// Update Status (Admin Only)
router.put('/:id/status', protect, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Not authorized as admin' });

  const issue = await Issue.findById(req.params.id);
  if (issue) {
    issue.status = req.body.status || issue.status;
    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

module.exports = router;