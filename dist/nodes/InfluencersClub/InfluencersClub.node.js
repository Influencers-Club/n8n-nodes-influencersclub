export class InfluencersClub {
    constructor() {
        this.description = {
            displayName: "Influencers Club",
            name: "influencersClub",
            group: ["transform"],
            version: 1,
            description: "Interact with Influencers Club API for creator enrichment and discovery",
            defaults: {
                name: "Influencers Club",
            },
            icon: "file:influencersClub.svg",
            subtitle: "={{ $parameter[\"operation\"] }}",
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: "influencersClubApi",
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    options: [
                        {
                            name: "Enrich by Email",
                            value: "enrichByEmail",
                            description: "Enrich a creator using their email address",
                            action: "Enrich a creator using their email address",
                        },
                        {
                            name: "Enrich by Handle",
                            value: "enrichByHandle",
                            description: "Enrich a creator using their handle/username",
                            action: "Enrich a creator using their handle/username",
                        },
                        {
                            name: "Discovery",
                            value: "discovery",
                            description: "The Discovery API allows you to filter creators based on the filters available on the dashboard, you can use the AI seach and lookalikes search to find profiles relevant to your targeting.",
                            action: "The Discovery API allows you to filter creators based on the filters available on the dashboard, you can use the AI seach and lookalikes search to find profiles relevant to your targeting.",
                        },
                        {
                            name: "Find Similar Creators",
                            value: "findLookalikes",
                            description: "This endpoint helps identify creators who are similar to a given influencer based on their social media presence, niche, engagement patterns, and audience characteristics. It allows businesses to discover new potential partners, expand outreach efforts, and optimize influencer marketing campaigns by targeting lookalike creators.",
                            action: "This endpoint helps identify creators who are similar to a given influencer based on their social media presence, niche, engagement patterns, and audience characteristics. It allows businesses to discover new potential partners, expand outreach efforts, and optimize influencer marketing campaigns by targeting lookalike creators.",
                        },
                    ],
                    default: "enrichByEmail",
                },
                // Enrich by Email parameters
                {
                    displayName: "Email",
                    name: "email",
                    type: "string",
                    default: "",
                    required: true,
                    description: "The email address to enrich with social media data",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                {
                    displayName: "Include Connected Platforms Data",
                    name: "include_connected_platforms_data",
                    type: "boolean",
                    default: false,
                    description: "Whether to include data from connected platforms",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                {
                    displayName: "Include Income Data",
                    name: "include_income_data",
                    type: "boolean",
                    default: false,
                    description: "Whether to include income data",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                {
                    displayName: "Only Above 1000 Followers",
                    name: "only_above_1000_followers",
                    type: "boolean",
                    default: false,
                    description: "Whether to only include creators with more than 1000 followers",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                {
                    displayName: "Exclude Social Media",
                    name: "exclude_social_media",
                    type: "fixedCollection",
                    typeOptions: {
                        multipleValues: true,
                    },
                    default: {},
                    description: "Social media platforms to exclude from the results",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                    options: [
                        {
                            name: "platforms",
                            displayName: "Platforms",
                            values: [
                                {
                                    displayName: "Platform",
                                    name: "platform",
                                    type: "options",
                                    options: [
                                        { name: "Instagram", value: "instagram" },
                                        { name: "YouTube", value: "youtube" },
                                        { name: "TikTok", value: "tiktok" },
                                        { name: "Twitter", value: "twitter" },
                                        { name: "OnlyFans", value: "onlyfans" },
                                        { name: "Twitch", value: "twitch" },
                                    ],
                                    default: "instagram",
                                },
                            ],
                        },
                    ],
                },
                // Enrich by Handle parameters
                {
                    displayName: "Media URL",
                    name: "media_url",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Enter creator's social media handle or URL",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                {
                    displayName: "Platform",
                    name: "platform",
                    type: "options",
                    options: [
                        { name: "Instagram", value: "instagram" },
                        { name: "TikTok", value: "tiktok" },
                        { name: "YouTube", value: "youtube" },
                        { name: "Twitter", value: "twitter" },
                        { name: "OnlyFans", value: "onlyfans" },
                        { name: "Patreon", value: "patreon" },
                        { name: "Twitch", value: "twitch" },
                        { name: "Reddit", value: "reddit" },
                        { name: "LinkedIn", value: "linkedin" },
                        { name: "Pinterest", value: "pinterest" },
                        { name: "Discord", value: "discord" },
                        { name: "Snapchat", value: "snapchat" },
                        { name: "Facebook", value: "facebook" },
                    ],
                    default: "instagram",
                    description: "Choose the social media platform that matches the handle or URL you entered",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle", "discovery", "findLookalikes"],
                        },
                    },
                },
                {
                    displayName: "Include Post Data",
                    name: "include_post_data",
                    type: "boolean",
                    default: false,
                    description: "Returns creator's latest posts in the response",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                {
                    displayName: "Include Connected Platforms Data",
                    name: "include_connected_platforms_data",
                    type: "boolean",
                    default: false,
                    description: "Returns all data for the creator's other social media profiles",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                {
                    displayName: "Include Audience Data",
                    name: "include_audience_data",
                    type: "boolean",
                    default: false,
                    description: "Returns audience data for the creator",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                {
                    displayName: "Include Income Data",
                    name: "include_income_data",
                    type: "boolean",
                    default: false,
                    description: "Returns estimated income for the creator",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                {
                    displayName: "Email Required",
                    name: "email_required",
                    type: "options",
                    options: [
                        { name: "Not Needed", value: "not_needed" },
                        { name: "Must Have", value: "must_have" },
                        { name: "Preferred", value: "preferred" },
                    ],
                    default: "preferred",
                    description: "Email requirement preference",
                    displayOptions: {
                        show: {
                            operation: ["enrichByHandle"],
                        },
                    },
                },
                // Discovery parameters
                {
                    displayName: "AI Search",
                    name: "ai_search",
                    type: "string",
                    default: "",
                    description: "Natural-language search prompt (beta)",
                    displayOptions: {
                        show: {
                            operation: ["discovery"],
                        },
                    },
                },
                {
                    displayName: "Advanced Filters",
                    name: "advancedFilters",
                    type: "fixedCollection",
                    placeholder: "Add Filters",
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ["discovery"],
                        },
                    },
                    options: [
                        {
                            name: "filters",
                            displayName: "Filters",
                            values: [
                                {
                                    displayName: "Location",
                                    name: "location",
                                    type: "string",
                                    default: "",
                                    description: "Country or city",
                                },
                                {
                                    displayName: "Type",
                                    name: "type",
                                    type: "options",
                                    options: [
                                        { name: "Any", value: "" },
                                        { name: "Creator", value: "creator" },
                                        { name: "Business", value: "business" },
                                    ],
                                    default: "",
                                },
                                {
                                    displayName: "Gender",
                                    name: "gender",
                                    type: "options",
                                    options: [
                                        { name: "Any", value: "" },
                                        { name: "Male", value: "male" },
                                        { name: "Female", value: "female" },
                                    ],
                                    default: "",
                                },
                                {
                                    displayName: "Profile Language",
                                    name: "profile_language",
                                    type: "string",
                                    default: "",
                                    description: "ISO 639-1 language code",
                                },
                                {
                                    displayName: "Is Verified",
                                    name: "is_verified",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Exclude Private Profile",
                                    name: "exclude_private_profile",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Posting Frequency",
                                    name: "posting_frequency",
                                    type: "number",
                                    default: 0,
                                    description: "Average posts per week",
                                },
                                {
                                    displayName: "Follower Growth Percentage",
                                    name: "follower_growth_percentage",
                                    type: "number",
                                    default: 0,
                                },
                                {
                                    displayName: "Follower Growth Time Range (Months)",
                                    name: "follower_growth_time_range_months",
                                    type: "number",
                                    default: 3,
                                },
                            ],
                        },
                        {
                            name: "instagramFilters",
                            displayName: "Instagram Filters",
                            values: [
                                {
                                    displayName: "Min Followers",
                                    name: "min_followers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Followers",
                                    name: "max_followers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Likes",
                                    name: "min_average_likes",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Likes",
                                    name: "max_average_likes",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Comments",
                                    name: "min_average_comments",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Comments",
                                    name: "max_average_comments",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Number of Posts",
                                    name: "min_number_of_posts",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Number of Posts",
                                    name: "max_number_of_posts",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Reels Percent",
                                    name: "min_reels_percent",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Reels Percent",
                                    name: "max_reels_percent",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Views for Reels",
                                    name: "min_average_views_for_reels",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Views for Reels",
                                    name: "max_average_views_for_reels",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Income",
                                    name: "min_income",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Income",
                                    name: "max_income",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Has Merch",
                                    name: "has_merch",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Keywords in Bio",
                                    name: "keywords_in_bio",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated keywords",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Last Post",
                                    name: "last_post",
                                    type: "string",
                                    default: "",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Video Percentage",
                                    name: "min_video_percentage",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Video Percentage",
                                    name: "max_video_percentage",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram"],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "youtubeFilters",
                            displayName: "YouTube Filters",
                            values: [
                                {
                                    displayName: "Min Subscribers",
                                    name: "min_subscribers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Subscribers",
                                    name: "max_subscribers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Keywords in Video Titles",
                                    name: "keywords_in_video_titles",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated keywords",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Keywords in Description",
                                    name: "keywords_in_description",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated keywords",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Subscriber Growth Percentage",
                                    name: "subscriber_growth_percentage",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Subscriber Growth Time Range (Months)",
                                    name: "subscriber_growth_time_range_months",
                                    type: "number",
                                    default: 3,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Has Shorts",
                                    name: "has_shorts",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Shorts Percentage",
                                    name: "min_shorts_percentage",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Shorts Percentage",
                                    name: "max_shorts_percentage",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Has Community Posts",
                                    name: "has_community_posts",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Views on Long Videos",
                                    name: "min_average_views_on_long_videos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Views on Long Videos",
                                    name: "max_average_views_on_long_videos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Views on Shorts",
                                    name: "min_average_views_on_shorts",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Views on Shorts",
                                    name: "max_average_views_on_shorts",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Is Monetizing",
                                    name: "is_monetizing",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["youtube"],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "tiktokFilters",
                            displayName: "TikTok Filters",
                            values: [
                                {
                                    displayName: "Min Average Video Downloads",
                                    name: "min_average_video_downloads",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Video Downloads",
                                    name: "max_average_video_downloads",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Number of Videos",
                                    name: "min_number_of_videos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Number of Videos",
                                    name: "max_number_of_videos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Keywords in Video Description",
                                    name: "keywords_in_video_description",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated keywords",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Has TikTok Shop",
                                    name: "has_tik_tok_shop",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["tiktok"],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "twitterFilters",
                            displayName: "Twitter Filters",
                            values: [
                                {
                                    displayName: "Min Number of Tweets",
                                    name: "min_number_of_tweets",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitter"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Number of Tweets",
                                    name: "max_number_of_tweets",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitter"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Keywords in Tweets",
                                    name: "keywords_in_tweets",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated keywords",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitter"],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "onlyfansFilters",
                            displayName: "OnlyFans Filters",
                            values: [
                                {
                                    displayName: "Min Subscription Price",
                                    name: "min_subscription_price",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Subscription Price",
                                    name: "max_subscription_price",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Number of Photos",
                                    name: "min_number_of_photos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Number of Photos",
                                    name: "max_number_of_photos",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Number of Likes",
                                    name: "min_number_of_likes",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Number of Likes",
                                    name: "max_number_of_likes",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Followers",
                                    name: "min_followers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Followers",
                                    name: "max_followers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Active Subscribers",
                                    name: "min_active_subscribers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Active Subscribers",
                                    name: "max_active_subscribers",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["onlyfans"],
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            name: "twitchFilters",
                            displayName: "Twitch Filters",
                            values: [
                                {
                                    displayName: "Min Streamed Hours Last 30 Days",
                                    name: "min_streamed_hours_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Streamed Hours Last 30 Days",
                                    name: "max_streamed_hours_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Total Hours Streamed",
                                    name: "min_total_hours_streamed",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Total Hours Streamed",
                                    name: "max_total_hours_streamed",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Maximum Views Count",
                                    name: "min_maximum_views_count",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Maximum Views Count",
                                    name: "max_maximum_views_count",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Average Views Last 30 Days",
                                    name: "min_avg_views_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Average Views Last 30 Days",
                                    name: "max_avg_views_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Min Streams Count Last 30 Days",
                                    name: "min_streams_count_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Max Streams Count Last 30 Days",
                                    name: "max_streams_count_last_30_days",
                                    type: "number",
                                    default: 0,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Games Played",
                                    name: "games_played",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated game names",
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Is Twitch Partner",
                                    name: "is_twitch_partner",
                                    type: "boolean",
                                    default: false,
                                    displayOptions: {
                                        show: {
                                            "/platform": ["twitch"],
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                // Find Lookalikes parameters
                {
                    displayName: "Filter Value",
                    name: "filter_value",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Full platform URL or profile handle to find similar creators for",
                    displayOptions: {
                        show: {
                            operation: ["findLookalikes"],
                        },
                    },
                },
                {
                    displayName: "Filter Key",
                    name: "filter_key",
                    type: "options",
                    options: [
                        { name: "URL", value: "url" },
                        { name: "Username", value: "username" },
                    ],
                    default: "username",
                    required: true,
                    description: "Defines the type of input being queried",
                    displayOptions: {
                        show: {
                            operation: ["findLookalikes"],
                        },
                    },
                },
            ],
        };
    }
    // eslint-disable-next-line no-unused-vars
    async execute() {
        const operation = this.getNodeParameter("operation", 0);
        const credentials = await this.getCredentials("influencersClubApi");
        const apiKey = credentials.apiKey;
        let response;
        switch (operation) {
            case "enrichByEmail": {
                const email = this.getNodeParameter("email", 0);
                const include_connected_platforms_data = this.getNodeParameter("include_connected_platforms_data", 0, false);
                const include_income_data = this.getNodeParameter("include_income_data", 0, false);
                const only_above_1000_followers = this.getNodeParameter("only_above_1000_followers", 0, false);
                const exclude_social_media_data = this.getNodeParameter("exclude_social_media.platforms", 0, []);
                // Extract platform values from the exclude_social_media array
                const exclude_social_media = exclude_social_media_data.map((item) => item.platform).filter(Boolean);
                const body = {
                    email,
                    include_connected_platforms_data,
                    include_income_data,
                    only_above_1000_followers,
                    exclude_social_media,
                };
                const options = {
                    method: "POST",
                    body,
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/enrichment/creators/enrich-by-email/", options);
                break;
            }
            case "enrichByHandle": {
                const media_url = this.getNodeParameter("media_url", 0);
                const platform = this.getNodeParameter("platform", 0);
                const include_post_data = this.getNodeParameter("include_post_data", 0, false);
                const include_connected_platforms_data = this.getNodeParameter("include_connected_platforms_data", 0, false);
                const include_audience_data = this.getNodeParameter("include_audience_data", 0, false);
                const include_income_data = this.getNodeParameter("include_income_data", 0, false);
                const email_required = this.getNodeParameter("email_required", 0, "preferred");
                const body = {
                    media_url,
                    platform,
                    include_post_data,
                    include_connected_platforms_data,
                    include_audience_data,
                    include_income_data,
                    email_required,
                };
                const options = {
                    method: "POST",
                    body,
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/enrichment/creators/enrich/", options);
                break;
            }
            case "discovery": {
                const ai_search = this.getNodeParameter("ai_search", 0);
                const platform = this.getNodeParameter("platform", 0);
                const sharedFilters = this.getNodeParameter("advancedFilters.filters", 0, {});
                const instagramFilters = this.getNodeParameter("advancedFilters.instagramFilters", 0, {});
                const youtubeFilters = this.getNodeParameter("advancedFilters.youtubeFilters", 0, {});
                const tiktokFilters = this.getNodeParameter("advancedFilters.tiktokFilters", 0, {});
                const twitterFilters = this.getNodeParameter("advancedFilters.twitterFilters", 0, {});
                const onlyfansFilters = this.getNodeParameter("advancedFilters.onlyfansFilters", 0, {});
                const twitchFilters = this.getNodeParameter("advancedFilters.twitchFilters", 0, {});
                // Build the correct API structure exactly as documented
                const apiFilters = {};
                // Shared filters (always visible)
                if (sharedFilters.location && sharedFilters.location !== "")
                    apiFilters.location = sharedFilters.location;
                if (sharedFilters.type && sharedFilters.type !== "")
                    apiFilters.type = sharedFilters.type;
                if (sharedFilters.gender && sharedFilters.gender !== "")
                    apiFilters.gender = sharedFilters.gender;
                if (sharedFilters.profile_language && sharedFilters.profile_language !== "")
                    apiFilters.profile_language = sharedFilters.profile_language;
                if (sharedFilters.is_verified !== undefined)
                    apiFilters.is_verified = sharedFilters.is_verified;
                if (sharedFilters.exclude_private_profile !== undefined)
                    apiFilters.exclude_private_profile = sharedFilters.exclude_private_profile;
                if (sharedFilters.posting_frequency)
                    apiFilters.posting_frequency = sharedFilters.posting_frequency;
                if (sharedFilters.follower_growth_percentage || sharedFilters.follower_growth_time_range_months) {
                    apiFilters.follower_growth = {
                        growth_percentage: sharedFilters.follower_growth_percentage || null,
                        time_range_months: sharedFilters.follower_growth_time_range_months || 3,
                    };
                }
                // Platform-specific filters
                if (platform === "instagram") {
                    if (instagramFilters.min_followers || instagramFilters.max_followers) {
                        apiFilters.number_of_followers = {
                            min: instagramFilters.min_followers || null,
                            max: instagramFilters.max_followers || null,
                        };
                    }
                    if (instagramFilters.min_average_likes || instagramFilters.max_average_likes) {
                        apiFilters.average_likes = {
                            min: instagramFilters.min_average_likes || null,
                            max: instagramFilters.max_average_likes || null,
                        };
                    }
                    if (instagramFilters.min_average_comments || instagramFilters.max_average_comments) {
                        apiFilters.average_comments = {
                            min: instagramFilters.min_average_comments || null,
                            max: instagramFilters.max_average_comments || null,
                        };
                    }
                    if (instagramFilters.min_number_of_posts || instagramFilters.max_number_of_posts) {
                        apiFilters.number_of_posts = {
                            min: instagramFilters.min_number_of_posts || null,
                            max: instagramFilters.max_number_of_posts || null,
                        };
                    }
                    if (instagramFilters.min_reels_percent || instagramFilters.max_reels_percent) {
                        apiFilters.reels_percent = {
                            min: instagramFilters.min_reels_percent || null,
                            max: instagramFilters.max_reels_percent || null,
                        };
                    }
                    if (instagramFilters.min_average_views_for_reels || instagramFilters.max_average_views_for_reels) {
                        apiFilters.average_views_for_reels = {
                            min: instagramFilters.min_average_views_for_reels || null,
                            max: instagramFilters.max_average_views_for_reels || null,
                        };
                    }
                    if (instagramFilters.min_income || instagramFilters.max_income) {
                        apiFilters.income = {
                            min: instagramFilters.min_income || null,
                            max: instagramFilters.max_income || null,
                        };
                    }
                    if (instagramFilters.min_video_percentage || instagramFilters.max_video_percentage) {
                        apiFilters.video_percentage = {
                            min: instagramFilters.min_video_percentage || null,
                            max: instagramFilters.max_video_percentage || null,
                        };
                    }
                    if (instagramFilters.has_merch !== undefined)
                        apiFilters.has_merch = instagramFilters.has_merch;
                    if (instagramFilters.keywords_in_bio && typeof instagramFilters.keywords_in_bio === "string") {
                        apiFilters.keywords_in_bio = instagramFilters.keywords_in_bio.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                    if (instagramFilters.last_post)
                        apiFilters.last_post = instagramFilters.last_post;
                }
                if (platform === "youtube") {
                    if (youtubeFilters.min_subscribers || youtubeFilters.max_subscribers) {
                        apiFilters.number_of_subscribers = {
                            min: youtubeFilters.min_subscribers || null,
                            max: youtubeFilters.max_subscribers || null,
                        };
                    }
                    if (youtubeFilters.min_shorts_percentage || youtubeFilters.max_shorts_percentage) {
                        apiFilters.shorts_percentage = {
                            min: youtubeFilters.min_shorts_percentage || null,
                            max: youtubeFilters.max_shorts_percentage || null,
                        };
                    }
                    if (youtubeFilters.min_average_views_on_long_videos || youtubeFilters.max_average_views_on_long_videos) {
                        apiFilters.average_views_on_long_videos = {
                            min: youtubeFilters.min_average_views_on_long_videos || null,
                            max: youtubeFilters.max_average_views_on_long_videos || null,
                        };
                    }
                    if (youtubeFilters.min_average_views_on_shorts || youtubeFilters.max_average_views_on_shorts) {
                        apiFilters.average_views_on_shorts = {
                            min: youtubeFilters.min_average_views_on_shorts || null,
                            max: youtubeFilters.max_average_views_on_shorts || null,
                        };
                    }
                    if (youtubeFilters.keywords_in_video_titles && typeof youtubeFilters.keywords_in_video_titles === "string") {
                        apiFilters.keywords_in_video_titles = youtubeFilters.keywords_in_video_titles.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                    if (youtubeFilters.keywords_in_description && typeof youtubeFilters.keywords_in_description === "string") {
                        apiFilters.keywords_in_description = youtubeFilters.keywords_in_description.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                    if (youtubeFilters.subscriber_growth_percentage || youtubeFilters.subscriber_growth_time_range_months) {
                        apiFilters.subscriber_growth = {
                            growth_percentage: youtubeFilters.subscriber_growth_percentage || null,
                            time_range_months: youtubeFilters.subscriber_growth_time_range_months || 3,
                        };
                    }
                    if (youtubeFilters.has_shorts !== undefined)
                        apiFilters.has_shorts = youtubeFilters.has_shorts;
                    if (youtubeFilters.has_community_posts !== undefined)
                        apiFilters.has_community_posts = youtubeFilters.has_community_posts;
                    if (youtubeFilters.is_monetizing !== undefined)
                        apiFilters.is_monetizing = youtubeFilters.is_monetizing;
                }
                if (platform === "tiktok") {
                    if (tiktokFilters.min_average_video_downloads || tiktokFilters.max_average_video_downloads) {
                        apiFilters.average_video_downloads = {
                            min: tiktokFilters.min_average_video_downloads || null,
                            max: tiktokFilters.max_average_video_downloads || null,
                        };
                    }
                    if (tiktokFilters.min_number_of_videos || tiktokFilters.max_number_of_videos) {
                        apiFilters.number_of_videos = {
                            min: tiktokFilters.min_number_of_videos || null,
                            max: tiktokFilters.max_number_of_videos || null,
                        };
                    }
                    if (tiktokFilters.keywords_in_video_description && typeof tiktokFilters.keywords_in_video_description === "string") {
                        apiFilters.keywords_in_video_description = tiktokFilters.keywords_in_video_description.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                    if (tiktokFilters.has_tik_tok_shop !== undefined)
                        apiFilters.has_tik_tok_shop = tiktokFilters.has_tik_tok_shop;
                }
                if (platform === "twitter") {
                    if (twitterFilters.min_number_of_tweets || twitterFilters.max_number_of_tweets) {
                        apiFilters.number_of_tweets = {
                            min: twitterFilters.min_number_of_tweets || null,
                            max: twitterFilters.max_number_of_tweets || null,
                        };
                    }
                    if (twitterFilters.keywords_in_tweets && typeof twitterFilters.keywords_in_tweets === "string") {
                        apiFilters.keywords_in_tweets = twitterFilters.keywords_in_tweets.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                }
                if (platform === "onlyfans") {
                    if (onlyfansFilters.min_subscription_price || onlyfansFilters.max_subscription_price) {
                        apiFilters.subscription_price = {
                            min: onlyfansFilters.min_subscription_price || null,
                            max: onlyfansFilters.max_subscription_price || null,
                        };
                    }
                    if (onlyfansFilters.min_number_of_photos || onlyfansFilters.max_number_of_photos) {
                        apiFilters.number_of_photos = {
                            min: onlyfansFilters.min_number_of_photos || null,
                            max: onlyfansFilters.max_number_of_photos || null,
                        };
                    }
                    if (onlyfansFilters.min_number_of_likes || onlyfansFilters.max_number_of_likes) {
                        apiFilters.number_of_likes = {
                            min: onlyfansFilters.min_number_of_likes || null,
                            max: onlyfansFilters.max_number_of_likes || null,
                        };
                    }
                    if (onlyfansFilters.min_followers || onlyfansFilters.max_followers) {
                        apiFilters.followers = {
                            min: onlyfansFilters.min_followers || null,
                            max: onlyfansFilters.max_followers || null,
                        };
                    }
                    if (onlyfansFilters.min_active_subscribers || onlyfansFilters.max_active_subscribers) {
                        apiFilters.active_subscribers = {
                            min: onlyfansFilters.min_active_subscribers || null,
                            max: onlyfansFilters.max_active_subscribers || null,
                        };
                    }
                }
                if (platform === "twitch") {
                    if (twitchFilters.min_streamed_hours_last_30_days || twitchFilters.max_streamed_hours_last_30_days) {
                        apiFilters.streamed_hours_last_30_days = {
                            min: twitchFilters.min_streamed_hours_last_30_days || null,
                            max: twitchFilters.max_streamed_hours_last_30_days || null,
                        };
                    }
                    if (twitchFilters.min_total_hours_streamed || twitchFilters.max_total_hours_streamed) {
                        apiFilters.total_hours_streamed = {
                            min: twitchFilters.min_total_hours_streamed || null,
                            max: twitchFilters.max_total_hours_streamed || null,
                        };
                    }
                    if (twitchFilters.min_maximum_views_count || twitchFilters.max_maximum_views_count) {
                        apiFilters.maximum_views_count = {
                            min: twitchFilters.min_maximum_views_count || null,
                            max: twitchFilters.max_maximum_views_count || null,
                        };
                    }
                    if (twitchFilters.min_avg_views_last_30_days || twitchFilters.max_avg_views_last_30_days) {
                        apiFilters.avg_views_last_30_days = {
                            min: twitchFilters.min_avg_views_last_30_days || null,
                            max: twitchFilters.max_avg_views_last_30_days || null,
                        };
                    }
                    if (twitchFilters.min_streams_count_last_30_days || twitchFilters.max_streams_count_last_30_days) {
                        apiFilters.streams_count_last_30_days = {
                            min: twitchFilters.min_streams_count_last_30_days || null,
                            max: twitchFilters.max_streams_count_last_30_days || null,
                        };
                    }
                    if (twitchFilters.games_played && typeof twitchFilters.games_played === "string") {
                        apiFilters.games_played = twitchFilters.games_played.split(",").map((k) => k.trim()).filter((k) => k);
                    }
                    if (twitchFilters.is_twitch_partner !== undefined)
                        apiFilters.is_twitch_partner = twitchFilters.is_twitch_partner;
                }
                const body = {
                    platform,
                    paging: { limit: null, page: null },
                    sort: { sort_by: "relevancy", sort_order: "desc" },
                    filters: {
                        ai_search: ai_search || "",
                        ...apiFilters,
                    },
                };
                const options = {
                    method: "POST",
                    body,
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/discovery/", options);
                break;
            }
            case "findLookalikes": {
                const filter_value = this.getNodeParameter("filter_value", 0);
                const filter_key = this.getNodeParameter("filter_key", 0);
                const platform = this.getNodeParameter("platform", 0);
                const body = {
                    filter_value,
                    filter_key,
                    platform,
                };
                const options = {
                    method: "POST",
                    body,
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    json: true,
                };
                response = await this.helpers.request("https://api-dashboard.influencers.club/public/v1/enrichment/lookalikes/", options);
                break;
            }
            default:
                throw new Error(`Operation ${operation} not supported`);
        }
        return [this.helpers.returnJsonArray([response])];
    }
}
