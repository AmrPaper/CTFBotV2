import { Schema, model, Document, ObjectId } from 'mongoose';
import { ITeamBase } from './Team';

export interface IPlayerBase extends Document {
    _id: ObjectId;
    discordId: string;
    name: string;
    currentPhase: number;
    phaseStartTime: number | null;
    joinedAt: Date;
    totalPlaytime: number;
    isPaused: boolean;
    pauseStartTime: number | null;
}
export interface IPlayer extends IPlayerBase {
    team?: ObjectId | null;
}
export interface IPlayerPopulated extends Omit<IPlayer, "team"> {
    team?: ITeamBase | null;
}

const playerSchema = new Schema<IPlayer>({
    discordId: {type: String, required: true},
    name: {type: String, required: true},
    currentPhase: {type: Number, default: 0, required: true},
    team: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
    phaseStartTime: {type: Number, default: null},
    joinedAt: {type: Date, default: Date.now},
    totalPlaytime: { type: Number, default: 0 },
    isPaused: { type: Boolean, default: false },
    pauseStartTime: { type: Number, default: null }
});

export const Player = model<IPlayer>('Player', playerSchema);