import { error } from "winston";
import { Player, IPlayer } from "../models/Player.js";
import { Team, ITeam } from "../models/Team.js";

export async function grabPlayerDB(discordId: string, options?: { populateTeam?: boolean, logIfNotFound?: boolean}): Promise<IPlayer | null>  {
    let query = Player.findOne({discordId: discordId});
    if (options?.populateTeam) query = query.populate("team");
    const player = await query;
    if (!player && options?.logIfNotFound) console.error(`Failed to fetch player with id ${discordId}`);
    return player;
}

export async function grabTeamDB(teamName: string, options?: { populateMembers?: boolean, logIfNotFound?: boolean}): Promise<ITeam | null> {
    let query = Team.findOne({name: teamName});
    if (options?.populateMembers) query = query.populate("members");
    const team = await query;
    if (!team && options?.logIfNotFound) console.error(`Failed to fetch team with the name ${teamName}`);
    return team;
}

export async function createPlayerDB(data: Partial<IPlayer>): Promise<boolean> {
    try {
        await Player.create(data);
        return true;
    } catch (error) {
        console.error(`Failed to register player.`);
        return false;
    }
}

export async function updatePlayerDB(discordId: string, fields: Partial<IPlayer>): Promise<boolean> {
    try {await Player.updateOne({discordId: discordId}, {$set: fields});
        return true;
    } catch (error) {
        console.error(`Failed to update player with id ${discordId} in DB.`);
        return false;
    }
}

export async function updateTeamDB(teamName: string, fields: Partial<ITeam>): Promise<boolean> {
    try {await Team.updateOne({name: teamName}, fields);
        return true;
    } catch (error) {
        console.error(`Failed to update team with name ${teamName} in DB.`);
        return false;
    }
}

export async function deletePlayerDB(discordId: string): Promise<boolean> {
    try {
        const player = await Player.findOne({discordId: discordId});
        if (!player) return false;

        const playerId = player._id;
        await Player.deleteOne({ _id: playerId });
        await Team.updateMany(
            { members: playerId },
            { $pull: { members: playerId } }
        );

        return true;
    } catch (error) {
        console.error(`Failed to delete player with id ${discordId}, please review the player's database entry to ensure nothing occured to the team.`, error);
        return false;
    }
}

export async function syncPlayerWithTeam(discordID: string, team: ITeam) {
    const success = await updatePlayerDB(discordID, {
        currentPhase: team.currentPhase,
        phaseStartTime: team.phaseStartTime,
        team: team._id
    });

    if (!success) {
        throw new Error(`Failed to sync player ${discordID} with team ${team.name}`);
    }
}