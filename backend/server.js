const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://sricharankolachalama:Charan05@cluster101.qwrvkrr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster101',)
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));

// const adminRoutes = require('./routes/admin');
// app.use('/api/admin', adminRoutes);
// app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
