import type { MatchDetailsResponse } from "../types/matches";

export function getPlayerWinStatus(
	matchDetailsArray: MatchDetailsResponse[],
	playerSubject: string,
): (boolean | null)[] {
	return matchDetailsArray.map((matchDetails) => {
		// Find the player
		const player = matchDetails.players.find(
			(p) => p.subject === playerSubject,
		);
		if (!player) {
			// Player not in this match
			console.debug("GETPLAYERWINSTATS: ", "player not found");
			return null;
		}

		const playerTeamId = player.teamId;

		// Check if the player's team won
		const team = matchDetails.teams?.find((t) => t.teamId === playerTeamId);
		if (!team) {
			// Team not found
			console.debug("GETPLAYERWINSTATS: ", "player team not found");
			return null;
		}

		return team.won; // Return true if the team won, false otherwise
	});
}
