const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'O nome da academia é obrigatório'],
        trim: true,
        maxlength: [100, 'O nome não pode ter mais que 100 caracteres']
    },
    address: { 
        type: String, 
        required: [true, 'O endereço é obrigatório'],
        trim: true
    },
    open_time: { 
        type: String, 
        required: [true, 'O horário de funcionamento é obrigatório'],
        trim: true
    },
    email_address: { 
        type: String, 
        required: [true, 'O e-mail é obrigatório'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um e-mail válido']
    },
    phone: { 
        type: String, 
        required: [true, 'O telefone é obrigatório'],
        trim: true
    },
    user_responsible: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para melhor performance
GymSchema.index({ user_responsible: 1 });
GymSchema.index({ name: 'text', address: 'text' });

module.exports = mongoose.model('Gym', GymSchema);