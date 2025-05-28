const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticateToken = require('../middleware/authMiddleware');
const Gym = require('../models/Gym');

// Criar uma nova academia
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, address, open_time, email_address, phone } = req.body;
        
        // Verifica se a academia já existe
        const existingGym = await Gym.findOne({ name, user_responsible: req.user.userId });
        if (existingGym) {
            return res.status(409).json({ error: 'Você já possui uma academia com este nome.' });
        }

        const gym = new Gym({
            name,
            address,
            open_time,
            email_address,
            phone,
            user_responsible: req.user.userId
        });

        const savedGym = await gym.save();
        
        res.status(201).json({
            message: 'Academia criada com sucesso!',
            gym: {
                _id: savedGym._id,
                name: savedGym.name,
                address: savedGym.address,
                open_time: savedGym.open_time,
                email_address: savedGym.email_address,
                phone: savedGym.phone,
                createdAt: savedGym.createdAt
            }
        });
    } catch (error) {
        console.error('Erro ao criar academia:', error);
        res.status(500).json({ error: 'Erro ao criar academia' });
    }
});

// Listar todas as academias do usuário
router.get('/', authenticateToken, async (req, res) => {
    try {
        const gyms = await Gym.find({ user_responsible: req.user.userId })
            .select('_id name address open_time email_address phone createdAt')
            .sort({ createdAt: -1 });

        res.json(gyms);
    } catch (error) {
        console.error('Erro ao listar academias:', error);
        res.status(500).json({ error: 'Erro ao listar academias' });
    }
});

// Obter detalhes de uma academia específica
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const gym = await Gym.findOne({
            _id: req.params.id,
            user_responsible: req.user.userId
        });

        if (!gym) {
            return res.status(404).json({ error: 'Academia não encontrada' });
        }

        res.json(gym);
    } catch (error) {
        console.error('Erro ao obter academia:', error);
        res.status(500).json({ error: 'Erro ao obter academia' });
    }
});

// Atualizar uma academia
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const { name, address, open_time, email_address, phone } = req.body;

        const updatedGym = await Gym.findOneAndUpdate(
            { 
                _id: req.params.id,
                user_responsible: req.user.userId 
            },
            { 
                name, 
                address, 
                open_time, 
                email_address, 
                phone 
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (!updatedGym) {
            return res.status(404).json({ error: 'Academia não encontrada' });
        }

        res.json({
            message: 'Academia atualizada com sucesso!',
            gym: updatedGym
        });
    } catch (error) {
        console.error('Erro ao atualizar academia:', error);
        res.status(500).json({ error: 'Erro ao atualizar academia' });
    }
});

// Deletar uma academia
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const deletedGym = await Gym.findOneAndDelete({
            _id: req.params.id,
            user_responsible: req.user.userId
        });

        if (!deletedGym) {
            return res.status(404).json({ error: 'Academia não encontrada' });
        }

        res.json({ message: 'Academia deletada com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar academia:', error);
        res.status(500).json({ error: 'Erro ao deletar academia' });
    }
});

module.exports = router;