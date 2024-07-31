const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exploitSchema = new mongoose.Schema({
    address: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now },
});

const Exploit = mongoose.model('Exploit', exploitSchema);

const saveExploit = async (address, amount) => {
    const exploit = new Exploit({ address, amount });
    await exploit.save();
    console.log('Exploit saved to database');
};

module.exports = { saveExploit };
