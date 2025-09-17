import { Schema, model, Document, ObjectId } from 'mongoose';

export interface ITeam extends Document {
    _id: ObjectId;
    name: string;
    members: ObjectId[];
    currentPhase: number;
    roleID: string;
    channelID: string;
    colour: string;
    phaseStartTime: Date;
    establishedAt: Date;
    lastActive: Date;
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