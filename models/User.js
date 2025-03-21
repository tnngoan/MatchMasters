import { Schema, model } from 'mongoose';

// User Schema
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['judge', 'organizer'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Judge Profile Schema
const judgeProfileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    sports: [{ type: String }],
    certifications: [{ type: String }],
    experience: { type: Number },
    hourlyRate: { type: Number },
    availability: [{
      date: { type: Date },
      isAvailable: { type: Boolean }
    }],
    bio: { type: String },
    contactInfo: {
      phone: { type: String },
      email: { type: String }
    },
    ratings: [{
      score: { type: Number },
      comment: { type: String },
      eventId: { type: Schema.Types.ObjectId, ref: 'Event' }
    }]
});

const User = model('User', userSchema);
const JudgeProfile = model('JudgeProfile', judgeProfileSchema);

export { User, JudgeProfile };