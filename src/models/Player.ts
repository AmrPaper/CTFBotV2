import { Schema, model, Document, ObjectId } from 'mongoose';
import { ITeamBase } from './Team';

export interface IPlayerBase extends Document {
    _id: ObjectId;
    discordId: string;
    name: string;
    currentPhase: number;
    phaseStartTime: Date | null;
    joinedAt: Date;
    lastActive: Date;
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
    currentPhase: {type: Number, default: 1, required: true},
    team: {type: Schema.Types.ObjectId, ref: 'Team', default: null},
    phaseStartTime: {type: Date, default: null},
    joinedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now}
});

export const Player = model<IPlayer>('Player', playerSchema);