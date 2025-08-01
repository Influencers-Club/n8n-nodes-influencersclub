import { 
	ICredentialType, 
	INodeProperties, 
	ICredentialTestRequest,
	IHttpRequestOptions 
} from "n8n-workflow";

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

	test: ICredentialTestRequest = {
		request: {
			url: 'https://api-dashboard.influencers.club/public/v1/enrichment/creators/enrich-by-email/',
			method: 'POST',
			body: {
				email: 'test@example.com',
				include_connected_platforms_data: false,
				include_income_data: false,
				only_above_1000_followers: false,
				exclude_social_media: []
			},
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer {{$credentials.influencersClubApi.apiKey}}',
			},
		},
	};
} 