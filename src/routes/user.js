import express from 'express';
import bcrypt from 'bcrypt';
import Usuario from './models/usuarios.js';

const router = express.Router();

// Crear un nuevo usuario
router.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validar que todos los campos estén presentes
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario (mapeo a esquema `usuarios`)
        const newUser = new Usuario({
            nombreUsuario: name || email,
            correoElectronico: email,
            password: hashedPassword
        });
        
        // Guardar en la base de datos
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Obtener todos los usuarios
router.get("/users", async (req, res) => {
    try {
        const users = await Usuario.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({ correoElectronico: email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        res.status(200).json({ message: "Login exitoso", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario específico
router.get("/user/:id", async (req, res) => {
    try {
        const user = await Usuario.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar usuario
router.put("/user/:id", async (req, res) => {
    try {
        const updatedUser = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar usuario
router.delete("/user/:id", async (req, res) => {
    try {
        const user = await Usuario.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;