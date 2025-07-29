export class InfluencersClubApi {
    constructor() {
        this.name = "influencersClubApi";
        this.displayName = "Influencers Club API";
        this.documentationUrl = "https://dashboard.influencers.club/api";
        this.defaults = {
            name: "Influencers Club API",
        };
        this.properties = [
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
}
