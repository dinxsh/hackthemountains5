const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB connection string (replace with your actual connection string)
const mongoURI = 'mongodb+srv://test:test@main.c56lphq.mongodb.net/?retryWrites=true&w=majority&appName=main';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a schema for your document
const DocumentSchema = new mongoose.Schema({
  // Define your schema fields here
  // For example:
  // title: String,
  // content: String,
  // createdAt: Date
});

// Create a model from the schema
const Document = mongoose.model('Document', DocumentSchema);

// Route to get a document by ID
app.get('/document/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving document', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
