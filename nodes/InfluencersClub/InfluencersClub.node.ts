import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
    INodeExecutionData,
    NodeApiError,
    NodeOperationError,
    NodeConnectionTypes,
    JsonObject,
} from "n8n-workflow";

export class InfluencersClub implements INodeType {
	description: INodeTypeDescription = {
		displayName: "Influencers Club",
		name: "influencersClub",
		group: ["transform"],
		version: 1,
		description: "Interact with Influencers Club API for creator enrichment and discovery",
		defaults: {
			name: "Influencers Club",
		},
		icon: "file:influencersClub.svg",
		subtitle: "={{ $parameter[\"resource\"] }} / {{ $parameter[\"operation\"] }}",
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: "influencersClubApi",
				required: true,
			},
		],
		properties: [
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Creator",
						value: "creator",
						description: "Enrich creators or find similar ones",
					},
					{
						name: "Discovery",
						value: "discovery",
						description: "Search and discover creators by filters",
					},
					{
						name: "Batch Enrichment",
						value: "batchEnrichment",
						description: "Create, check status, download, or resume batch enrichment jobs",
					},
				],
				default: "creator",
			},
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: { resource: ["creator"] },
				},
				options: [
					{
						name: "Enrich by Email",
						value: "enrichByEmail",
						description: "Enrich a creator using their email address",
						action: "Enrich by Email",
					},
					{
						name: "Enrich by Handle (Full)",
						value: "enrichByHandle",
						description: "Enrich a creator using their handle/username (full profile)",
						action: "Enrich by Handle (Full)",
					},
					{
						name: "Enrich by Handle (Raw)",
						value: "enrichByHandleRaw",
						description: "Enrich a creator using their handle/username (raw data)",
						action: "Enrich by Handle (Raw)",
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
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: { resource: ["discovery"] },
				},
				options: [
					{
						name: "Discovery",
						value: "discovery",
						description: "The Discovery API allows you to filter creators based on the filters available on the dashboard, you can use the AI seach and lookalikes search to find profiles relevant to your targeting.",
						action: "Discovery",
					},
				],
				default: "discovery",
			},
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				displayOptions: {
					show: { resource: ["batchEnrichment"] },
				},
				options: [
					{
						name: "Create Batch Enrichment",
						value: "createBatch",
						description: "Start a new batch enrichment job with a list of emails. Docs: https://app.theneo.io/influencers-club/influencers-public-api/public-v1-enrichment/public/create-batch-enrichment",
						action: "Create Batch Enrichment",
					},
					{
						name: "Get Batch Enrichment Status",
						value: "getBatchStatus",
						description: "Check the status of an existing batch job. Docs: https://app.theneo.io/influencers-club/influencers-public-api/public-v1-enrichment/public/get-batch-enrichment-status",
						action: "Get Batch Enrichment Status",
					},
					{
						name: "Download Batch Enrichment Results",
						value: "downloadBatchResults",
						description: "Download the results of a completed batch job. Docs: https://app.theneo.io/influencers-club/influencers-public-api/public-v1-enrichment/public/download-batch-enrichment-results",
						action: "Download Batch Enrichment Results",
					},
					{
						name: "Resume Batch Enrichment",
						value: "resumeBatch",
						description: "Resume a failed or paused batch job. Docs: https://app.theneo.io/influencers-club/influencers-public-api/public-v1-enrichment/public/resume-batch-enrichment",
						action: "Resume Batch Enrichment",
					},
				],
				default: "createBatch",
			},
			// Batch Enrichment parameters
			{
				displayName: "Emails",
				name: "batch_emails",
				type: "string",
				typeOptions: {
					rows: 4,
				},
				default: "",
				required: true,
				placeholder: "email1@example.com\nemail2@example.com",
				description: "One email per line (or comma-separated) to enrich in this batch",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["createBatch"],
					},
				},
			},
			{
				displayName: "Batch ID",
				name: "batch_id",
				type: "string",
				default: "",
				required: true,
				description: "The batch job ID returned when you created the batch",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["getBatchStatus", "downloadBatchResults", "resumeBatch"],
					},
				},
			},
			// Discovery: Platform, Paging, Sort at top (matches API runner)
			{
				displayName: "Platform",
				name: "platform",
				type: "options",
				options: [
					{ name: "Instagram", value: "instagram" },
					{ name: "YouTube", value: "youtube" },
					{ name: "TikTok", value: "tiktok" },
					{ name: "Twitch", value: "twitch" },
					{ name: "Twitter", value: "twitter" },
					{ name: "OnlyFans", value: "onlyfans" },
				],
				default: "instagram",
				required: true,
				description: "Platform to discover creators on (required by Discovery API)",
				displayOptions: {
					show: {
						resource: ["discovery"],
						operation: ["discovery"],
					},
				},
			},
			{
				displayName: "Limit",
				name: "discovery_limit",
				type: "number",
				default: 5,
				description: "Number of creators per page (paging object)",
				displayOptions: {
					show: {
						resource: ["discovery"],
						operation: ["discovery"],
					},
				},
			},
			{
				displayName: "Page",
				name: "discovery_page",
				type: "number",
				default: 0,
				description: "Page index for pagination (paging object)",
				displayOptions: {
					show: {
						resource: ["discovery"],
						operation: ["discovery"],
					},
				},
			},
			{
				displayName: "Sort By",
				name: "discovery_sort_by",
				type: "options",
				options: [
					{ name: "Relevancy", value: "relevancy" },
					{ name: "Engagement Rate", value: "engagement_rate" },
					{ name: "Number of Followers", value: "number_of_followers" },
				],
				default: "relevancy",
				description: "Sort creators by (sort object)",
				displayOptions: {
					show: {
						resource: ["discovery"],
						operation: ["discovery"],
					},
				},
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
						resource: ["creator"],
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
						resource: ["creator"],
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
						resource: ["creator"],
						operation: ["findLookalikes"],
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
					{ name: "Twitch", value: "twitch" },
					{ name: "Twitter", value: "twitter" },
					{ name: "OnlyFans", value: "onlyfans" },
				],
				default: "instagram",
				required: true,
				description: "Platform of the reference creator (Lookalikes / Similar API)",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["findLookalikes"],
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
						resource: ["creator"],
						operation: ["enrichByHandle", "enrichByHandleRaw"],
					},
				},
			},
			{
				displayName: "Platform",
				name: "platform",
				type: "options",
				options: [
					{ name: "Instagram", value: "instagram" },
					{ name: "YouTube", value: "youtube" },
					{ name: "TikTok", value: "tiktok" },
					{ name: "Twitch", value: "twitch" },
					{ name: "Twitter", value: "twitter" },
					{ name: "OnlyFans", value: "onlyfans" },
				],
				default: "instagram",
				required: true,
				description: "Choose the social media platform that matches the handle or URL you entered",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["enrichByHandle", "enrichByHandleRaw"],
					},
				},
			},
			{
				displayName: "Additional Options",
				name: "additionalOptions",
				type: "fixedCollection",
				placeholder: "Add options",
				default: {},
				displayOptions: {
					show: {
						resource: ["creator", "discovery"],
						operation: ["enrichByHandle", "enrichByHandleRaw", "discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "options",
						displayName: "Options",
						values: [
							{
								displayName: "AI Search",
								name: "ai_search",
								type: "string",
								default: "",
								description: "Natural-language search prompt (beta)",
								displayOptions: {
									show: {
										resource: ["creator", "discovery"],
										operation: ["discovery", "findLookalikes"],
									},
								},
							},
							// Enrich by Handle (Full) – optional
							{
								displayName: "Include Lookalikes",
								name: "include_lookalikes",
								type: "boolean",
								default: false,
								description: "Whether to include similar creators in the response",
								displayOptions: {
									show: {
										resource: ["creator"],
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
										resource: ["creator"],
										operation: ["enrichByHandle"],
									},
								},
							},
							{
								displayName: "Limit",
								name: "lookalikes_limit",
								type: "number",
								default: 5,
								description: "Number of similar creators to return",
								displayOptions: {
									show: {
										resource: ["creator"],
										operation: ["findLookalikes"],
									},
								},
							},
							{
								displayName: "Page",
								name: "lookalikes_page",
								type: "number",
								default: 0,
								description: "Zero-based page index for pagination",
								displayOptions: {
									show: {
										resource: ["creator"],
										operation: ["findLookalikes"],
									},
								},
							},
							{
								displayName: "Include Request in Output",
								name: "include_request_in_output",
								type: "boolean",
								default: false,
								description: "Attach the request body sent to the API to the output (for debugging filters)",
								displayOptions: {
									show: {
										resource: ["creator", "discovery"],
										operation: ["discovery", "findLookalikes"],
									},
								},
							},
						],
					},
				],
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
						resource: ["creator", "discovery"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "filters",
						displayName: "Filters",
						values: [
							// Top row (general): Location, Followers, Last Post, Engagement Rate, Gender, Language
							{
								displayName: "Location",
								name: "location",
								type: "string",
								default: "",
								description: "Comma-separated locations (country or city)",
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
								displayName: "Exclude Role-Based Emails",
								name: "exclude_role_based_emails",
								type: "boolean",
								default: false,
								description: "Whether to exclude creators with role-based emails (e.g. info@, support@)",
							},
							{
								displayName: "Exclude Previous",
								name: "exclude_previous",
								type: "boolean",
								default: false,
								description: "Whether to exclude previously returned creators",
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
											{ displayName: "Amazon Affiliates", name: "amazonaffiliates", type: "boolean", default: false },
											{ displayName: "Anchor", name: "anchor", type: "boolean", default: false },
											{ displayName: "Apple Music", name: "applemusic", type: "boolean", default: false },
											{ displayName: "Bandcamp", name: "bandcamp", type: "boolean", default: false },
											{ displayName: "Behance", name: "behance", type: "boolean", default: false },
											{ displayName: "Buy Me a Coffee", name: "buymeacoffee", type: "boolean", default: false },
											{ displayName: "Cameo", name: "cameo", type: "boolean", default: false },
											{ displayName: "Canva", name: "canva", type: "boolean", default: false },
											{ displayName: "Clubhouse", name: "clubhouse", type: "boolean", default: false },
											{ displayName: "Community", name: "community", type: "boolean", default: false },
											{ displayName: "Discord", name: "discord", type: "boolean", default: false },
											{ displayName: "Dribbble", name: "dribbble", type: "boolean", default: false },
											{ displayName: "Etsy", name: "etsy", type: "boolean", default: false },
											{ displayName: "Facebook", name: "facebook", type: "boolean", default: false },
											{ displayName: "Fiverr", name: "fiverr", type: "boolean", default: false },
											{ displayName: "GitHub", name: "github", type: "boolean", default: false },
											{ displayName: "GoFundMe", name: "gofundme", type: "boolean", default: false },
											{ displayName: "Goodreads", name: "goodreads", type: "boolean", default: false },
											{ displayName: "Instagram", name: "instagram", type: "boolean", default: false },
											{ displayName: "Kakao", name: "kakao", type: "boolean", default: false },
											{ displayName: "Kickstarter", name: "kickstarter", type: "boolean", default: false },
											{ displayName: "Ko-fi", name: "kofi", type: "boolean", default: false },
											{ displayName: "LinkedIn", name: "linkedin", type: "boolean", default: false },
											{ displayName: "Linktree", name: "linktree", type: "boolean", default: false },
											{ displayName: "Medium", name: "medium", type: "boolean", default: false },
											{ displayName: "OnlyFans", name: "onlyfans", type: "boolean", default: false },
											{ displayName: "Patreon", name: "patreon", type: "boolean", default: false },
											{ displayName: "Phone", name: "phone", type: "boolean", default: false },
											{ displayName: "Pinterest", name: "pinterest", type: "boolean", default: false },
											{ displayName: "Podcast", name: "podcast", type: "boolean", default: false },
											{ displayName: "Redbubble", name: "redbubble", type: "boolean", default: false },
											{ displayName: "Shopify", name: "shopify", type: "boolean", default: false },
											{ displayName: "ShopLTK", name: "shopltk", type: "boolean", default: false },
											{ displayName: "Snapchat", name: "snapchat", type: "boolean", default: false },
											{ displayName: "SoundCloud", name: "soundcloud", type: "boolean", default: false },
											{ displayName: "Spotify", name: "spotify", type: "boolean", default: false },
											{ displayName: "Spring", name: "spring", type: "boolean", default: false },
											{ displayName: "Streamlabs", name: "streamlabs", type: "boolean", default: false },
											{ displayName: "Substack", name: "substack", type: "boolean", default: false },
											{ displayName: "Telegram", name: "telegram", type: "boolean", default: false },
											{ displayName: "TikTok", name: "tiktok", type: "boolean", default: false },
											{ displayName: "Tumblr", name: "tumblr", type: "boolean", default: false },
											{ displayName: "Twitch", name: "twitch", type: "boolean", default: false },
											{ displayName: "Twitter", name: "twitter", type: "boolean", default: false },
											{ displayName: "Udemy", name: "udemy", type: "boolean", default: false },
											{ displayName: "Viber", name: "viber", type: "boolean", default: false },
											{ displayName: "Vimeo", name: "vimeo", type: "boolean", default: false },
											{ displayName: "VK", name: "vk", type: "boolean", default: false },
											{ displayName: "Weebly", name: "weebly", type: "boolean", default: false },
											{ displayName: "WhatsApp", name: "whatsApp", type: "boolean", default: false },
											{ displayName: "Wix", name: "wix", type: "boolean", default: false },
											{ displayName: "YouTube", name: "youtube", type: "boolean", default: false },
										],
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: "Instagram Filters",
				name: "instagramFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add Instagram Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["instagram"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "Instagram Filters",
						values: [
							// Top row: Followers, Last Post, Engagement Rate
							{
								displayName: "Min Followers",
								name: "min_followers",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Followers",
								name: "max_followers",
								type: "number",
								default: 0,
							},
							{
								displayName: "Last Post",
								name: "last_post",
								type: "string",
								default: "",
							},
							{
								displayName: "Engagement Rate Min (%)",
								name: "engagement_percent_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Engagement Rate Max (%)",
								name: "engagement_percent_max",
								type: "number",
								default: 0,
							},
							// CREATOR Row 1: Link in bio contains, Keywords in bio, Estimated Income, Exclude Private Profiles
							{
								displayName: "Link in Bio Contains",
								name: "link_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Keywords in Bio",
								name: "keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Min Income",
								name: "min_income",
								type: "number",
								default: 0,
								description: "Estimated Income (min)",
							},
							{
								displayName: "Max Income",
								name: "max_income",
								type: "number",
								default: 0,
								description: "Estimated Income (max)",
							},
							{
								displayName: "Exclude Private Profiles",
								name: "exclude_private_profile",
								type: "boolean",
								default: false,
							},
							// CREATOR Row 2: Verified Profile, Follower Growth, Posting Frequency, Number of posts
							{
								displayName: "Verified Profile",
								name: "is_verified",
								type: "boolean",
								default: false,
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
							{
								displayName: "Posting Frequency",
								name: "posting_frequency",
								type: "number",
								default: 0,
								description: "Average posts per week",
							},
							{
								displayName: "Min Number of Posts",
								name: "min_number_of_posts",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Posts",
								name: "max_number_of_posts",
								type: "number",
								default: 0,
							},
							{
								displayName: "Exclude Keywords in Bio",
								name: "exclude_keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude",
							},
							// CONTENT Row 1: Hashtags, Keywords in captions, Has Reels (Has Videos Previously), Reels %
							{
								displayName: "Hashtags",
								name: "hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags",
							},
							{
								displayName: "Keywords in Captions",
								name: "keywords_in_captions",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Has Reels (Has Videos Previously)",
								name: "has_videos",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Reels Percent",
								name: "min_reels_percent",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Reels Percent",
								name: "max_reels_percent",
								type: "number",
								default: 0,
							},
							// CONTENT Row 2: Avg. Views for Reels (last 30 reels), Average Likes (last 30 posts), Average Comments (last 30 posts), Tagged Profiles
							{
								displayName: "Min Average Views for Reels",
								name: "min_average_views_for_reels",
								type: "number",
								default: 0,
								description: "Avg. views for reels (last 30 reels)",
							},
							{
								displayName: "Max Average Views for Reels",
								name: "max_average_views_for_reels",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Likes",
								name: "min_average_likes",
								type: "number",
								default: 0,
								description: "Average likes (last 30 posts)",
							},
							{
								displayName: "Max Average Likes",
								name: "max_average_likes",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Comments",
								name: "min_average_comments",
								type: "number",
								default: 0,
								description: "Average comments (last 30 posts)",
							},
							{
								displayName: "Max Average Comments",
								name: "max_average_comments",
								type: "number",
								default: 0,
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or handles",
							},
							// Additional filters (not in screenshot)
							{
								displayName: "Exclude Hashtags",
								name: "not_hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags to exclude",
							},
							{
								displayName: "Has Merch",
								name: "has_merch",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Video Percentage",
								name: "min_video_percentage",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Video Percentage",
								name: "max_video_percentage",
								type: "number",
								default: 0,
							},
						],
					},
				],
			},
			{
				displayName: "YouTube Filters",
				name: "youtubeFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add YouTube Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["youtube"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "YouTube Filters",
						values: [
							// Top: Subscribers
							{
								displayName: "Min Subscribers",
								name: "min_subscribers",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Subscribers",
								name: "max_subscribers",
								type: "number",
								default: 0,
							},
							// CREATOR Row 1: Link in Channel Description, Keywords in Channel Description, Estimated Income, Verified Profile
							{
								displayName: "Link in Channel Description",
								name: "links_from_description",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Keywords in Channel Description",
								name: "keywords_in_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Min Income",
								name: "income_min",
								type: "number",
								default: 0,
								description: "Estimated Income (min)",
							},
							{
								displayName: "Max Income",
								name: "income_max",
								type: "number",
								default: 0,
								description: "Estimated Income (max)",
							},
							{
								displayName: "Verified Profile",
								name: "is_verified",
								type: "boolean",
								default: false,
							},
							// CREATOR Row 2: Subscriber Growth, Posting Frequency, Is Monetizing, Youtube Membership
							{
								displayName: "Subscriber Growth Percentage",
								name: "subscriber_growth_percentage",
								type: "number",
								default: 0,
							},
							{
								displayName: "Subscriber Growth Time Range (Months)",
								name: "subscriber_growth_time_range_months",
								type: "number",
								default: 3,
							},
							{
								displayName: "Posting Frequency",
								name: "posting_frequency",
								type: "number",
								default: 0,
								description: "Average posts per week",
							},
							{
								displayName: "Is Monetizing",
								name: "is_monetizing",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Youtube Membership",
								name: "has_membership",
								type: "boolean",
								default: false,
							},
							// CREATOR Row 3: Has Youtube Store, Has Community Posts, Streams Live, Number of Videos
							{
								displayName: "Has Youtube Store",
								name: "has_merch",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Has Community Posts",
								name: "has_community_posts",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Streams Live",
								name: "streams_live",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Number of Videos",
								name: "min_number_of_videos",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Videos",
								name: "max_number_of_videos",
								type: "number",
								default: 0,
							},
							// CREATOR Row 4: Has YouTube Podcast, Has YouTube Courses
							{
								displayName: "Has YouTube Podcast",
								name: "has_podcast",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Has YouTube Courses",
								name: "has_courses",
								type: "boolean",
								default: false,
							},
							// CONTENT Row 1: Topics, Keywords in Video Description, Keywords in Video Titles, Hashtags
							{
								displayName: "Topics",
								name: "topics",
								type: "string",
								default: "",
								description: "Comma-separated topics",
							},
							{
								displayName: "Keywords in Video Description",
								name: "keywords_in_video_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Keywords in Video Titles",
								name: "keywords_in_video_titles",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Hashtags",
								name: "hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags",
							},
							// CONTENT Row 2: Link in Video Description, Has Shorts, Shorts %, Avg. Views on Long Videos
							{
								displayName: "Link in Video Description",
								name: "links_from_video_description",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Has Shorts",
								name: "has_shorts",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Shorts Percentage",
								name: "min_shorts_percentage",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Shorts Percentage",
								name: "max_shorts_percentage",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Views on Long Videos",
								name: "min_average_views_on_long_videos",
								type: "number",
								default: 0,
								description: "Avg. views on long videos",
							},
							{
								displayName: "Max Average Views on Long Videos",
								name: "max_average_views_on_long_videos",
								type: "number",
								default: 0,
							},
							// CONTENT Row 3: Long Video Duration, Avg. Views Shorts (last 10 shorts), Tagged Profiles
							{
								displayName: "Min Long Video Duration",
								name: "long_video_duration_min",
								type: "number",
								default: 0,
								description: "Long video duration (min), in minutes",
							},
							{
								displayName: "Max Long Video Duration",
								name: "long_video_duration_max",
								type: "number",
								default: 0,
								description: "Long video duration (max), in minutes",
							},
							{
								displayName: "Min Average Views on Shorts",
								name: "min_average_views_on_shorts",
								type: "number",
								default: 0,
								description: "Avg. views shorts (last 10 shorts)",
							},
							{
								displayName: "Max Average Views on Shorts",
								name: "max_average_views_on_shorts",
								type: "number",
								default: 0,
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or channel IDs",
							},
							// CONTENT Row 4: Last upload / stream (API: last_upload_long_video, last_upload_short_video, last_stream_upload)
							{
								displayName: "Last Upload Long Video",
								name: "last_upload_long_video",
								type: "string",
								default: "",
								description: "any, 90, or 365 days",
							},
							{
								displayName: "Last Upload Short Video",
								name: "last_upload_short_video",
								type: "string",
								default: "",
								description: "any, 90, or 365 days",
							},
							{
								displayName: "Last Stream Upload",
								name: "last_stream_upload",
								type: "string",
								default: "",
								description: "any, 90, 180, or 365 days",
							},
							{
								displayName: "Min Average Stream Views",
								name: "average_stream_views_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Stream Views",
								name: "average_stream_views_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Stream Duration (seconds)",
								name: "average_stream_duration_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Stream Duration (seconds)",
								name: "average_stream_duration_max",
								type: "number",
								default: 0,
							},
							// Additional (execute supports these; not in screenshot)
							{
								displayName: "Keywords Not in Description",
								name: "keywords_not_in_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude",
							},
							{
								displayName: "Keywords Not in Video Description",
								name: "keywords_not_in_video_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude",
							},
							{
								displayName: "Exclude Hashtags",
								name: "not_hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags to exclude",
							},
							{
								displayName: "Engagement Rate Min (%)",
								name: "engagement_percent_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Engagement Rate Max (%)",
								name: "engagement_percent_max",
								type: "number",
								default: 0,
							},
						],
					},
				],
			},
			{
				displayName: "TikTok Filters",
				name: "tiktokFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add TikTok Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["tiktok"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "TikTok Filters",
						values: [
							// CREATOR: Link in bio contains, Keywords in bio, Exclude Private Profiles, Verified Profile
							{
								displayName: "Link in Bio Contains",
								name: "link_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Keywords in Bio",
								name: "keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Exclude Keywords in Bio",
								name: "exclude_keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude",
							},
							{
								displayName: "Exclude Private Profiles",
								name: "exclude_private_profile",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Verified Profile",
								name: "is_verified",
								type: "boolean",
								default: false,
							},
							// CREATOR: Follower Growth, Posting Frequency, Has TikTok Shop, Number of Posts (videos)
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
							{
								displayName: "Posting Frequency",
								name: "posting_frequency",
								type: "number",
								default: 0,
								description: "Average posts per week",
							},
							{
								displayName: "Has TikTok Shop",
								name: "has_tik_tok_shop",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Number of Videos",
								name: "video_count_min",
								type: "number",
								default: 0,
								description: "Number of videos (min)",
							},
							{
								displayName: "Max Number of Videos",
								name: "video_count_max",
								type: "number",
								default: 0,
								description: "Number of videos (max)",
							},
							{
								displayName: "Min Number of Followers",
								name: "number_of_followers_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Followers",
								name: "number_of_followers_max",
								type: "number",
								default: 0,
							},
							// CONTENT: Hashtags, Video Description, Average Views, Average Likes, Average Comments, Average Downloads, Tagged Profiles
							{
								displayName: "Hashtags",
								name: "hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags",
							},
							{
								displayName: "Exclude Hashtags",
								name: "not_hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags to exclude",
							},
							{
								displayName: "Video Description",
								name: "video_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords in video description",
							},
							{
								displayName: "Exclude Video Description",
								name: "not_video_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude from video description",
							},
							{
								displayName: "Min Average Views (last 30 videos)",
								name: "average_views_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Views (last 30 videos)",
								name: "average_views_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Likes (last 30 videos)",
								name: "average_likes_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Likes (last 30 videos)",
								name: "average_likes_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Comments (last 30 videos)",
								name: "average_comments_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Comments (last 30 videos)",
								name: "average_comments_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Downloads",
								name: "average_video_downloads_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Downloads",
								name: "average_video_downloads_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or handles",
							},
							// Additional (execute supports these)
							{
								displayName: "Last Post",
								name: "last_post",
								type: "string",
								default: "",
							},
							{
								displayName: "Engagement Rate Min (%)",
								name: "engagement_percent_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Engagement Rate Max (%)",
								name: "engagement_percent_max",
								type: "number",
								default: 0,
							},
						],
					},
				],
			},
			{
				displayName: "Twitter Filters",
				name: "twitterFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add Twitter Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["twitter"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "Twitter Filters",
						values: [
							// CONTENT Row 1: Engagement Rate, Keywords in bio, Link in bio contains, Keywords in Tweets
							{
								displayName: "Engagement Rate Min (%)",
								name: "engagement_percent_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Engagement Rate Max (%)",
								name: "engagement_percent_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Keywords in Bio",
								name: "keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Exclude Keywords in Bio",
								name: "exclude_keywords_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated keywords to exclude",
							},
							{
								displayName: "Link in Bio Contains",
								name: "link_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Keywords in Tweets",
								name: "keywords_in_tweets",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							// CONTENT Row 2: Hashtags, Number of Tweets, Average Likes (last 30 posts), Tagged Profiles
							{
								displayName: "Hashtags",
								name: "hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags",
							},
							{
								displayName: "Exclude Hashtags",
								name: "not_hashtags",
								type: "string",
								default: "",
								description: "Comma-separated hashtags to exclude",
							},
							{
								displayName: "Min Number of Tweets",
								name: "min_number_of_tweets",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Tweets",
								name: "max_number_of_tweets",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Likes (last 30 posts)",
								name: "average_likes_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Likes (last 30 posts)",
								name: "average_likes_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or handles",
							},
							// Additional (execute supports these)
							{
								displayName: "Min Number of Followers",
								name: "number_of_followers_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Followers",
								name: "number_of_followers_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Last Post",
								name: "last_post",
								type: "string",
								default: "",
							},
						],
					},
				],
			},
			{
				displayName: "OnlyFans Filters",
				name: "onlyfansFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add OnlyFans Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["onlyfans"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "OnlyFans Filters",
						values: [
							// CREATOR: Is verified, Has Free Account, Has Live Streams
							{
								displayName: "Is Verified",
								name: "is_verified",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Has Free Account",
								name: "has_free_account",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Has Live Streams",
								name: "has_live_streams",
								type: "boolean",
								default: false,
							},
							// CONTENT: Has Videos, Number of Likes, Number of Posts, Subscription price, Tagged Profiles
							{
								displayName: "Has Videos",
								name: "has_videos",
								type: "boolean",
								default: false,
							},
							{
								displayName: "Min Number of Likes",
								name: "number_of_likes_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Number of Likes",
								name: "number_of_likes_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Number of Posts",
								name: "number_of_photos_min",
								type: "number",
								default: 0,
								description: "Number of posts/photos (min)",
							},
							{
								displayName: "Max Number of Posts",
								name: "number_of_photos_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Subscription Price",
								name: "subscription_price_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Subscription Price",
								name: "subscription_price_max",
								type: "number",
								default: 0,
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or handles",
							},
							// Additional (execute supports these)
							{
								displayName: "Last Active",
								name: "last_active",
								type: "string",
								default: "",
								description: "any, 90, or 365 days",
							},
						],
					},
				],
			},
			{
				displayName: "Twitch Filters",
				name: "twitchFilters",
				type: "fixedCollection",
				typeOptions: {
					multipleValues: true,
				},
				placeholder: "Add Twitch Filters",
				default: {},
				displayOptions: {
					show: {
						platform: ["twitch"],
						operation: ["discovery", "findLookalikes"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "Twitch Filters",
						values: [
							// CREATOR: Is a Twitch Partner
							{
								displayName: "Is a Twitch Partner",
								name: "is_twitch_partner",
								type: "boolean",
								default: false,
							},
							// CONTENT Row 1: Keywords in description, Link in bio contains, Streamed hours (last 30 days), Total Streams (last 30 days)
							{
								displayName: "Keywords in Description",
								name: "keywords_in_description",
								type: "string",
								default: "",
								description: "Comma-separated keywords",
							},
							{
								displayName: "Link in Bio Contains",
								name: "link_in_bio",
								type: "string",
								default: "",
								description: "Comma-separated links or keywords",
							},
							{
								displayName: "Min Streamed Hours (Last 30 Days)",
								name: "min_streamed_hours_last_30_days",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Streamed Hours (Last 30 Days)",
								name: "max_streamed_hours_last_30_days",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Total Streams (Last 30 Days)",
								name: "min_streams_count_last_30_days",
								type: "number",
								default: 0,
								description: "Total streams count (last 30 days)",
							},
							{
								displayName: "Max Total Streams (Last 30 Days)",
								name: "max_streams_count_last_30_days",
								type: "number",
								default: 0,
							},
							// CONTENT Row 2: Maximum View Count, Average Views (Last 30 days), Games Played, Tagged Profiles
							{
								displayName: "Min Maximum View Count",
								name: "min_maximum_views_count",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Maximum View Count",
								name: "max_maximum_views_count",
								type: "number",
								default: 0,
							},
							{
								displayName: "Min Average Views (Last 30 Days)",
								name: "min_avg_views_last_30_days",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Average Views (Last 30 Days)",
								name: "max_avg_views_last_30_days",
								type: "number",
								default: 0,
							},
							{
								displayName: "Games Played",
								name: "games_played",
								type: "string",
								default: "",
								description: "Comma-separated game names",
							},
							{
								displayName: "Tagged Profiles",
								name: "similar_to",
								type: "string",
								default: "",
								description: "Comma-separated usernames or handles",
							},
							// Additional (execute supports these)
							{
								displayName: "Last Stream",
								name: "most_recent_stream_date",
								type: "string",
								default: "",
								description: "e.g. time range or date",
							},
							{
								displayName: "Min Followers",
								name: "followers_min",
								type: "number",
								default: 0,
							},
							{
								displayName: "Max Followers",
								name: "followers_max",
								type: "number",
								default: 0,
							},
						],
					},
				],
			},
			// Find Lookalikes parameters (moved earlier for order)
		],
	};


	private static buildApiFilters(ctx: IExecuteFunctions, platform: string, itemIndex: number): IDataObject {
		const getParam = (path: string, fallback: unknown = {}) => {
			const raw = ctx.getNodeParameter(path, itemIndex, fallback) as IDataObject | IDataObject[];
			return (Array.isArray(raw) && raw.length ? raw[0] : raw) as IDataObject;
		};
		const commaToArray = (v: unknown) => typeof v === "string" ? String(v).split(",").map((k: string) => k.trim()).filter(Boolean) : undefined;

		const sharedFilters = getParam("advancedFilters.filters");
		const instagramFilters = getParam("instagramFilters.values");
		const youtubeFilters = getParam("youtubeFilters.values");
		const tiktokFilters = getParam("tiktokFilters.values");
		const twitterFilters = getParam("twitterFilters.values");
		const onlyfansFilters = getParam("onlyfansFilters.values");
		const twitchFilters = getParam("twitchFilters.values");

		const apiFilters: IDataObject = {};

		// Shared filters
		if (sharedFilters.location && sharedFilters.location !== "") apiFilters.location = commaToArray(sharedFilters.location);
		if (sharedFilters.type && sharedFilters.type !== "" && ["instagram","youtube","tiktok"].includes(platform)) apiFilters.type = sharedFilters.type;
		if (sharedFilters.gender && sharedFilters.gender !== "" && sharedFilters.type !== "business") apiFilters.gender = sharedFilters.gender;
		if (sharedFilters.profile_language && sharedFilters.profile_language !== "") apiFilters.profile_language = commaToArray(sharedFilters.profile_language);
		if (sharedFilters.promotes_affiliate_links !== undefined) apiFilters.promotes_affiliate_links = sharedFilters.promotes_affiliate_links;
		if (sharedFilters.has_done_brand_deals !== undefined) apiFilters.has_done_brand_deals = sharedFilters.has_done_brand_deals;
		if (sharedFilters.has_link_in_bio !== undefined) apiFilters.has_link_in_bio = sharedFilters.has_link_in_bio;
		if (sharedFilters.does_live_streaming !== undefined) apiFilters.does_live_streaming = sharedFilters.does_live_streaming;
		if (sharedFilters.has_merch !== undefined) apiFilters.has_merch = sharedFilters.has_merch;
		if (sharedFilters.brands && typeof sharedFilters.brands === "string") apiFilters.brands = commaToArray(sharedFilters.brands);
		if (sharedFilters.exclude_role_based_emails !== undefined) apiFilters.exclude_role_based_emails = sharedFilters.exclude_role_based_emails;
		if (sharedFilters.exclude_previous !== undefined) apiFilters.exclude_previous = sharedFilters.exclude_previous;
		const creatorHas = ctx.getNodeParameter("advancedFilters.filters.creator_has.platforms", itemIndex, []) as IDataObject[];
		if (creatorHas && Array.isArray(creatorHas) && creatorHas.length) {
			apiFilters.creator_has = {} as IDataObject;
			for (const entry of creatorHas) {
				for (const [key, value] of Object.entries(entry)) {
					(apiFilters.creator_has as IDataObject)[`has_${key}`] = value;
				}
			}
		}

		// Platform-specific filters
		if (platform === "instagram") {
			if (instagramFilters.min_followers || instagramFilters.max_followers) apiFilters.number_of_followers = { min: instagramFilters.min_followers || null, max: instagramFilters.max_followers || null };
			if (instagramFilters.posting_frequency) apiFilters.posting_frequency = instagramFilters.posting_frequency;
			if (instagramFilters.follower_growth_percentage || instagramFilters.follower_growth_time_range_months) apiFilters.follower_growth = { growth_percentage: instagramFilters.follower_growth_percentage || null, time_range_months: instagramFilters.follower_growth_time_range_months || 3 };
			if (instagramFilters.min_number_of_posts || instagramFilters.max_number_of_posts) apiFilters.number_of_posts = { min: instagramFilters.min_number_of_posts || null, max: instagramFilters.max_number_of_posts || null };
			if (instagramFilters.min_average_likes || instagramFilters.max_average_likes) apiFilters.average_likes = { min: instagramFilters.min_average_likes || null, max: instagramFilters.max_average_likes || null };
			if (instagramFilters.min_average_comments || instagramFilters.max_average_comments) apiFilters.average_comments = { min: instagramFilters.min_average_comments || null, max: instagramFilters.max_average_comments || null };
			if (instagramFilters.min_reels_percent || instagramFilters.max_reels_percent) apiFilters.reels_percent = { min: instagramFilters.min_reels_percent || null, max: instagramFilters.max_reels_percent || null };
			if (instagramFilters.min_average_views_for_reels || instagramFilters.max_average_views_for_reels) apiFilters.average_views_for_reels = { min: instagramFilters.min_average_views_for_reels || null, max: instagramFilters.max_average_views_for_reels || null };
			if (instagramFilters.min_income || instagramFilters.max_income) apiFilters.income = { min: instagramFilters.min_income || null, max: instagramFilters.max_income || null };
			if (instagramFilters.min_video_percentage || instagramFilters.max_video_percentage) apiFilters.video_percentage = { min: instagramFilters.min_video_percentage || null, max: instagramFilters.max_video_percentage || null };
			if (instagramFilters.exclude_private_profile !== undefined) apiFilters.exclude_private_profile = instagramFilters.exclude_private_profile;
			if (instagramFilters.is_verified !== undefined) apiFilters.is_verified = instagramFilters.is_verified;
			if (instagramFilters.has_videos !== undefined) apiFilters.has_videos = instagramFilters.has_videos;
			if (instagramFilters.last_post) apiFilters.last_post = instagramFilters.last_post;
			if (commaToArray(instagramFilters.keywords_in_bio)) apiFilters.keywords_in_bio = commaToArray(instagramFilters.keywords_in_bio);
			if (commaToArray(instagramFilters.exclude_keywords_in_bio)) apiFilters.exclude_keywords_in_bio = commaToArray(instagramFilters.exclude_keywords_in_bio);
			if (commaToArray(instagramFilters.similar_to)) apiFilters.similar_to = commaToArray(instagramFilters.similar_to);
			if (commaToArray(instagramFilters.link_in_bio)) apiFilters.link_in_bio = commaToArray(instagramFilters.link_in_bio);
			if (commaToArray(instagramFilters.hashtags)) apiFilters.hashtags = commaToArray(instagramFilters.hashtags);
			if (commaToArray(instagramFilters.not_hashtags)) apiFilters.not_hashtags = commaToArray(instagramFilters.not_hashtags);
			if (commaToArray(instagramFilters.keywords_in_captions)) apiFilters.keywords_in_captions = commaToArray(instagramFilters.keywords_in_captions);
			if (instagramFilters.engagement_percent_min || instagramFilters.engagement_percent_max) apiFilters.engagement_percent = { min: instagramFilters.engagement_percent_min || null, max: instagramFilters.engagement_percent_max || null };
			if (instagramFilters.has_merch !== undefined) apiFilters.has_merch = instagramFilters.has_merch;
		}

		if (platform === "youtube") {
			if (youtubeFilters.min_subscribers || youtubeFilters.max_subscribers) apiFilters.number_of_subscribers = { min: youtubeFilters.min_subscribers || null, max: youtubeFilters.max_subscribers || null };
			if (commaToArray(youtubeFilters.topics)) apiFilters.topics = commaToArray(youtubeFilters.topics);
			if (commaToArray(youtubeFilters.keywords_in_video_titles)) apiFilters.keywords_in_video_titles = commaToArray(youtubeFilters.keywords_in_video_titles);
			if (commaToArray(youtubeFilters.keywords_in_description)) apiFilters.keywords_in_description = commaToArray(youtubeFilters.keywords_in_description);
			if (commaToArray(youtubeFilters.keywords_not_in_description)) apiFilters.keywords_not_in_description = commaToArray(youtubeFilters.keywords_not_in_description);
			if (commaToArray(youtubeFilters.keywords_in_video_description)) apiFilters.keywords_in_video_description = commaToArray(youtubeFilters.keywords_in_video_description);
			if (commaToArray(youtubeFilters.keywords_not_in_video_description)) apiFilters.keywords_not_in_video_description = commaToArray(youtubeFilters.keywords_not_in_video_description);
			if (commaToArray(youtubeFilters.links_from_description)) apiFilters.links_from_description = commaToArray(youtubeFilters.links_from_description);
			if (commaToArray(youtubeFilters.hashtags)) apiFilters.hashtags = commaToArray(youtubeFilters.hashtags);
			if (commaToArray(youtubeFilters.not_hashtags)) apiFilters.not_hashtags = commaToArray(youtubeFilters.not_hashtags);
			if (commaToArray(youtubeFilters.links_from_video_description)) apiFilters.links_from_video_description = commaToArray(youtubeFilters.links_from_video_description);
			if (youtubeFilters.posting_frequency) apiFilters.posting_frequency = youtubeFilters.posting_frequency;
			if (youtubeFilters.subscriber_growth_percentage || youtubeFilters.subscriber_growth_time_range_months) apiFilters.subscriber_growth = { growth_percentage: youtubeFilters.subscriber_growth_percentage || null, time_range_months: youtubeFilters.subscriber_growth_time_range_months || 3 };
			if (youtubeFilters.has_shorts !== undefined) apiFilters.has_shorts = youtubeFilters.has_shorts;
			if (youtubeFilters.min_shorts_percentage || youtubeFilters.max_shorts_percentage) apiFilters.shorts_percentage = { min: youtubeFilters.min_shorts_percentage || null, max: youtubeFilters.max_shorts_percentage || null };
			if (youtubeFilters.engagement_percent_min || youtubeFilters.engagement_percent_max) apiFilters.engagement_percent = { min: youtubeFilters.engagement_percent_min || null, max: youtubeFilters.engagement_percent_max || null };
			if (youtubeFilters.has_community_posts !== undefined) apiFilters.has_community_posts = youtubeFilters.has_community_posts;
			if (youtubeFilters.streams_live !== undefined) apiFilters.streams_live = youtubeFilters.streams_live;
			if (youtubeFilters.has_merch !== undefined) apiFilters.has_merch = youtubeFilters.has_merch;
			if (youtubeFilters.has_podcast !== undefined) apiFilters.has_podcast = youtubeFilters.has_podcast;
			if (youtubeFilters.has_courses !== undefined) apiFilters.has_courses = youtubeFilters.has_courses;
			if (youtubeFilters.has_membership !== undefined) apiFilters.has_membership = youtubeFilters.has_membership;
			if (youtubeFilters.min_average_views_on_long_videos || youtubeFilters.max_average_views_on_long_videos) apiFilters.average_views_on_long_videos = { min: youtubeFilters.min_average_views_on_long_videos || null, max: youtubeFilters.max_average_views_on_long_videos || null };
			if (youtubeFilters.long_video_duration_min != null || youtubeFilters.long_video_duration_max != null) apiFilters.long_video_duration = { min: youtubeFilters.long_video_duration_min ?? null, max: youtubeFilters.long_video_duration_max ?? null };
			if (youtubeFilters.min_average_views_on_shorts || youtubeFilters.max_average_views_on_shorts) apiFilters.average_views_on_shorts = { min: youtubeFilters.min_average_views_on_shorts || null, max: youtubeFilters.max_average_views_on_shorts || null };
			if (youtubeFilters.min_number_of_videos || youtubeFilters.max_number_of_videos) apiFilters.number_of_videos = { min: youtubeFilters.min_number_of_videos || null, max: youtubeFilters.max_number_of_videos || null };
			if (youtubeFilters.is_monetizing !== undefined) apiFilters.is_monetizing = youtubeFilters.is_monetizing;
			if (commaToArray(youtubeFilters.similar_to)) apiFilters.similar_to = commaToArray(youtubeFilters.similar_to);
			if (youtubeFilters.income_min || youtubeFilters.income_max) apiFilters.income = { min: youtubeFilters.income_min || null, max: youtubeFilters.income_max || null };
			if (youtubeFilters.last_upload_long_video) apiFilters.last_upload_long_video = youtubeFilters.last_upload_long_video;
			if (youtubeFilters.last_upload_short_video) apiFilters.last_upload_short_video = youtubeFilters.last_upload_short_video;
			if (youtubeFilters.last_stream_upload) apiFilters.last_stream_upload = youtubeFilters.last_stream_upload;
			if (youtubeFilters.average_stream_views_min || youtubeFilters.average_stream_views_max) apiFilters.average_stream_views = { min: youtubeFilters.average_stream_views_min || null, max: youtubeFilters.average_stream_views_max || null };
			if (youtubeFilters.average_stream_duration_min != null || youtubeFilters.average_stream_duration_max != null) apiFilters.average_stream_duration = { min: youtubeFilters.average_stream_duration_min ?? null, max: youtubeFilters.average_stream_duration_max ?? null };
			if (youtubeFilters.is_verified !== undefined) apiFilters.is_verified = youtubeFilters.is_verified;
		}

		if (platform === "tiktok") {
			if (tiktokFilters.number_of_followers_min || tiktokFilters.number_of_followers_max) apiFilters.number_of_followers = { min: tiktokFilters.number_of_followers_min || null, max: tiktokFilters.number_of_followers_max || null };
			if (tiktokFilters.posting_frequency) apiFilters.posting_frequency = tiktokFilters.posting_frequency;
			if (tiktokFilters.follower_growth_percentage || tiktokFilters.follower_growth_time_range_months) apiFilters.follower_growth = { growth_percentage: tiktokFilters.follower_growth_percentage || null, time_range_months: tiktokFilters.follower_growth_time_range_months || 3 };
			if (tiktokFilters.average_likes_min || tiktokFilters.average_likes_max) apiFilters.average_likes = { min: tiktokFilters.average_likes_min || null, max: tiktokFilters.average_likes_max || null };
			if (tiktokFilters.average_comments_min || tiktokFilters.average_comments_max) apiFilters.average_comments = { min: tiktokFilters.average_comments_min || null, max: tiktokFilters.average_comments_max || null };
			if (tiktokFilters.engagement_percent_min || tiktokFilters.engagement_percent_max) apiFilters.engagement_percent = { min: tiktokFilters.engagement_percent_min || null, max: tiktokFilters.engagement_percent_max || null };
			if (tiktokFilters.average_views_min || tiktokFilters.average_views_max) apiFilters.average_views = { min: tiktokFilters.average_views_min || null, max: tiktokFilters.average_views_max || null };
			if (tiktokFilters.average_video_downloads_min || tiktokFilters.average_video_downloads_max) apiFilters.average_video_downloads = { min: tiktokFilters.average_video_downloads_min || null, max: tiktokFilters.average_video_downloads_max || null };
			if (tiktokFilters.video_count_min || tiktokFilters.video_count_max) apiFilters.video_count = { min: tiktokFilters.video_count_min || null, max: tiktokFilters.video_count_max || null };
			if (tiktokFilters.has_tik_tok_shop !== undefined) apiFilters.has_tik_tok_shop = tiktokFilters.has_tik_tok_shop;
			if (tiktokFilters.exclude_private_profile !== undefined) apiFilters.exclude_private_profile = tiktokFilters.exclude_private_profile;
			if (tiktokFilters.is_verified !== undefined) apiFilters.is_verified = tiktokFilters.is_verified;
			if (commaToArray(tiktokFilters.similar_to)) apiFilters.similar_to = commaToArray(tiktokFilters.similar_to);
			if (tiktokFilters.last_post) apiFilters.last_post = tiktokFilters.last_post;
			if (commaToArray(tiktokFilters.keywords_in_bio)) apiFilters.keywords_in_bio = commaToArray(tiktokFilters.keywords_in_bio);
			if (commaToArray(tiktokFilters.exclude_keywords_in_bio)) apiFilters.exclude_keywords_in_bio = commaToArray(tiktokFilters.exclude_keywords_in_bio);
			if (commaToArray(tiktokFilters.link_in_bio)) apiFilters.link_in_bio = commaToArray(tiktokFilters.link_in_bio);
			if (commaToArray(tiktokFilters.hashtags)) apiFilters.hashtags = commaToArray(tiktokFilters.hashtags);
			if (commaToArray(tiktokFilters.not_hashtags)) apiFilters.not_hashtags = commaToArray(tiktokFilters.not_hashtags);
			if (commaToArray(tiktokFilters.video_description)) apiFilters.video_description = commaToArray(tiktokFilters.video_description);
			if (commaToArray(tiktokFilters.not_video_description)) apiFilters.not_video_description = commaToArray(tiktokFilters.not_video_description);
		}

		if (platform === "twitter") {
			if (twitterFilters.number_of_followers_min || twitterFilters.number_of_followers_max) apiFilters.number_of_followers = { min: twitterFilters.number_of_followers_min || null, max: twitterFilters.number_of_followers_max || null };
			if (twitterFilters.engagement_percent_min || twitterFilters.engagement_percent_max) apiFilters.engagement_percent = { min: twitterFilters.engagement_percent_min || null, max: twitterFilters.engagement_percent_max || null };
			if (twitterFilters.min_number_of_tweets != null || twitterFilters.max_number_of_tweets != null) apiFilters.number_of_tweets = { min: twitterFilters.min_number_of_tweets ?? null, max: twitterFilters.max_number_of_tweets ?? null };
			if (twitterFilters.average_likes_min || twitterFilters.average_likes_max) apiFilters.average_likes = { min: twitterFilters.average_likes_min || null, max: twitterFilters.average_likes_max || null };
			if (twitterFilters.last_post) apiFilters.last_post = twitterFilters.last_post;
			if (commaToArray(twitterFilters.similar_to)) apiFilters.similar_to = commaToArray(twitterFilters.similar_to);
			if (commaToArray(twitterFilters.keywords_in_bio)) apiFilters.keywords_in_bio = commaToArray(twitterFilters.keywords_in_bio);
			if (commaToArray(twitterFilters.exclude_keywords_in_bio)) apiFilters.exclude_keywords_in_bio = commaToArray(twitterFilters.exclude_keywords_in_bio);
			if (commaToArray(twitterFilters.link_in_bio)) apiFilters.link_in_bio = commaToArray(twitterFilters.link_in_bio);
			if (commaToArray(twitterFilters.hashtags)) apiFilters.hashtags = commaToArray(twitterFilters.hashtags);
			if (commaToArray(twitterFilters.not_hashtags)) apiFilters.not_hashtags = commaToArray(twitterFilters.not_hashtags);
			if (commaToArray(twitterFilters.keywords_in_tweets)) apiFilters.keywords_in_tweets = commaToArray(twitterFilters.keywords_in_tweets);
		}

		if (platform === "onlyfans") {
			if (onlyfansFilters.subscription_price_min || onlyfansFilters.subscription_price_max) apiFilters.subscription_price = { min: onlyfansFilters.subscription_price_min || null, max: onlyfansFilters.subscription_price_max || null };
			if (onlyfansFilters.number_of_photos_min || onlyfansFilters.number_of_photos_max) apiFilters.number_of_photos = { min: onlyfansFilters.number_of_photos_min || null, max: onlyfansFilters.number_of_photos_max || null };
			if (onlyfansFilters.number_of_likes_min || onlyfansFilters.number_of_likes_max) apiFilters.number_of_likes = { min: onlyfansFilters.number_of_likes_min || null, max: onlyfansFilters.number_of_likes_max || null };
			if (onlyfansFilters.last_active) apiFilters.last_active = onlyfansFilters.last_active;
			if (commaToArray(onlyfansFilters.similar_to)) apiFilters.similar_to = commaToArray(onlyfansFilters.similar_to);
			if (onlyfansFilters.has_videos !== undefined) apiFilters.has_videos = onlyfansFilters.has_videos;
			if (onlyfansFilters.has_free_account !== undefined) apiFilters.has_free_account = onlyfansFilters.has_free_account;
			if (onlyfansFilters.has_live_streams !== undefined) apiFilters.has_live_streams = onlyfansFilters.has_live_streams;
			if (onlyfansFilters.is_verified !== undefined) apiFilters.is_verified = onlyfansFilters.is_verified;
		}

		if (platform === "twitch") {
			if (twitchFilters.followers_min || twitchFilters.followers_max) apiFilters.followers = { min: twitchFilters.followers_min || null, max: twitchFilters.followers_max || null };
			if (twitchFilters.min_streamed_hours_last_30_days || twitchFilters.max_streamed_hours_last_30_days) apiFilters.streamed_hours_last_30_days = { min: twitchFilters.min_streamed_hours_last_30_days || null, max: twitchFilters.max_streamed_hours_last_30_days || null };
			if (twitchFilters.min_maximum_views_count || twitchFilters.max_maximum_views_count) apiFilters.maximum_views_count = { min: twitchFilters.min_maximum_views_count || null, max: twitchFilters.max_maximum_views_count || null };
			if (twitchFilters.min_avg_views_last_30_days || twitchFilters.max_avg_views_last_30_days) apiFilters.avg_views_last_30_days = { min: twitchFilters.min_avg_views_last_30_days || null, max: twitchFilters.max_avg_views_last_30_days || null };
			if (twitchFilters.min_streams_count_last_30_days || twitchFilters.max_streams_count_last_30_days) apiFilters.streams_count_last_30_days = { min: twitchFilters.min_streams_count_last_30_days || null, max: twitchFilters.max_streams_count_last_30_days || null };
			if (commaToArray(twitchFilters.games_played)) apiFilters.games_played = commaToArray(twitchFilters.games_played);
			if (twitchFilters.is_twitch_partner !== undefined) apiFilters.is_twitch_partner = twitchFilters.is_twitch_partner;
			if (twitchFilters.keywords_in_description !== undefined) apiFilters.keywords_in_description = twitchFilters.keywords_in_description;
			if (commaToArray(twitchFilters.similar_to)) apiFilters.similar_to = commaToArray(twitchFilters.similar_to);
			if (twitchFilters.most_recent_stream_date) apiFilters.most_recent_stream_date = twitchFilters.most_recent_stream_date;
			if (commaToArray(twitchFilters.link_in_bio)) apiFilters.link_in_bio = commaToArray(twitchFilters.link_in_bio);
		}

		return apiFilters;
	}

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const outputItems: INodeExecutionData[] = [];

		const nodeParams = this.getNode().parameters as IDataObject;
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter("operation", itemIndex) as string;
				const additionalOptions = (this.getNodeParameter("additionalOptions.options", itemIndex, {}) as IDataObject) || {};

				switch (operation) {
			case "enrichByEmail": {
				const email = this.getNodeParameter("email", itemIndex) as string;

					const body: IDataObject = { email };

				const options: {
					method: IHttpRequestMethods;
					url: string;
					body: IDataObject;
					json: boolean;
				} = {
					method: "POST",
					url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/email/",
					body,
					json: true,
				};
                {
                    const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                    outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
                }
                break;
			}
			case "enrichByHandle": {
				const handle = this.getNodeParameter("handle", itemIndex) as string;
				const platform = this.getNodeParameter("platform", itemIndex) as string;
				// Optional fields from Additional Options (fallback to legacy top-level for backward compat)
				const include_lookalikes = (additionalOptions.include_lookalikes as boolean) ?? (nodeParams.include_lookalikes as boolean) ?? false;
				const email_required = (additionalOptions.email_required as string) ?? (nodeParams.email_required as string) ?? "preferred";
				
				const body: IDataObject = {
					handle,
					platform,
					include_lookalikes,
					email_required,
				};
				
				const options: {
					method: IHttpRequestMethods;
					url: string;
					body: IDataObject;
					json: boolean;
				} = {
					method: "POST",
					url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/handle/full/",
					body,
					json: true,
				};
                {
                    const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                    outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
                }
                break;
			}
			case "enrichByHandleRaw": {
				const handle = this.getNodeParameter("handle", itemIndex) as string;
				const platform = this.getNodeParameter("platform", itemIndex) as string;

				const body: IDataObject = { handle, platform };

				const options: {
					method: IHttpRequestMethods;
					url: string;
					body: IDataObject;
					json: boolean;
				} = {
					method: "POST",
					url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/handle/raw/",
					body,
					json: true,
				};
				{
					const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
					outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				}
				break;
			}
			case "discovery": {
				const ai_search = (additionalOptions.ai_search as string) ?? "";
				// Optional fields from Additional Options (fallback to legacy top-level for backward compat)
				// Platform: top-level (Discovery) first, then Additional Options, then legacy
				const platform = this.getNodeParameter("platform", itemIndex, "instagram") as string;
				const apiFilters = InfluencersClub.buildApiFilters(this, platform, itemIndex);

				// Paging & sort
				const discoveryLimit = this.getNodeParameter("discovery_limit", itemIndex, 5) as number;
				const discoveryPage = this.getNodeParameter("discovery_page", itemIndex, 0) as number;
				const sortBy = this.getNodeParameter("discovery_sort_by", itemIndex, "relevancy") as string;
				const body: IDataObject = {
					platform,
					paging: { limit: discoveryLimit, page: discoveryPage },
					sort: { sort_by: sortBy, sort_order: "desc" },
					filters: {
						ai_search: ai_search || "",
						...apiFilters,
					},
				};
				const options: {
					method: IHttpRequestMethods;
					url: string;
					body: IDataObject;
					json: boolean;
				} = {
					method: "POST",
					url: "https://api-dashboard.influencers.club/public/v1/discovery/",
					body,
					json: true,
				};
				const includeRequest = (additionalOptions.include_request_in_output as boolean) === true;
                {
                    const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                    const outJson = includeRequest ? { ...(resp as IDataObject), _requestBody: body } : (resp as IDataObject);
                    outputItems.push({ json: outJson, pairedItem: { item: itemIndex } });
                }
                break;
			}
			case "findLookalikes": {
				const filter_value = this.getNodeParameter("filter_value", itemIndex) as string;
				const filter_key = this.getNodeParameter("filter_key", itemIndex) as string;
				// Platform: top-level first, then Additional Options, then legacy
				const platform = this.getNodeParameter("platform", itemIndex, "instagram") as string;
				const ai_search = (additionalOptions.ai_search as string) ?? "";
				const apiFilters = InfluencersClub.buildApiFilters(this, platform, itemIndex);

				const lookalikesLimit = (additionalOptions.lookalikes_limit as number) ?? (nodeParams.lookalikes_limit as number) ?? 5;
				const lookalikesPage = (additionalOptions.lookalikes_page as number) ?? (nodeParams.lookalikes_page as number) ?? 0;
				const body: IDataObject = {
					filter_value,
					filter_key,
					platform,
					paging: { limit: lookalikesLimit, page: lookalikesPage },
					filters: { ai_search: ai_search || "", ...apiFilters },
				};
				const includeRequestLookalikes = (additionalOptions.include_request_in_output as boolean) === true;
                const options: { method: IHttpRequestMethods; url: string; body: IDataObject; json: boolean } = {
					method: "POST",
					url: "https://api-dashboard.influencers.club/public/v1/discovery/creators/similar/",
					body,
					json: true,
				};
                {
                    const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
                    const outJson = includeRequestLookalikes ? { ...(resp as IDataObject), _requestBody: body } : (resp as IDataObject);
                    outputItems.push({ json: outJson, pairedItem: { item: itemIndex } });
                }
				break;
			}
			case "createBatch": {
				const emailsStr = this.getNodeParameter("batch_emails", itemIndex) as string;
				const emails = emailsStr
					.split(/[\n,]/)
					.map((e: string) => e.trim())
					.filter(Boolean);
				if (emails.length === 0) {
					throw new NodeOperationError(this.getNode(), "At least one email is required. Add one or more emails in the Emails field (one per line or comma-separated).", { itemIndex });
				}
				const body: IDataObject = { emails };
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/creators/enrich/public/",
					body,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "getBatchStatus": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const options = {
					method: "GET" as IHttpRequestMethods,
					url: `https://api-dashboard.influencers.club/public/v1/creators/enrich/public/${encodeURIComponent(batchId)}/`,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "downloadBatchResults": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const options = {
					method: "GET" as IHttpRequestMethods,
					url: `https://api-dashboard.influencers.club/public/v1/creators/enrich/public/${encodeURIComponent(batchId)}/download/`,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "resumeBatch": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: `https://api-dashboard.influencers.club/public/v1/creators/enrich/public/${encodeURIComponent(batchId)}/resume/`,
					body: {},
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
            default:
                throw new NodeOperationError(this.getNode(), `Operation ${operation} not supported`, { itemIndex });
        }
			} catch (error) {
				if (this.continueOnFail()) {
					outputItems.push({ json: { error: (error as Error).message } as IDataObject, pairedItem: { item: itemIndex } });
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}
		}

		return [outputItems];
	}
} 
