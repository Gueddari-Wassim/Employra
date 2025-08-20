require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const appRoutes =require('./routes/appRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');


const app = express();

// Middlewares
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials:true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);


app.use(express.json());


app.use('/uploads/', express.static(path.join(__dirname + '/uploads'), {}));
app.use("/api/auth", authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/jobs",jobRoutes);
app.use("/api/applications",appRoutes);
app.use('/api/save-jobs',savedJobRoutes);
app.use('/api/analytics', analyticsRoutes);




app.get('/test', (req, res) => {
    res.json('test response');
}
);










const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur demarre sur le port ${PORT}`);
});