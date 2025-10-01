import { Schema, model, Document, ObjectId } from 'mongoose';
import { IPlayer } from './Player';

export interface ITeamBase extends Document {
    _id: ObjectId;
    name: string;
    currentPhase: number;
    roleID: string;
    channelID: string;
    colour: string;
    phaseStartTime: number | null;
    establishedAt: Date;
    lastActive: Date;
    totalPlaytime: number;
    isPaused: boolean;
    pauseStartTime: number | null;
}

export interface ITeam extends ITeamBase {
    members: ObjectId[];
}

export interface ITeamPopulated extends ITeamBase {
    members: IPlayer[];
}

const teamSchema = new Schema<ITeam>({
    name: {type: String, required: true, unique: true},
    members: [{type: Schema.Types.ObjectId, ref: 'Player'}],
    currentPhase: {type: Number, default: 0, required: true},
    roleID: {type: String, required: true},
    channelID: {type: String, required: true},
    colour: {type: String, required: true},
    phaseStartTime: {type: Number, default: null},
    establishedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now},
    totalPlaytime: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    pauseStartTime: { type: Number, default: null }
});

export const Team = model<ITeam>('Team', teamSchema);