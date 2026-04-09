const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Endpoints de la API
app.use('/api/users', require('./routes/users'));
app.use('/api/negocios', require('./routes/negocios'));

// 2. Endpoint de Subida Único
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('imagen'), (req, res) => {
    if(!req.file) return res.status(400).json({ error: "No se subió ningún archivo" });
    const url = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: url });
});

// 3. Servir Archivos Estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use(express.static(path.join(__dirname, '../Partes')));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB conectado exitosamente a TEFTI'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor TEFTI corriendo en el puerto ${PORT}`);
});
