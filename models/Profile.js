import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Profile Schema
const profileSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

const Profile = model('Profile', profileSchema);

export default Profile;