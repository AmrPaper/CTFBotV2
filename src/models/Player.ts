import { Schema, model, Document } from 'mongoose';

export interface Player extends Document {
    _id: string;
    name: string;
    currentPhase: number;
    team?: string;
    phaseStartTime: Date;
    joinedAt: Date;
    lastActive: Date;
}

const playerSchema = new Schema<Player>({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    currentPhase: {type: Number, default: 1, required: true},
    team: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
    phaseStartTime: {type: Date, default: null},
    joinedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now}
});

export const Player = model<Player>('Player', playerSchema);