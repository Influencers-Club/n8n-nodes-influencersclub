"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfluencersClub = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class InfluencersClub {
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
                            action: "Enrich by Email",
                        },
                        {
                            name: "Enrich by Handle",
                            value: "enrichByHandle",
                            description: "Enrich a creator using their handle/username",
                            action: "Enrich by Handle",
                        },
                        {
                            name: "Discovery",
                            value: "discovery",
                            description: "The Discovery API allows you to filter creators based on the filters available on the dashboard, you can use the AI seach and lookalikes search to find profiles relevant to your targeting.",
                            action: "Discovery",
                        },
                        {
                            name: "Find Similar Creators",
                            value: "findLookalikes",
                            description: "This endpoint helps identify creators who are similar to a given influencer based on their social media presence, niche, engagement patterns, and audience characteristics. It allows businesses to discover new potential partners, expand outreach efforts, and optimize influencer marketing campaigns by targeting lookalike creators.",
                            action: "Find Similar Creators",
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
                    description: "The email address to enrich",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                // Find Lookalikes identifiers (moved up so Advanced Filters sits under Filter Key)
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
                        { name: "ID", value: "id" },
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
                {
                    displayName: "Limit",
                    name: "paging_limit",
                    type: "number",
                    default: 5,
                    description: "Number of results to return",
                    displayOptions: {
                        show: {
                            operation: ["findLookalikes"],
                        },
                    },
                },
                {
                    displayName: "Page",
                    name: "paging_page",
                    type: "number",
                    default: 0,
                    description: "Zero-based page index",
                    displayOptions: {
                        show: {
                            operation: ["findLookalikes"],
                        },
                    },
                },
                {
                    displayName: "Exclude Platforms",
                    name: "exclude_platforms",
                    type: "multiOptions",
                    options: [
                        { name: "Instagram", value: "instagram" },
                        { name: "YouTube", value: "youtube" },
                        { name: "TikTok", value: "tiktok" },
                        { name: "Twitter", value: "twitter" },
                        { name: "OnlyFans", value: "onlyfans" },
                        { name: "Twitch", value: "twitch" },
                    ],
                    default: [],
                    description: "Select platforms to exclude",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                {
                    displayName: "Min Followers",
                    name: "min_followers",
                    type: "number",
                    default: 1000,
                    description: "Only return creators with at least this many followers",
                    displayOptions: {
                        show: {
                            operation: ["enrichByEmail"],
                        },
                    },
                },
                // Enrich by Handle parameters
                {
                    displayName: "Handle",
                    name: "handle",
                    type: "string",
                    default: "",
                    required: true,
                    description: "Enter the creator’s handle URL or ID",
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
                    displayName: "Include Lookalikes",
                    name: "include_lookalikes",
                    type: "boolean",
                    default: false,
                    description: "Include similar creators in the response",
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
                            operation: ["discovery", "findLookalikes"],
                        },
                    },
                },
                {
                    displayName: "Advanced Filters",
                    name: "advancedFilters",
                    type: "fixedCollection",
                    typeOptions: {
                        multipleValues: true,
                    },
                    placeholder: "Add Filters",
                    default: {},
                    displayOptions: {
                        show: {
                            operation: ["discovery", "findLookalikes"],
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
                                    description: "Comma-separated locations (country or city)",
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
                                    displayOptions: {
                                        show: {
                                            "/platform": ["instagram", "youtube", "tiktok"],
                                        },
                                    },
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
                                    displayOptions: {
                                        hide: {
                                            "/advancedFilters.filters.type": ["business"],
                                        },
                                    },
                                },
                                {
                                    displayName: "Profile Language",
                                    name: "profile_language",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated languages (ISO 639-1)",
                                },
                                {
                                    displayName: "Promotes Affiliate Links",
                                    name: "promotes_affiliate_links",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Has Done Brand Deals",
                                    name: "has_done_brand_deals",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Has Link in Bio",
                                    name: "has_link_in_bio",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Does Live Streaming",
                                    name: "does_live_streaming",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Has Merch",
                                    name: "has_merch",
                                    type: "boolean",
                                    default: false,
                                },
                                {
                                    displayName: "Brands",
                                    name: "brands",
                                    type: "string",
                                    default: "",
                                    description: "Comma-separated list of brands",
                                },
                                {
                                    name: "creator_has",
                                    displayName: "Creator Has",
                                    type: "fixedCollection",
                                    placeholder: "Add Platform Presence Flags",
                                    default: {},
                                    options: [
                                        {
                                            name: "platforms",
                                            displayName: "Platforms",
                                            values: [
                                                { displayName: "Instagram", name: "instagram", type: "boolean", default: false },
                                                { displayName: "YouTube", name: "youtube", type: "boolean", default: false },
                                                { displayName: "TikTok", name: "tiktok", type: "boolean", default: false },
                                                { displayName: "Twitter", name: "twitter", type: "boolean", default: false },
                                                { displayName: "OnlyFans", name: "onlyfans", type: "boolean", default: false },
                                                { displayName: "Twitch", name: "twitch", type: "boolean", default: false },
                                            ],
                                        },
                                    ],
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
                // Find Lookalikes parameters (moved earlier for order)
            ],
        };
    }
    // eslint-disable-next-line no-unused-vars
    async execute() {
        const operation = this.getNodeParameter("operation", 0);
        const outputItems = [];
        try {
            switch (operation) {
                case "enrichByEmail": {
                    const email = this.getNodeParameter("email", 0);
                    const exclude_platforms = this.getNodeParameter("exclude_platforms", 0, []);
                    const min_followers = this.getNodeParameter("min_followers", 0, 1000);
                    const body = {
                        email,
                        exclude_platforms,
                        min_followers,
                    };
                    const options = {
                        method: "POST",
                        url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/email/advanced/",
                        body,
                        json: true,
                    };
                    {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                        outputItems.push({ json: resp, pairedItem: { item: 0 } });
                    }
                    break;
                }
                case "enrichByHandle": {
                    const handle = this.getNodeParameter("handle", 0);
                    const platform = this.getNodeParameter("platform", 0);
                    const include_lookalikes = this.getNodeParameter("include_lookalikes", 0, false);
                    const email_required = this.getNodeParameter("email_required", 0, "preferred");
                    const body = {
                        handle,
                        platform,
                        include_lookalikes,
                        email_required,
                    };
                    const options = {
                        method: "POST",
                        url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/handle/full/",
                        body,
                        json: true,
                    };
                    {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                        outputItems.push({ json: resp, pairedItem: { item: 0 } });
                    }
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
                        apiFilters.location = String(sharedFilters.location).split(",").map((s) => s.trim()).filter(Boolean);
                    if (sharedFilters.type && sharedFilters.type !== "" && ["instagram", "youtube", "tiktok"].includes(platform))
                        apiFilters.type = sharedFilters.type;
                    if (sharedFilters.gender && sharedFilters.gender !== "" && sharedFilters.type !== "business")
                        apiFilters.gender = sharedFilters.gender;
                    if (sharedFilters.profile_language && sharedFilters.profile_language !== "")
                        apiFilters.speaking_language = String(sharedFilters.profile_language).split(",").map((s) => s.trim()).filter(Boolean);
                    if (sharedFilters.promotes_affiliate_links !== undefined)
                        apiFilters.promotes_affiliate_links = sharedFilters.promotes_affiliate_links;
                    if (sharedFilters.has_done_brand_deals !== undefined)
                        apiFilters.has_done_brand_deals = sharedFilters.has_done_brand_deals;
                    if (sharedFilters.has_link_in_bio !== undefined)
                        apiFilters.has_link_in_bio = sharedFilters.has_link_in_bio;
                    if (sharedFilters.does_live_streaming !== undefined)
                        apiFilters.does_live_streaming = sharedFilters.does_live_streaming;
                    if (sharedFilters.has_merch !== undefined)
                        apiFilters.has_merch = sharedFilters.has_merch;
                    if (sharedFilters.brands && typeof sharedFilters.brands === "string")
                        apiFilters.brands = String(sharedFilters.brands).split(",").map((s) => s.trim()).filter(Boolean);
                    const creatorHas = this.getNodeParameter("advancedFilters.filters.creator_has.platforms", 0, []);
                    if (creatorHas && Array.isArray(creatorHas) && creatorHas.length) {
                        apiFilters.creator_has = {};
                        for (const entry of creatorHas) {
                            for (const [key, value] of Object.entries(entry)) {
                                apiFilters.creator_has[key] = value;
                            }
                        }
                    }
                    // Platform-specific filters
                    if (platform === "instagram") {
                        if (instagramFilters.min_followers || instagramFilters.max_followers) {
                            apiFilters.number_of_followers = { min: instagramFilters.min_followers || null, max: instagramFilters.max_followers || null };
                        }
                        if (instagramFilters.posting_frequency)
                            apiFilters.posting_frequency = instagramFilters.posting_frequency;
                        if (instagramFilters.follower_growth_percentage || instagramFilters.follower_growth_time_range_months) {
                            apiFilters.follower_growth = { growth_percentage: instagramFilters.follower_growth_percentage || null, time_range_months: instagramFilters.follower_growth_time_range_months || 3 };
                        }
                        if (instagramFilters.min_number_of_posts || instagramFilters.max_number_of_posts)
                            apiFilters.number_of_posts = { min: instagramFilters.min_number_of_posts || null, max: instagramFilters.max_number_of_posts || null };
                        if (instagramFilters.min_average_likes || instagramFilters.max_average_likes)
                            apiFilters.average_likes = { min: instagramFilters.min_average_likes || null, max: instagramFilters.max_average_likes || null };
                        if (instagramFilters.min_average_comments || instagramFilters.max_average_comments)
                            apiFilters.average_comments = { min: instagramFilters.min_average_comments || null, max: instagramFilters.max_average_comments || null };
                        if (instagramFilters.min_reels_percent || instagramFilters.max_reels_percent)
                            apiFilters.reels_percent = { min: instagramFilters.min_reels_percent || null, max: instagramFilters.max_reels_percent || null };
                        if (instagramFilters.min_average_views_for_reels || instagramFilters.max_average_views_for_reels)
                            apiFilters.average_views_for_reels = { min: instagramFilters.min_average_views_for_reels || null, max: instagramFilters.max_average_views_for_reels || null };
                        if (instagramFilters.min_income || instagramFilters.max_income)
                            apiFilters.income = { min: instagramFilters.min_income || null, max: instagramFilters.max_income || null };
                        if (instagramFilters.min_video_percentage || instagramFilters.max_video_percentage)
                            apiFilters.video_percentage = { min: instagramFilters.min_video_percentage || null, max: instagramFilters.max_video_percentage || null };
                        if (instagramFilters.exclude_private_profile !== undefined)
                            apiFilters.exclude_private_profile = instagramFilters.exclude_private_profile;
                        if (instagramFilters.is_verified !== undefined)
                            apiFilters.is_verified = instagramFilters.is_verified;
                        if (instagramFilters.has_videos !== undefined)
                            apiFilters.has_videos = instagramFilters.has_videos;
                        if (instagramFilters.last_post)
                            apiFilters.last_post = instagramFilters.last_post;
                        if (instagramFilters.keywords_in_bio && typeof instagramFilters.keywords_in_bio === "string")
                            apiFilters.keywords_in_bio = String(instagramFilters.keywords_in_bio).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.exclude_keywords_in_bio && typeof instagramFilters.exclude_keywords_in_bio === "string")
                            apiFilters.exclude_keywords_in_bio = String(instagramFilters.exclude_keywords_in_bio).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.similar_to && typeof instagramFilters.similar_to === "string")
                            apiFilters.similar_to = String(instagramFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.link_in_bio && typeof instagramFilters.link_in_bio === "string")
                            apiFilters.link_in_bio = String(instagramFilters.link_in_bio).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.hashtags && typeof instagramFilters.hashtags === "string")
                            apiFilters.hashtags = String(instagramFilters.hashtags).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.not_hashtags && typeof instagramFilters.not_hashtags === "string")
                            apiFilters.not_hashtags = String(instagramFilters.not_hashtags).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.keywords_in_captions && typeof instagramFilters.keywords_in_captions === "string")
                            apiFilters.keywords_in_captions = String(instagramFilters.keywords_in_captions).split(",").map((k) => k.trim()).filter(Boolean);
                        if (instagramFilters.engagement_percent_min || instagramFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: instagramFilters.engagement_percent_min || null, max: instagramFilters.engagement_percent_max || null };
                    }
                    if (platform === "youtube") {
                        if (youtubeFilters.min_subscribers || youtubeFilters.max_subscribers)
                            apiFilters.number_of_subscribers = { min: youtubeFilters.min_subscribers || null, max: youtubeFilters.max_subscribers || null };
                        if (youtubeFilters.topics && typeof youtubeFilters.topics === "string")
                            apiFilters.topics = String(youtubeFilters.topics).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.keywords_in_video_titles && typeof youtubeFilters.keywords_in_video_titles === "string")
                            apiFilters.keywords_in_video_titles = String(youtubeFilters.keywords_in_video_titles).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.keywords_in_description && typeof youtubeFilters.keywords_in_description === "string")
                            apiFilters.keywords_in_description = String(youtubeFilters.keywords_in_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.keywords_not_in_description && typeof youtubeFilters.keywords_not_in_description === "string")
                            apiFilters.keywords_not_in_description = String(youtubeFilters.keywords_not_in_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.keywords_in_video_description && typeof youtubeFilters.keywords_in_video_description === "string")
                            apiFilters.keywords_in_video_description = String(youtubeFilters.keywords_in_video_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.keywords_not_in_video_description && typeof youtubeFilters.keywords_not_in_video_description === "string")
                            apiFilters.keywords_not_in_video_description = String(youtubeFilters.keywords_not_in_video_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.links_from_description && typeof youtubeFilters.links_from_description === "string")
                            apiFilters.links_from_description = String(youtubeFilters.links_from_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.hashtags && typeof youtubeFilters.hashtags === "string")
                            apiFilters.hashtags = String(youtubeFilters.hashtags).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.not_hashtags && typeof youtubeFilters.not_hashtags === "string")
                            apiFilters.not_hashtags = String(youtubeFilters.not_hashtags).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.links_from_video_description && typeof youtubeFilters.links_from_video_description === "string")
                            apiFilters.links_from_video_description = String(youtubeFilters.links_from_video_description).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.posting_frequency)
                            apiFilters.posting_frequency = youtubeFilters.posting_frequency;
                        if (youtubeFilters.subscriber_growth_percentage || youtubeFilters.subscriber_growth_time_range_months)
                            apiFilters.subscriber_growth = { growth_percentage: youtubeFilters.subscriber_growth_percentage || null, time_range_months: youtubeFilters.subscriber_growth_time_range_months || 3 };
                        if (youtubeFilters.has_shorts !== undefined)
                            apiFilters.has_shorts = youtubeFilters.has_shorts;
                        if (youtubeFilters.min_shorts_percentage || youtubeFilters.max_shorts_percentage)
                            apiFilters.shorts_percentage = { min: youtubeFilters.min_shorts_percentage || null, max: youtubeFilters.max_shorts_percentage || null };
                        if (youtubeFilters.engagement_percent_min || youtubeFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: youtubeFilters.engagement_percent_min || null, max: youtubeFilters.engagement_percent_max || null };
                        if (youtubeFilters.has_community_posts !== undefined)
                            apiFilters.has_community_posts = youtubeFilters.has_community_posts;
                        if (youtubeFilters.streams_live !== undefined)
                            apiFilters.streams_live = youtubeFilters.streams_live;
                        if (youtubeFilters.has_merch !== undefined)
                            apiFilters.has_merch = youtubeFilters.has_merch;
                        if (youtubeFilters.has_podcast !== undefined)
                            apiFilters.has_podcast = youtubeFilters.has_podcast;
                        if (youtubeFilters.has_courses !== undefined)
                            apiFilters.has_courses = youtubeFilters.has_courses;
                        if (youtubeFilters.has_membership !== undefined)
                            apiFilters.has_membership = youtubeFilters.has_membership;
                        if (youtubeFilters.min_average_views_on_long_videos || youtubeFilters.max_average_views_on_long_videos)
                            apiFilters.average_views_on_long_videos = { min: youtubeFilters.min_average_views_on_long_videos || null, max: youtubeFilters.max_average_views_on_long_videos || null };
                        if (youtubeFilters.min_average_views_on_shorts || youtubeFilters.max_average_views_on_shorts)
                            apiFilters.average_views_on_shorts = { min: youtubeFilters.min_average_views_on_shorts || null, max: youtubeFilters.max_average_views_on_shorts || null };
                        if (youtubeFilters.min_number_of_videos || youtubeFilters.max_number_of_videos)
                            apiFilters.number_of_videos = { min: youtubeFilters.min_number_of_videos || null, max: youtubeFilters.max_number_of_videos || null };
                        if (youtubeFilters.is_monetizing !== undefined)
                            apiFilters.is_monetizing = youtubeFilters.is_monetizing;
                        if (youtubeFilters.similar_to && typeof youtubeFilters.similar_to === "string")
                            apiFilters.similar_to = String(youtubeFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        if (youtubeFilters.income_min || youtubeFilters.income_max)
                            apiFilters.income = { min: youtubeFilters.income_min || null, max: youtubeFilters.income_max || null };
                        if (youtubeFilters.last_upload_long_video)
                            apiFilters.last_upload_long_video = youtubeFilters.last_upload_long_video;
                        if (youtubeFilters.last_upload_short_video)
                            apiFilters.last_upload_short_video = youtubeFilters.last_upload_short_video;
                        if (youtubeFilters.is_verified !== undefined)
                            apiFilters.is_verified = youtubeFilters.is_verified;
                    }
                    if (platform === "tiktok") {
                        if (tiktokFilters.number_of_followers_min || tiktokFilters.number_of_followers_max)
                            apiFilters.number_of_followers = { min: tiktokFilters.number_of_followers_min || null, max: tiktokFilters.number_of_followers_max || null };
                        if (tiktokFilters.posting_frequency)
                            apiFilters.posting_frequency = tiktokFilters.posting_frequency;
                        if (tiktokFilters.follower_growth_percentage || tiktokFilters.follower_growth_time_range_months)
                            apiFilters.follower_growth = { growth_percentage: tiktokFilters.follower_growth_percentage || null, time_range_months: tiktokFilters.follower_growth_time_range_months || 3 };
                        if (tiktokFilters.average_likes_min || tiktokFilters.average_likes_max)
                            apiFilters.average_likes = { min: tiktokFilters.average_likes_min || null, max: tiktokFilters.average_likes_max || null };
                        if (tiktokFilters.average_comments_min || tiktokFilters.average_comments_max)
                            apiFilters.average_comments = { min: tiktokFilters.average_comments_min || null, max: tiktokFilters.average_comments_max || null };
                        if (tiktokFilters.engagement_percent_min || tiktokFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: tiktokFilters.engagement_percent_min || null, max: tiktokFilters.engagement_percent_max || null };
                        if (tiktokFilters.average_views_min || tiktokFilters.average_views_max)
                            apiFilters.average_views = { min: tiktokFilters.average_views_min || null, max: tiktokFilters.average_views_max || null };
                        if (tiktokFilters.average_video_downloads_min || tiktokFilters.average_video_downloads_max)
                            apiFilters.average_video_downloads = { min: tiktokFilters.average_video_downloads_min || null, max: tiktokFilters.average_video_downloads_max || null };
                        if (tiktokFilters.video_count_min || tiktokFilters.video_count_max)
                            apiFilters.video_count = { min: tiktokFilters.video_count_min || null, max: tiktokFilters.video_count_max || null };
                        if (tiktokFilters.has_tik_tok_shop !== undefined)
                            apiFilters.has_tik_tok_shop = tiktokFilters.has_tik_tok_shop;
                        if (tiktokFilters.exclude_private_profile !== undefined)
                            apiFilters.exclude_private_profile = tiktokFilters.exclude_private_profile;
                        if (tiktokFilters.is_verified !== undefined)
                            apiFilters.is_verified = tiktokFilters.is_verified;
                        if (tiktokFilters.similar_to && typeof tiktokFilters.similar_to === "string")
                            apiFilters.similar_to = String(tiktokFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        if (tiktokFilters.last_post)
                            apiFilters.last_post = tiktokFilters.last_post;
                        const commaToArray = (v) => typeof v === "string" ? String(v).split(",").map((k) => k.trim()).filter(Boolean) : undefined;
                        if (commaToArray(tiktokFilters.keywords_in_bio))
                            apiFilters.keywords_in_bio = commaToArray(tiktokFilters.keywords_in_bio);
                        if (commaToArray(tiktokFilters.exclude_keywords_in_bio))
                            apiFilters.exclude_keywords_in_bio = commaToArray(tiktokFilters.exclude_keywords_in_bio);
                        if (commaToArray(tiktokFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(tiktokFilters.link_in_bio);
                        if (commaToArray(tiktokFilters.hashtags))
                            apiFilters.hashtags = commaToArray(tiktokFilters.hashtags);
                        if (commaToArray(tiktokFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(tiktokFilters.not_hashtags);
                        if (commaToArray(tiktokFilters.video_description))
                            apiFilters.video_description = commaToArray(tiktokFilters.video_description);
                        if (commaToArray(tiktokFilters.not_video_description))
                            apiFilters.not_video_description = commaToArray(tiktokFilters.not_video_description);
                    }
                    if (platform === "twitter") {
                        if (twitterFilters.number_of_followers_min || twitterFilters.number_of_followers_max)
                            apiFilters.number_of_followers = { min: twitterFilters.number_of_followers_min || null, max: twitterFilters.number_of_followers_max || null };
                        if (twitterFilters.engagement_percent_min || twitterFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: twitterFilters.engagement_percent_min || null, max: twitterFilters.engagement_percent_max || null };
                        if (twitterFilters.tweets_count_min || twitterFilters.tweets_count_max)
                            apiFilters.tweets_count = { min: twitterFilters.tweets_count_min || null, max: twitterFilters.tweets_count_max || null };
                        if (twitterFilters.average_likes_min || twitterFilters.average_likes_max)
                            apiFilters.average_likes = { min: twitterFilters.average_likes_min || null, max: twitterFilters.average_likes_max || null };
                        if (twitterFilters.last_post)
                            apiFilters.last_post = twitterFilters.last_post;
                        if (twitterFilters.similar_to && typeof twitterFilters.similar_to === "string")
                            apiFilters.similar_to = String(twitterFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        const commaToArray = (v) => typeof v === "string" ? String(v).split(",").map((k) => k.trim()).filter(Boolean) : undefined;
                        if (commaToArray(twitterFilters.keywords_in_bio))
                            apiFilters.keywords_in_bio = commaToArray(twitterFilters.keywords_in_bio);
                        if (commaToArray(twitterFilters.exclude_keywords_in_bio))
                            apiFilters.exclude_keywords_in_bio = commaToArray(twitterFilters.exclude_keywords_in_bio);
                        if (commaToArray(twitterFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(twitterFilters.link_in_bio);
                        if (commaToArray(twitterFilters.hashtags))
                            apiFilters.hashtags = commaToArray(twitterFilters.hashtags);
                        if (commaToArray(twitterFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(twitterFilters.not_hashtags);
                        if (commaToArray(twitterFilters.tweets))
                            apiFilters.tweets = commaToArray(twitterFilters.tweets);
                    }
                    if (platform === "onlyfans") {
                        if (onlyfansFilters.subscription_price_min || onlyfansFilters.subscription_price_max)
                            apiFilters.subscription_price = { min: onlyfansFilters.subscription_price_min || null, max: onlyfansFilters.subscription_price_max || null };
                        if (onlyfansFilters.number_of_photos_min || onlyfansFilters.number_of_photos_max)
                            apiFilters.number_of_photos = { min: onlyfansFilters.number_of_photos_min || null, max: onlyfansFilters.number_of_photos_max || null };
                        if (onlyfansFilters.number_of_likes_min || onlyfansFilters.number_of_likes_max)
                            apiFilters.number_of_likes = { min: onlyfansFilters.number_of_likes_min || null, max: onlyfansFilters.number_of_likes_max || null };
                        if (onlyfansFilters.last_active)
                            apiFilters.last_active = onlyfansFilters.last_active;
                        if (onlyfansFilters.similar_to && typeof onlyfansFilters.similar_to === "string")
                            apiFilters.similar_to = String(onlyfansFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        if (onlyfansFilters.has_videos !== undefined)
                            apiFilters.has_videos = onlyfansFilters.has_videos;
                        if (onlyfansFilters.has_free_account !== undefined)
                            apiFilters.has_free_account = onlyfansFilters.has_free_account;
                        if (onlyfansFilters.has_live_streams !== undefined)
                            apiFilters.has_live_streams = onlyfansFilters.has_live_streams;
                        if (onlyfansFilters.is_verified !== undefined)
                            apiFilters.is_verified = onlyfansFilters.is_verified;
                    }
                    if (platform === "twitch") {
                        if (twitchFilters.followers_min || twitchFilters.followers_max)
                            apiFilters.followers = { min: twitchFilters.followers_min || null, max: twitchFilters.followers_max || null };
                        if (twitchFilters.active_subscribers_min || twitchFilters.active_subscribers_max)
                            apiFilters.active_subscribers = { min: twitchFilters.active_subscribers_min || null, max: twitchFilters.active_subscribers_max || null };
                        if (twitchFilters.min_streamed_hours_last_30_days || twitchFilters.max_streamed_hours_last_30_days)
                            apiFilters.streamed_hours_last_30_days = { min: twitchFilters.min_streamed_hours_last_30_days || null, max: twitchFilters.max_streamed_hours_last_30_days || null };
                        if (twitchFilters.min_total_hours_streamed || twitchFilters.max_total_hours_streamed)
                            apiFilters.total_hours_streamed = { min: twitchFilters.min_total_hours_streamed || null, max: twitchFilters.max_total_hours_streamed || null };
                        if (twitchFilters.min_maximum_views_count || twitchFilters.max_maximum_views_count)
                            apiFilters.maximum_views_count = { min: twitchFilters.min_maximum_views_count || null, max: twitchFilters.max_maximum_views_count || null };
                        if (twitchFilters.min_avg_views_last_30_days || twitchFilters.max_avg_views_last_30_days)
                            apiFilters.avg_views_last_30_days = { min: twitchFilters.min_avg_views_last_30_days || null, max: twitchFilters.max_avg_views_last_30_days || null };
                        if (twitchFilters.min_streams_count_last_30_days || twitchFilters.max_streams_count_last_30_days)
                            apiFilters.streams_count_last_30_days = { min: twitchFilters.min_streams_count_last_30_days || null, max: twitchFilters.max_streams_count_last_30_days || null };
                        if (twitchFilters.games_played && typeof twitchFilters.games_played === "string")
                            apiFilters.games_played = String(twitchFilters.games_played).split(",").map((k) => k.trim()).filter(Boolean);
                        if (twitchFilters.is_twitch_partner !== undefined)
                            apiFilters.is_twitch_partner = twitchFilters.is_twitch_partner;
                        if (twitchFilters.keywords_in_description !== undefined)
                            apiFilters.keywords_in_description = twitchFilters.keywords_in_description;
                        if (twitchFilters.similar_to && typeof twitchFilters.similar_to === "string")
                            apiFilters.similar_to = String(twitchFilters.similar_to).split(",").map((k) => k.trim()).filter(Boolean);
                        if (twitchFilters.most_recent_stream_date)
                            apiFilters.most_recent_stream_date = twitchFilters.most_recent_stream_date;
                        if (twitchFilters.link_in_bio && typeof twitchFilters.link_in_bio === "string")
                            apiFilters.link_in_bio = String(twitchFilters.link_in_bio).split(",").map((k) => k.trim()).filter(Boolean);
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
                        url: "https://api-dashboard.influencers.club/public/v1/discovery/",
                        body,
                        json: true,
                    };
                    {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                        outputItems.push({ json: resp, pairedItem: { item: 0 } });
                    }
                    break;
                }
                case "findLookalikes": {
                    const filter_value = this.getNodeParameter("filter_value", 0);
                    const filter_key = this.getNodeParameter("filter_key", 0);
                    const platform = this.getNodeParameter("platform", 0);
                    const ai_search = this.getNodeParameter("ai_search", 0, "");
                    const sharedFilters = this.getNodeParameter("advancedFilters.filters", 0, {});
                    const instagramFilters = this.getNodeParameter("advancedFilters.instagramFilters", 0, {});
                    const youtubeFilters = this.getNodeParameter("advancedFilters.youtubeFilters", 0, {});
                    const tiktokFilters = this.getNodeParameter("advancedFilters.tiktokFilters", 0, {});
                    const twitterFilters = this.getNodeParameter("advancedFilters.twitterFilters", 0, {});
                    const onlyfansFilters = this.getNodeParameter("advancedFilters.onlyfansFilters", 0, {});
                    const twitchFilters = this.getNodeParameter("advancedFilters.twitchFilters", 0, {});
                    // Reuse discovery filter mapping
                    const apiFilters = {};
                    if (sharedFilters.location && sharedFilters.location !== "")
                        apiFilters.location = String(sharedFilters.location).split(",").map((s) => s.trim()).filter(Boolean);
                    if (sharedFilters.type && sharedFilters.type !== "" && ["instagram", "youtube", "tiktok"].includes(platform))
                        apiFilters.type = sharedFilters.type;
                    if (sharedFilters.gender && sharedFilters.gender !== "" && sharedFilters.type !== "business")
                        apiFilters.gender = sharedFilters.gender;
                    if (sharedFilters.profile_language && sharedFilters.profile_language !== "")
                        apiFilters.speaking_language = String(sharedFilters.profile_language).split(",").map((s) => s.trim()).filter(Boolean);
                    if (sharedFilters.promotes_affiliate_links !== undefined)
                        apiFilters.promotes_affiliate_links = sharedFilters.promotes_affiliate_links;
                    if (sharedFilters.has_done_brand_deals !== undefined)
                        apiFilters.has_done_brand_deals = sharedFilters.has_done_brand_deals;
                    if (sharedFilters.has_link_in_bio !== undefined)
                        apiFilters.has_link_in_bio = sharedFilters.has_link_in_bio;
                    if (sharedFilters.does_live_streaming !== undefined)
                        apiFilters.does_live_streaming = sharedFilters.does_live_streaming;
                    if (sharedFilters.has_merch !== undefined)
                        apiFilters.has_merch = sharedFilters.has_merch;
                    if (sharedFilters.brands && typeof sharedFilters.brands === "string")
                        apiFilters.brands = String(sharedFilters.brands).split(",").map((s) => s.trim()).filter(Boolean);
                    const creatorHas = this.getNodeParameter("advancedFilters.filters.creator_has.platforms", 0, []);
                    if (creatorHas && Array.isArray(creatorHas) && creatorHas.length) {
                        apiFilters.creator_has = {};
                        for (const entry of creatorHas) {
                            for (const [key, value] of Object.entries(entry)) {
                                apiFilters.creator_has[key] = value;
                            }
                        }
                    }
                    const commaToArray = (v) => typeof v === "string" ? String(v).split(",").map((k) => k.trim()).filter(Boolean) : undefined;
                    if (platform === "instagram") {
                        if (instagramFilters.min_followers || instagramFilters.max_followers)
                            apiFilters.number_of_followers = { min: instagramFilters.min_followers || null, max: instagramFilters.max_followers || null };
                        if (instagramFilters.posting_frequency)
                            apiFilters.posting_frequency = instagramFilters.posting_frequency;
                        if (instagramFilters.follower_growth_percentage || instagramFilters.follower_growth_time_range_months)
                            apiFilters.follower_growth = { growth_percentage: instagramFilters.follower_growth_percentage || null, time_range_months: instagramFilters.follower_growth_time_range_months || 3 };
                        if (instagramFilters.min_number_of_posts || instagramFilters.max_number_of_posts)
                            apiFilters.number_of_posts = { min: instagramFilters.min_number_of_posts || null, max: instagramFilters.max_number_of_posts || null };
                        if (instagramFilters.min_average_likes || instagramFilters.max_average_likes)
                            apiFilters.average_likes = { min: instagramFilters.min_average_likes || null, max: instagramFilters.max_average_likes || null };
                        if (instagramFilters.min_average_comments || instagramFilters.max_average_comments)
                            apiFilters.average_comments = { min: instagramFilters.min_average_comments || null, max: instagramFilters.max_average_comments || null };
                        if (instagramFilters.min_reels_percent || instagramFilters.max_reels_percent)
                            apiFilters.reels_percent = { min: instagramFilters.min_reels_percent || null, max: instagramFilters.max_reels_percent || null };
                        if (instagramFilters.min_average_views_for_reels || instagramFilters.max_average_views_for_reels)
                            apiFilters.average_views_for_reels = { min: instagramFilters.min_average_views_for_reels || null, max: instagramFilters.max_average_views_for_reels || null };
                        if (instagramFilters.min_income || instagramFilters.max_income)
                            apiFilters.income = { min: instagramFilters.min_income || null, max: instagramFilters.max_income || null };
                        if (instagramFilters.min_video_percentage || instagramFilters.max_video_percentage)
                            apiFilters.video_percentage = { min: instagramFilters.min_video_percentage || null, max: instagramFilters.max_video_percentage || null };
                        if (instagramFilters.exclude_private_profile !== undefined)
                            apiFilters.exclude_private_profile = instagramFilters.exclude_private_profile;
                        if (instagramFilters.is_verified !== undefined)
                            apiFilters.is_verified = instagramFilters.is_verified;
                        if (instagramFilters.has_videos !== undefined)
                            apiFilters.has_videos = instagramFilters.has_videos;
                        if (instagramFilters.last_post)
                            apiFilters.last_post = instagramFilters.last_post;
                        if (commaToArray(instagramFilters.keywords_in_bio))
                            apiFilters.keywords_in_bio = commaToArray(instagramFilters.keywords_in_bio);
                        if (commaToArray(instagramFilters.exclude_keywords_in_bio))
                            apiFilters.exclude_keywords_in_bio = commaToArray(instagramFilters.exclude_keywords_in_bio);
                        if (commaToArray(instagramFilters.similar_to))
                            apiFilters.similar_to = commaToArray(instagramFilters.similar_to);
                        if (commaToArray(instagramFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(instagramFilters.link_in_bio);
                        if (commaToArray(instagramFilters.hashtags))
                            apiFilters.hashtags = commaToArray(instagramFilters.hashtags);
                        if (commaToArray(instagramFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(instagramFilters.not_hashtags);
                        if (commaToArray(instagramFilters.keywords_in_captions))
                            apiFilters.keywords_in_captions = commaToArray(instagramFilters.keywords_in_captions);
                        if (instagramFilters.engagement_percent_min || instagramFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: instagramFilters.engagement_percent_min || null, max: instagramFilters.engagement_percent_max || null };
                    }
                    if (platform === "youtube") {
                        if (youtubeFilters.min_subscribers || youtubeFilters.max_subscribers)
                            apiFilters.number_of_subscribers = { min: youtubeFilters.min_subscribers || null, max: youtubeFilters.max_subscribers || null };
                        if (commaToArray(youtubeFilters.topics))
                            apiFilters.topics = commaToArray(youtubeFilters.topics);
                        if (commaToArray(youtubeFilters.keywords_in_video_titles))
                            apiFilters.keywords_in_video_titles = commaToArray(youtubeFilters.keywords_in_video_titles);
                        if (commaToArray(youtubeFilters.keywords_in_description))
                            apiFilters.keywords_in_description = commaToArray(youtubeFilters.keywords_in_description);
                        if (commaToArray(youtubeFilters.keywords_not_in_description))
                            apiFilters.keywords_not_in_description = commaToArray(youtubeFilters.keywords_not_in_description);
                        if (commaToArray(youtubeFilters.keywords_in_video_description))
                            apiFilters.keywords_in_video_description = commaToArray(youtubeFilters.keywords_in_video_description);
                        if (commaToArray(youtubeFilters.keywords_not_in_video_description))
                            apiFilters.keywords_not_in_video_description = commaToArray(youtubeFilters.keywords_not_in_video_description);
                        if (commaToArray(youtubeFilters.links_from_description))
                            apiFilters.links_from_description = commaToArray(youtubeFilters.links_from_description);
                        if (commaToArray(youtubeFilters.hashtags))
                            apiFilters.hashtags = commaToArray(youtubeFilters.hashtags);
                        if (commaToArray(youtubeFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(youtubeFilters.not_hashtags);
                        if (commaToArray(youtubeFilters.links_from_video_description))
                            apiFilters.links_from_video_description = commaToArray(youtubeFilters.links_from_video_description);
                        if (youtubeFilters.posting_frequency)
                            apiFilters.posting_frequency = youtubeFilters.posting_frequency;
                        if (youtubeFilters.subscriber_growth_percentage || youtubeFilters.subscriber_growth_time_range_months)
                            apiFilters.subscriber_growth = { growth_percentage: youtubeFilters.subscriber_growth_percentage || null, time_range_months: youtubeFilters.subscriber_growth_time_range_months || 3 };
                        if (youtubeFilters.has_shorts !== undefined)
                            apiFilters.has_shorts = youtubeFilters.has_shorts;
                        if (youtubeFilters.min_shorts_percentage || youtubeFilters.max_shorts_percentage)
                            apiFilters.shorts_percentage = { min: youtubeFilters.min_shorts_percentage || null, max: youtubeFilters.max_shorts_percentage || null };
                        if (youtubeFilters.engagement_percent_min || youtubeFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: youtubeFilters.engagement_percent_min || null, max: youtubeFilters.engagement_percent_max || null };
                        if (youtubeFilters.has_community_posts !== undefined)
                            apiFilters.has_community_posts = youtubeFilters.has_community_posts;
                        if (youtubeFilters.streams_live !== undefined)
                            apiFilters.streams_live = youtubeFilters.streams_live;
                        if (youtubeFilters.has_merch !== undefined)
                            apiFilters.has_merch = youtubeFilters.has_merch;
                        if (youtubeFilters.has_podcast !== undefined)
                            apiFilters.has_podcast = youtubeFilters.has_podcast;
                        if (youtubeFilters.has_courses !== undefined)
                            apiFilters.has_courses = youtubeFilters.has_courses;
                        if (youtubeFilters.has_membership !== undefined)
                            apiFilters.has_membership = youtubeFilters.has_membership;
                        if (youtubeFilters.min_average_views_on_long_videos || youtubeFilters.max_average_views_on_long_videos)
                            apiFilters.average_views_on_long_videos = { min: youtubeFilters.min_average_views_on_long_videos || null, max: youtubeFilters.max_average_views_on_long_videos || null };
                        if (youtubeFilters.min_average_views_on_shorts || youtubeFilters.max_average_views_on_shorts)
                            apiFilters.average_views_on_shorts = { min: youtubeFilters.min_average_views_on_shorts || null, max: youtubeFilters.max_average_views_on_shorts || null };
                        if (youtubeFilters.min_number_of_videos || youtubeFilters.max_number_of_videos)
                            apiFilters.number_of_videos = { min: youtubeFilters.min_number_of_videos || null, max: youtubeFilters.max_number_of_videos || null };
                        if (youtubeFilters.is_monetizing !== undefined)
                            apiFilters.is_monetizing = youtubeFilters.is_monetizing;
                        if (commaToArray(youtubeFilters.similar_to))
                            apiFilters.similar_to = commaToArray(youtubeFilters.similar_to);
                        if (youtubeFilters.income_min || youtubeFilters.income_max)
                            apiFilters.income = { min: youtubeFilters.income_min || null, max: youtubeFilters.income_max || null };
                        if (youtubeFilters.last_upload_long_video)
                            apiFilters.last_upload_long_video = youtubeFilters.last_upload_long_video;
                        if (youtubeFilters.last_upload_short_video)
                            apiFilters.last_upload_short_video = youtubeFilters.last_upload_short_video;
                        if (youtubeFilters.is_verified !== undefined)
                            apiFilters.is_verified = youtubeFilters.is_verified;
                    }
                    if (platform === "tiktok") {
                        if (tiktokFilters.number_of_followers_min || tiktokFilters.number_of_followers_max)
                            apiFilters.number_of_followers = { min: tiktokFilters.number_of_followers_min || null, max: tiktokFilters.number_of_followers_max || null };
                        if (tiktokFilters.posting_frequency)
                            apiFilters.posting_frequency = tiktokFilters.posting_frequency;
                        if (tiktokFilters.follower_growth_percentage || tiktokFilters.follower_growth_time_range_months)
                            apiFilters.follower_growth = { growth_percentage: tiktokFilters.follower_growth_percentage || null, time_range_months: tiktokFilters.follower_growth_time_range_months || 3 };
                        if (tiktokFilters.average_likes_min || tiktokFilters.average_likes_max)
                            apiFilters.average_likes = { min: tiktokFilters.average_likes_min || null, max: tiktokFilters.average_likes_max || null };
                        if (tiktokFilters.average_comments_min || tiktokFilters.average_comments_max)
                            apiFilters.average_comments = { min: tiktokFilters.average_comments_min || null, max: tiktokFilters.average_comments_max || null };
                        if (tiktokFilters.engagement_percent_min || tiktokFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: tiktokFilters.engagement_percent_min || null, max: tiktokFilters.engagement_percent_max || null };
                        if (tiktokFilters.average_views_min || tiktokFilters.average_views_max)
                            apiFilters.average_views = { min: tiktokFilters.average_views_min || null, max: tiktokFilters.average_views_max || null };
                        if (tiktokFilters.average_video_downloads_min || tiktokFilters.average_video_downloads_max)
                            apiFilters.average_video_downloads = { min: tiktokFilters.average_video_downloads_min || null, max: tiktokFilters.average_video_downloads_max || null };
                        if (tiktokFilters.video_count_min || tiktokFilters.video_count_max)
                            apiFilters.video_count = { min: tiktokFilters.video_count_min || null, max: tiktokFilters.video_count_max || null };
                        if (tiktokFilters.has_tik_tok_shop !== undefined)
                            apiFilters.has_tik_tok_shop = tiktokFilters.has_tik_tok_shop;
                        if (tiktokFilters.exclude_private_profile !== undefined)
                            apiFilters.exclude_private_profile = tiktokFilters.exclude_private_profile;
                        if (tiktokFilters.is_verified !== undefined)
                            apiFilters.is_verified = tiktokFilters.is_verified;
                        if (commaToArray(tiktokFilters.similar_to))
                            apiFilters.similar_to = commaToArray(tiktokFilters.similar_to);
                        if (tiktokFilters.last_post)
                            apiFilters.last_post = tiktokFilters.last_post;
                        if (commaToArray(tiktokFilters.keywords_in_bio))
                            apiFilters.keywords_in_bio = commaToArray(tiktokFilters.keywords_in_bio);
                        if (commaToArray(tiktokFilters.exclude_keywords_in_bio))
                            apiFilters.exclude_keywords_in_bio = commaToArray(tiktokFilters.exclude_keywords_in_bio);
                        if (commaToArray(tiktokFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(tiktokFilters.link_in_bio);
                        if (commaToArray(tiktokFilters.hashtags))
                            apiFilters.hashtags = commaToArray(tiktokFilters.hashtags);
                        if (commaToArray(tiktokFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(tiktokFilters.not_hashtags);
                        if (commaToArray(tiktokFilters.video_description))
                            apiFilters.video_description = commaToArray(tiktokFilters.video_description);
                        if (commaToArray(tiktokFilters.not_video_description))
                            apiFilters.not_video_description = commaToArray(tiktokFilters.not_video_description);
                    }
                    if (platform === "twitter") {
                        if (twitterFilters.number_of_followers_min || twitterFilters.number_of_followers_max)
                            apiFilters.number_of_followers = { min: twitterFilters.number_of_followers_min || null, max: twitterFilters.number_of_followers_max || null };
                        if (twitterFilters.engagement_percent_min || twitterFilters.engagement_percent_max)
                            apiFilters.engagement_percent = { min: twitterFilters.engagement_percent_min || null, max: twitterFilters.engagement_percent_max || null };
                        if (twitterFilters.tweets_count_min || twitterFilters.tweets_count_max)
                            apiFilters.tweets_count = { min: twitterFilters.tweets_count_min || null, max: twitterFilters.tweets_count_max || null };
                        if (twitterFilters.average_likes_min || twitterFilters.average_likes_max)
                            apiFilters.average_likes = { min: twitterFilters.average_likes_min || null, max: twitterFilters.average_likes_max || null };
                        if (twitterFilters.last_post)
                            apiFilters.last_post = twitterFilters.last_post;
                        if (commaToArray(twitterFilters.similar_to))
                            apiFilters.similar_to = commaToArray(twitterFilters.similar_to);
                        if (commaToArray(twitterFilters.keywords_in_bio))
                            apiFilters.keywords_in_bio = commaToArray(twitterFilters.keywords_in_bio);
                        if (commaToArray(twitterFilters.exclude_keywords_in_bio))
                            apiFilters.exclude_keywords_in_bio = commaToArray(twitterFilters.exclude_keywords_in_bio);
                        if (commaToArray(twitterFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(twitterFilters.link_in_bio);
                        if (commaToArray(twitterFilters.hashtags))
                            apiFilters.hashtags = commaToArray(twitterFilters.hashtags);
                        if (commaToArray(twitterFilters.not_hashtags))
                            apiFilters.not_hashtags = commaToArray(twitterFilters.not_hashtags);
                        if (commaToArray(twitterFilters.tweets))
                            apiFilters.tweets = commaToArray(twitterFilters.tweets);
                    }
                    if (platform === "onlyfans") {
                        if (onlyfansFilters.subscription_price_min || onlyfansFilters.subscription_price_max)
                            apiFilters.subscription_price = { min: onlyfansFilters.subscription_price_min || null, max: onlyfansFilters.subscription_price_max || null };
                        if (onlyfansFilters.number_of_photos_min || onlyfansFilters.number_of_photos_max)
                            apiFilters.number_of_photos = { min: onlyfansFilters.number_of_photos_min || null, max: onlyfansFilters.number_of_photos_max || null };
                        if (onlyfansFilters.number_of_likes_min || onlyfansFilters.number_of_likes_max)
                            apiFilters.number_of_likes = { min: onlyfansFilters.number_of_likes_min || null, max: onlyfansFilters.number_of_likes_max || null };
                        if (onlyfansFilters.last_active)
                            apiFilters.last_active = onlyfansFilters.last_active;
                        if (commaToArray(onlyfansFilters.similar_to))
                            apiFilters.similar_to = commaToArray(onlyfansFilters.similar_to);
                        if (onlyfansFilters.has_videos !== undefined)
                            apiFilters.has_videos = onlyfansFilters.has_videos;
                        if (onlyfansFilters.has_free_account !== undefined)
                            apiFilters.has_free_account = onlyfansFilters.has_free_account;
                        if (onlyfansFilters.has_live_streams !== undefined)
                            apiFilters.has_live_streams = onlyfansFilters.has_live_streams;
                        if (onlyfansFilters.is_verified !== undefined)
                            apiFilters.is_verified = onlyfansFilters.is_verified;
                    }
                    if (platform === "twitch") {
                        if (twitchFilters.followers_min || twitchFilters.followers_max)
                            apiFilters.followers = { min: twitchFilters.followers_min || null, max: twitchFilters.followers_max || null };
                        if (twitchFilters.active_subscribers_min || twitchFilters.active_subscribers_max)
                            apiFilters.active_subscribers = { min: twitchFilters.active_subscribers_min || null, max: twitchFilters.active_subscribers_max || null };
                        if (twitchFilters.min_streamed_hours_last_30_days || twitchFilters.max_streamed_hours_last_30_days)
                            apiFilters.streamed_hours_last_30_days = { min: twitchFilters.min_streamed_hours_last_30_days || null, max: twitchFilters.max_streamed_hours_last_30_days || null };
                        if (twitchFilters.min_total_hours_streamed || twitchFilters.max_total_hours_streamed)
                            apiFilters.total_hours_streamed = { min: twitchFilters.min_total_hours_streamed || null, max: twitchFilters.max_total_hours_streamed || null };
                        if (twitchFilters.min_maximum_views_count || twitchFilters.max_maximum_views_count)
                            apiFilters.maximum_views_count = { min: twitchFilters.min_maximum_views_count || null, max: twitchFilters.max_maximum_views_count || null };
                        if (twitchFilters.min_avg_views_last_30_days || twitchFilters.max_avg_views_last_30_days)
                            apiFilters.avg_views_last_30_days = { min: twitchFilters.min_avg_views_last_30_days || null, max: twitchFilters.max_avg_views_last_30_days || null };
                        if (twitchFilters.min_streams_count_last_30_days || twitchFilters.max_streams_count_last_30_days)
                            apiFilters.streams_count_last_30_days = { min: twitchFilters.min_streams_count_last_30_days || null, max: twitchFilters.max_streams_count_last_30_days || null };
                        if (commaToArray(twitchFilters.games_played))
                            apiFilters.games_played = commaToArray(twitchFilters.games_played);
                        if (twitchFilters.is_twitch_partner !== undefined)
                            apiFilters.is_twitch_partner = twitchFilters.is_twitch_partner;
                        if (twitchFilters.keywords_in_description !== undefined)
                            apiFilters.keywords_in_description = twitchFilters.keywords_in_description;
                        if (commaToArray(twitchFilters.similar_to))
                            apiFilters.similar_to = commaToArray(twitchFilters.similar_to);
                        if (twitchFilters.most_recent_stream_date)
                            apiFilters.most_recent_stream_date = twitchFilters.most_recent_stream_date;
                        if (commaToArray(twitchFilters.link_in_bio))
                            apiFilters.link_in_bio = commaToArray(twitchFilters.link_in_bio);
                    }
                    const paging_limit = this.getNodeParameter("paging_limit", 0, 5);
                    const paging_page = this.getNodeParameter("paging_page", 0, 0);
                    const body = {
                        filter_value,
                        filter_key,
                        platform,
                        paging: { limit: paging_limit, page: paging_page },
                        filters: { ai_search: ai_search || "", ...apiFilters },
                    };
                    const options = {
                        method: "POST",
                        url: "https://api-dashboard.influencers.club/public/v1/discovery/creators/similar/",
                        body,
                        json: true,
                    };
                    {
                        const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                        outputItems.push({ json: resp, pairedItem: { item: 0 } });
                    }
                    break;
                }
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Operation ${operation} not supported`, { itemIndex: 0 });
            }
        }
        catch (error) {
            if (this.continueOnFail()) {
                outputItems.push({ json: { error: error.message }, pairedItem: { item: 0 } });
            }
            else {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
        }
        return [outputItems];
    }
}
exports.InfluencersClub = InfluencersClub;
