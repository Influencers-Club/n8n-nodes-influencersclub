import { ICredentialType, INodeProperties } from "n8n-workflow";

export class InfluencersClubApi implements ICredentialType {
	name = "influencersClubApi";
	displayName = "Influencers Club API";
	documentationUrl = "https://dashboard.influencers.club/api";
	defaults = {
		name: "Influencers Club API",
	};
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			description: "Your Influencers Club API key. Find it at https://dashboard.influencers.club/api",
			required: true,
		},
	];
} 