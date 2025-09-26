import { Schema, model, Document, ObjectId } from 'mongoose';
import { IPlayer } from './Player';

export interface ITeamBase extends Document {
    _id: ObjectId;
    name: string;
    currentPhase: number;
    roleID: string;
    channelID: string;
    colour: string;
    phaseStartTime: Date;
    establishedAt: Date;
    lastActive: Date;
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
    currentPhase: {type: Number, default: 1, required: true},
    roleID: {type: String, required: true},
    channelID: {type: String, required: true},
    colour: {type: String, required: true},
    phaseStartTime: {type: Date, default: null},
    establishedAt: {type: Date, default: Date.now},
    lastActive: {type: Date, default: Date.now}
});

export const Team = model<ITeam>('Team', teamSchema);