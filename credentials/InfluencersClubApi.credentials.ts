import { 
	ICredentialType, 
	INodeProperties, 
	ICredentialTestRequest,
	IHttpRequestOptions, 
	IAuthenticateGeneric
} from "n8n-workflow";

export class InfluencersClubApi implements ICredentialType {
	name = "influencersClubApi";
	displayName = "Influencers Club API";
	documentationUrl = "https://dashboard.influencers.club/api";
	defaults = {
		name: "Influencers Club API",
	};

	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "=Bearer {{$credentials.apiKey}}",
				"Content-Type": "application/json",
				"X-Origin": "n8n",
				"X-Integration": "influencers-n8n",
			},
		},
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
			url: 'https://api-dashboard.influencers.club/public/v1/creators/enrich/email/',
			method: 'POST',
			body: {
				email: 'test@example.com',
			},
		},
	};
} 