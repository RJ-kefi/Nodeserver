// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://user:user@cluster0.xjskjfa.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema and model for Switch
const switchSchema = new mongoose.Schema({
  switchId: Number,
  status: String
});

const Switch = mongoose.model('Switch', switchSchema);

// API endpoint to update switch status
app.post('/api/switchStatus', async (req, res) => {
  const { switchId, status } = req.body;

  try {
    let switchDoc = await Switch.findOne({ switchId });

    if (switchDoc) {
      switchDoc.status = status;
    } else {
      switchDoc = new Switch({ switchId, status });
    }

    await switchDoc.save();
    res.status(200).send('Switch status updated');
  } catch (error) {
    console.error('Error updating switch status:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${3000}`);
});