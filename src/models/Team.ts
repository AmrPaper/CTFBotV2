import { Schema, model, Document } from 'mongoose';

export interface Team extends Document {
    name: string;
    members: string[];
    currentPhase: number;
    roleID: string;
    channelID: string;
    colour: string;
    phaseStartTime: Date;
    establishedAt: Date;
    lastActive: Date;
}

const teamSchema = new Schema<Team>({
    name: {type: String, required: true, unique: true},
    members: [{type: String, ref: 'Player'}],
    currentPhase: {type: Number, default: 1, required: true},
    roleID: {type: String, required: true},
    channelID: {type: String, required: true},
    colour: {type: String, required: true},
    phaseStartTime: {type: Date, default: null},
    establishedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now}
});

export const Team = model<Team>('Team', teamSchema);