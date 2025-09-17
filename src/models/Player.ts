import { Schema, model, Document, ObjectId } from 'mongoose';
import { ITeam } from './Team';

export interface IPlayer extends Document {
    _id: ObjectId;
    discordId: string;
    name: string;
    currentPhase: number;
    team?: ITeam | null;
    phaseStartTime: Date | null;
    joinedAt: Date;
    lastActive: Date;
}

const playerSchema = new Schema<IPlayer>({
    discordId: {type: String, required: true},
    name: {type: String, required: true},
    currentPhase: {type: Number, default: 1, required: true},
    team: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
    phaseStartTime: {type: Date, default: null},
    joinedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now}
});

export const Player = model<IPlayer>('Player', playerSchema);