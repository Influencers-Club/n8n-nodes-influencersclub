import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    IHttpRequestMethods,
    IDataObject,
    INodeExecutionData,
    INodePropertyOptions,
    ILoadOptionsFunctions,
    NodeApiError,
    NodeOperationError,
    NodeConnectionTypes,
    JsonObject,
} from "n8n-workflow";
import FormData from "form-data";

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
					{
						name: "Account",
						value: "account",
						description: "Account-level operations such as credit balance",
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
					show: { resource: ["account"] },
				},
				options: [
					{
						name: "Get Credits",
						value: "getCredits",
						description: "Retrieve the available credit balance and cumulative usage. This call does not consume credits.",
						action: "Get Credits",
					},
				],
				default: "getCredits",
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
					{
						name: "Get Connected Socials",
						value: "getSocials",
						description: "Retrieve verified cross-platform accounts linked to a creator",
						action: "Get Connected Socials",
					},
					{
						name: "Get Posts",
						value: "getPosts",
						description: "Retrieve recent posts with engagement metrics (Instagram, TikTok, YouTube)",
						action: "Get Posts",
					},
					{
						name: "Get Post Details",
						value: "getPostDetails",
						description: "Retrieve detailed post data including comments, transcripts, or audio (Instagram, TikTok, YouTube)",
						action: "Get Post Details",
					},
					{
						name: "Audience Overlap",
						value: "audienceOverlap",
						description: "Compare audience reach and duplication between 2-10 creators",
						action: "Audience Overlap",
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
				displayName: "CSV File (Binary Property)",
				name: "batch_binary_property",
				type: "string",
				default: "data",
				required: true,
				description: "Name of the binary property containing the CSV file with emails or handles. Connect a \"Read Binary File\" node before this node.",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["createBatch"],
					},
				},
			},
			{
				displayName: "Enrichment Mode",
				name: "batch_enrichment_mode",
				type: "options",
				options: [
					{ name: "Raw", value: "raw" },
					{ name: "Full", value: "full" },
					{ name: "Basic", value: "basic" },
				],
				default: "raw",
				required: true,
				description: "The enrichment mode to use for this batch",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["createBatch"],
					},
				},
			},
			{
				displayName: "Platform",
				name: "batch_platform",
				type: "options",
				options: [
					{ name: "None", value: "" },
					{ name: "Instagram", value: "instagram" },
					{ name: "YouTube", value: "youtube" },
					{ name: "TikTok", value: "tiktok" },
					{ name: "Twitter", value: "twitter" },
					{ name: "Twitch", value: "twitch" },
					{ name: "OnlyFans", value: "onlyfans" },
				],
				default: "",
				description: "Target platform for enrichment (optional)",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["createBatch"],
					},
				},
			},
			{
				displayName: "Additional Options",
				name: "batchAdditionalOptions",
				type: "fixedCollection",
				placeholder: "Add options",
				default: {},
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["createBatch"],
					},
				},
				options: [
					{
						name: "options",
						displayName: "Options",
						values: [
							{
								displayName: "Metadata",
								name: "metadata",
								type: "string",
								default: "",
								description: "JSON string with custom metadata for this batch",
							},
							{
								displayName: "Email Required",
								name: "email_required",
								type: "options",
								options: [
									{ name: "None", value: "" },
									{ name: "Must Have", value: "must_have" },
									{ name: "Preferred", value: "preferred" },
								],
								default: "",
								description: "Email requirement preference",
							},
							{
								displayName: "Include Lookalikes",
								name: "include_lookalikes",
								type: "boolean",
								default: false,
								description: "Whether to include similar creators",
							},
							{
								displayName: "Include Audience Data",
								name: "include_audience_data",
								type: "boolean",
								default: false,
								description: "Whether to include audience demographics",
							},
							{
								displayName: "Exclude Platforms",
								name: "exclude_platforms",
								type: "options",
								options: [
									{ name: "None", value: "" },
									{ name: "Instagram", value: "instagram" },
									{ name: "YouTube", value: "youtube" },
									{ name: "TikTok", value: "tiktok" },
									{ name: "Twitter", value: "twitter" },
									{ name: "Twitch", value: "twitch" },
									{ name: "OnlyFans", value: "onlyfans" },
								],
								default: "",
								description: "Platform to exclude from enrichment",
							},
							{
								displayName: "Min Followers",
								name: "min_followers",
								type: "number",
								default: 0,
								description: "Minimum follower count threshold",
							},
						],
					},
				],
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
			{
				displayName: "Format",
				name: "batch_download_format",
				type: "options",
				options: [
					{
						name: "JSON",
						value: "json",
						description: "Return the enriched records as JSON items (most useful for downstream n8n nodes)",
					},
					{
						name: "CSV (Binary)",
						value: "csv",
						description: "Return the CSV file as binary data (use with Write Binary File, Email attachment, etc.)",
					},
					{
						name: "Presigned URL",
						value: "url",
						description: "Return a presigned S3 URL — safer for large batches; the user/workflow fetches it separately",
					},
				],
				default: "json",
				required: true,
				description: "How the download should be delivered",
				displayOptions: {
					show: {
						resource: ["batchEnrichment"],
						operation: ["downloadBatchResults"],
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
			// Enrich by Handle parameters (also reused by Get Connected Socials and Get Posts)
			{
				displayName: "Handle",
				name: "handle",
				type: "string",
				default: "",
				required: true,
				description: "Enter the creator’s handle, profile URL, or YouTube channel ID (UC...)",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["enrichByHandle", "enrichByHandleRaw", "getSocials", "getPosts"],
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
						operation: ["enrichByHandle", "enrichByHandleRaw", "getSocials"],
					},
				},
			},
			{
				displayName: "Include Audience Data",
				name: "include_audience_data",
				type: "boolean",
				default: false,
				description: "Whether to include audience demographic and interest data in the response",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["enrichByHandle"],
					},
				},
			},
			// Platform (video) — Posts, Post Details, Audience Overlap only support IG/TT/YT
			{
				displayName: "Platform",
				name: "video_platform",
				type: "options",
				options: [
					{ name: "Instagram", value: "instagram" },
					{ name: "TikTok", value: "tiktok" },
					{ name: "YouTube", value: "youtube" },
				],
				default: "instagram",
				required: true,
				description: "Social platform (Posts, Post Details and Audience Overlap support Instagram, TikTok and YouTube only)",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPosts", "getPostDetails", "audienceOverlap"],
					},
				},
			},
			// Get Posts — pagination
			{
				displayName: "Return All",
				name: "posts_return_all",
				type: "boolean",
				default: false,
				description: "Whether to fetch every available page. When off, only one page is returned.",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPosts"],
					},
				},
			},
			{
				displayName: "Count",
				name: "posts_count",
				type: "number",
				default: 30,
				description: "Posts per page. Platform caps: Instagram is fixed at 12; TikTok default 30 / max 35; YouTube default 30 / max 50. The API clamps values outside these ranges.",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPosts"],
					},
				},
				typeOptions: { minValue: 1, maxValue: 50 },
			},
			// Get Post Details — post id and content type
			{
				displayName: "Post ID",
				name: "post_id",
				type: "string",
				default: "",
				required: true,
				description: "Unique identifier of the post to retrieve",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPostDetails"],
					},
				},
			},
			{
				displayName: "Content Type",
				name: "content_type",
				type: "options",
				options: [
					{ name: "Data", value: "data", description: "Post metadata and engagement metrics" },
					{ name: "Comments", value: "comments", description: "Paginated comment list" },
					{ name: "Transcript", value: "transcript", description: "Extracted spoken text from video content" },
					{ name: "Audio", value: "audio", description: "Audio resource reference (Instagram and TikTok only — not supported on YouTube)" },
				],
				default: "data",
				required: true,
				description: "Which type of post data to retrieve. Note: \"Audio\" is only supported for Instagram and TikTok.",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPostDetails"],
					},
				},
			},
			{
				displayName: "Pagination Token",
				name: "details_pagination_token",
				type: "string",
				default: "",
				description: "Token for retrieving the next page of comments (used when Content Type is \"comments\")",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["getPostDetails"],
					},
				},
			},
			// Audience Overlap — 2 to 10 creator handles
			{
				displayName: "Creators",
				name: "overlap_creators",
				type: "fixedCollection",
				placeholder: "Add Creator",
				default: {},
				typeOptions: { multipleValues: true },
				description: "List of creator handles to compare. Between 2 and 10 creators are required.",
				displayOptions: {
					show: {
						resource: ["creator"],
						operation: ["audienceOverlap"],
					},
				},
				options: [
					{
						name: "values",
						displayName: "Creator",
						values: [
							{
								displayName: "Handle",
								name: "handle",
								type: "string",
								default: "",
								description: "Creator username on the selected platform",
							},
						],
					},
				],
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
					multipleValues: false,
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
								name: "location_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getLocations" },
								description: "Pick locations from the API's official dictionary for the selected platform",
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
								name: "profile_language_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getLanguages" },
								description: "Pick one or more profile languages from the API's official dictionary",
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
								name: "brands_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getBrands" },
								description: "Pick brands from the API's official dictionary",
							},
							{
								displayName: "Audience Interests",
								name: "audience_interests_picker",
								type: "fixedCollection",
								typeOptions: { multipleValues: true },
								placeholder: "Add Interest",
								default: {},
								description: "Filter creators whose Instagram followers share these interests (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
								options: [
									{
										name: "values",
										displayName: "Interest",
										values: [
											{
												displayName: "Interest",
												name: "name",
												type: "options",
												typeOptions: { loadOptionsMethod: "getAudienceInterests" },
												default: "",
												description: "Select an interest from the API dictionary",
											},
											{
												displayName: "Minimum Percentage",
												name: "min_pct",
												type: "number",
												default: 10,
												description: "Minimum percentage of the audience that must match this interest",
												typeOptions: { minValue: 0, maxValue: 100 },
											},
										],
									},
								],
							},
							{
								displayName: "Audience Locations",
								name: "audience_locations_picker",
								type: "fixedCollection",
								typeOptions: { multipleValues: true },
								placeholder: "Add Location",
								default: {},
								description: "Filter creators whose Instagram followers live in these locations (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
								options: [
									{
										name: "values",
										displayName: "Location",
										values: [
											{
												displayName: "Location",
												name: "name",
												type: "options",
												typeOptions: { loadOptionsMethod: "getAudienceLocations" },
												default: "",
												description: "Select a location from the API dictionary",
											},
											{
												displayName: "Type",
												name: "type",
												type: "options",
												options: [
													{ name: "Country", value: "country" },
													{ name: "State", value: "state" },
													{ name: "City", value: "city" },
												],
												default: "country",
												description: "Granularity of the location",
											},
											{
												displayName: "Minimum Percentage",
												name: "min_pct",
												type: "number",
												default: 10,
												description: "Minimum percentage of the audience that must live in this location",
												typeOptions: { minValue: 0, maxValue: 100 },
											},
										],
									},
								],
							},
							{
								displayName: "Audience Brands",
								name: "audience_brands_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getAudienceBrandNames" },
								description: "Filter creators whose Instagram followers engage with these brands (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
							},
							{
								displayName: "Audience Brand Categories",
								name: "audience_brand_categories_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getAudienceBrandCategories" },
								description: "Filter creators whose Instagram followers engage with these brand categories (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
							},
							{
								displayName: "Audience Gender",
								name: "audience_gender_picker",
								type: "fixedCollection",
								typeOptions: { multipleValues: false },
								placeholder: "Set Gender",
								default: {},
								description: "Filter creators whose Instagram followers match this gender distribution (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
								options: [
									{
										name: "value",
										displayName: "Gender",
										values: [
											{
												displayName: "Gender",
												name: "type",
												type: "options",
												options: [
													{ name: "Male", value: "male" },
													{ name: "Female", value: "female" },
												],
												default: "female",
											},
											{
												displayName: "Minimum Percentage",
												name: "min_pct",
												type: "number",
												default: 50,
												description: "Minimum percentage of the audience that must match this gender",
												typeOptions: { minValue: 0, maxValue: 100 },
											},
										],
									},
								],
							},
							{
								displayName: "Audience Language",
								name: "audience_language_picker",
								type: "fixedCollection",
								typeOptions: { multipleValues: true },
								placeholder: "Add Language",
								default: {},
								description: "Filter creators whose Instagram followers speak these languages (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
								options: [
									{
										name: "values",
										displayName: "Language",
										values: [
											{
												displayName: "Language",
												name: "language_abbr",
												type: "options",
												typeOptions: { loadOptionsMethod: "getLanguages" },
												default: "",
												description: "Select a language from the API dictionary",
											},
											{
												displayName: "Minimum Percentage",
												name: "min_pct",
												type: "number",
												default: 10,
												description: "Minimum percentage of the audience that must speak this language",
												typeOptions: { minValue: 0, maxValue: 100 },
											},
										],
									},
								],
							},
							{
								displayName: "Audience Age",
								name: "audience_age_picker",
								type: "fixedCollection",
								typeOptions: { multipleValues: true },
								placeholder: "Add Age Range",
								default: {},
								description: "Filter creators whose Instagram followers fall within these age ranges (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
								options: [
									{
										name: "values",
										displayName: "Age Range",
										values: [
											{
												displayName: "Age Range",
												name: "range",
												type: "options",
												options: [
													{ name: "13–17", value: "13-17" },
													{ name: "18–24", value: "18-24" },
													{ name: "25–34", value: "25-34" },
													{ name: "35–44", value: "35-44" },
													{ name: "45–64", value: "45-64" },
													{ name: "65+", value: "65+" },
													{ name: "65– (legacy)", value: "65-" },
												],
												default: "25-34",
											},
											{
												displayName: "Minimum Percentage",
												name: "min_pct",
												type: "number",
												default: 10,
												description: "Minimum percentage of the audience that must fall within this age range",
												typeOptions: { minValue: 0, maxValue: 100 },
											},
										],
									},
								],
							},
							{
								displayName: "Audience Credibility",
								name: "audience_credibility_picker",
								type: "options",
								options: [
									{ name: "(No filter)", value: "" },
									{ name: "Bad", value: "bad" },
									{ name: "Low", value: "low" },
									{ name: "Normal", value: "normal" },
									{ name: "Good", value: "good" },
									{ name: "High", value: "high" },
									{ name: "Best", value: "best" },
								],
								default: "",
								description: "Filter creators by the credibility score of their Instagram audience (e.g. proportion of real vs. bot followers) (Instagram only, 10k+ followers)",
								displayOptions: {
									show: {
										"/platform": ["instagram"],
									},
								},
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
					multipleValues: false,
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
					multipleValues: false,
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
								name: "topics_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getYtTopics" },
								description: "Pick YouTube topics from the API's official dictionary",
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
					multipleValues: false,
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
					multipleValues: false,
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
					multipleValues: false,
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
					multipleValues: false,
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
								name: "games_played_picker",
								type: "multiOptions",
								default: [],
								typeOptions: { loadOptionsMethod: "getGames" },
								description: "Pick Twitch games from the API's official dictionary",
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

	methods = {
		loadOptions: {
			async getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/languages/",
						json: true,
					},
				);
				const list = Array.isArray(response) ? response : ((response as IDataObject)?.result as IDataObject[]) ?? [];
				return list
					.map((entry) => {
						const item = entry as IDataObject;
						const value = (item.abbreviation as string) ?? "";
						const name = (item.language as string) ?? value;
						return { name, value } as INodePropertyOptions;
					})
					.filter((opt) => opt.value)
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getYtTopics(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/yt-topics/",
						json: true,
					},
				);
				const list = (Array.isArray(response) ? response : []) as IDataObject[];
				const options: INodePropertyOptions[] = [];
				for (const entry of list) {
					const parent = (entry.topic_details as string) ?? "";
					if (parent) options.push({ name: parent, value: parent });
					const subs = entry.sub_topic_details as string[] | undefined;
					if (Array.isArray(subs)) {
						for (const sub of subs) {
							if (sub) options.push({ name: `${parent ? parent + " — " : ""}${sub}`, value: sub });
						}
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getGames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/games/",
						json: true,
					},
				);
				const list = (Array.isArray(response) ? response : []) as string[];
				return list
					.filter((g) => typeof g === "string" && g.length > 0)
					.map((g) => ({ name: g, value: g }) as INodePropertyOptions)
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getBrands(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/brands/",
						json: true,
					},
				);
				const list = (Array.isArray(response) ? response : []) as IDataObject[];
				return list
					.map((entry) => {
						const fullName = (entry.full_name as string) ?? "";
						const cleaned = (entry.cleaned as string) ?? "";
						const username = (entry.username as string) ?? "";
						const displayName = username ? `${fullName || cleaned} (@${username})` : (fullName || cleaned);
						const value = username || cleaned || fullName;
						return { name: displayName, value } as INodePropertyOptions;
					})
					.filter((opt) => opt.value)
					.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getAudienceInterests(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/audience-interests/",
						json: true,
					},
				);
				const raw = Array.isArray(response)
					? response
					: ((response as IDataObject)?.result as unknown[])
					?? ((response as IDataObject)?.data as unknown[])
					?? [];
				const options: INodePropertyOptions[] = [];
				for (const item of raw) {
					if (typeof item === "string") {
						if (item.length > 0) options.push({ name: item, value: item });
					} else if (item && typeof item === "object") {
						const entry = item as IDataObject;
						const value = (entry.interest as string)
							?? (entry.value as string)
							?? (entry.name as string)
							?? (entry.cleaned as string)
							?? (entry.id as string)
							?? "";
						const name = (entry.label as string)
							?? (entry.display as string)
							?? (entry.interest as string)
							?? (entry.name as string)
							?? (entry.full_name as string)
							?? value;
						if (value) options.push({ name, value });
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getAudienceLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/audience-locations/",
						json: true,
					},
				);
				const raw = Array.isArray(response)
					? response
					: ((response as IDataObject)?.result as unknown[])
					?? ((response as IDataObject)?.data as unknown[])
					?? [];
				const options: INodePropertyOptions[] = [];
				for (const item of raw) {
					if (typeof item === "string") {
						if (item.length > 0) options.push({ name: item, value: item });
					} else if (item && typeof item === "object") {
						const entry = item as IDataObject;
						const value = (entry.location as string)
							?? (entry.value as string)
							?? (entry.name as string)
							?? (entry.cleaned as string)
							?? (entry.id as string)
							?? (entry.code as string)
							?? "";
						const name = (entry.label as string)
							?? (entry.display as string)
							?? (entry.location as string)
							?? (entry.name as string)
							?? (entry.full_name as string)
							?? value;
						if (value) options.push({ name, value });
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getAudienceBrandNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/audience-brand-names/",
						json: true,
					},
				);
				const raw = Array.isArray(response) ? response : [];
				const options: INodePropertyOptions[] = [];
				for (const item of raw) {
					if (typeof item === "string") {
						if (item.length > 0) options.push({ name: item, value: item });
					} else if (item && typeof item === "object") {
						const entry = item as IDataObject;
						const value = (entry.username as string)
							?? (entry.cleaned as string)
							?? (entry.full_name as string)
							?? (entry.name as string)
							?? "";
						const fullName = (entry.full_name as string) ?? "";
						const username = (entry.username as string) ?? "";
						const display = username && fullName ? `${fullName} (@${username})` : (fullName || username || value);
						if (value) options.push({ name: display, value });
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getAudienceBrandCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/discovery/classifier/audience-brand-categories/",
						json: true,
					},
				);
				const raw = Array.isArray(response) ? response : [];
				const options: INodePropertyOptions[] = [];
				for (const item of raw) {
					if (typeof item === "string") {
						if (item.length > 0) options.push({ name: item, value: item });
					} else if (item && typeof item === "object") {
						const entry = item as IDataObject;
						const value = (entry.name as string)
							?? (entry.value as string)
							?? (entry.category as string)
							?? (entry.cleaned as string)
							?? (entry.id as string)
							?? "";
						const display = (entry.label as string) ?? (entry.name as string) ?? value;
						if (value) options.push({ name: display, value });
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
			async getLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const platform = (this.getCurrentNodeParameter("platform") as string) || "instagram";
				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					"influencersClubApi",
					{
						method: "GET" as IHttpRequestMethods,
						url: `https://api-dashboard.influencers.club/public/v1/discovery/classifier/locations/${encodeURIComponent(platform)}/`,
						json: true,
					},
				);
				const raw = Array.isArray(response)
					? response
					: ((response as IDataObject)?.result as unknown[])
					?? ((response as IDataObject)?.data as unknown[])
					?? [];
				const options: INodePropertyOptions[] = [];
				for (const item of raw) {
					if (typeof item === "string") {
						if (item.length > 0) options.push({ name: item, value: item });
					} else if (item && typeof item === "object") {
						const entry = item as IDataObject;
						const value = (entry.location as string)
							?? (entry.name as string)
							?? (entry.value as string)
							?? (entry.id as string)
							?? (entry.code as string)
							?? "";
						const name = (entry.label as string)
							?? (entry.display as string)
							?? (entry.name as string)
							?? value;
						if (value) options.push({ name, value });
					}
				}
				return options.sort((a, b) => a.name.localeCompare(b.name));
			},
		},
	};

	private static buildApiFilters(ctx: IExecuteFunctions, platform: string, itemIndex: number): IDataObject {
		const getParam = (path: string, fallback: unknown = {}) => {
			const raw = ctx.getNodeParameter(path, itemIndex, fallback) as IDataObject | IDataObject[];
			return (Array.isArray(raw) && raw.length ? raw[0] : raw) as IDataObject;
		};
		const commaToArray = (v: unknown) => {
			if (typeof v !== "string") return undefined;
			const arr = v.split(",").map((k: string) => k.trim()).filter(Boolean);
			return arr.length > 0 ? arr : undefined;
		};

		const sharedFilters = getParam("advancedFilters.filters");
		const instagramFilters = getParam("instagramFilters.values");
		const youtubeFilters = getParam("youtubeFilters.values");
		const tiktokFilters = getParam("tiktokFilters.values");
		const twitterFilters = getParam("twitterFilters.values");
		const onlyfansFilters = getParam("onlyfansFilters.values");
		const twitchFilters = getParam("twitchFilters.values");

		const apiFilters: IDataObject = {};

		// Shared filters
		const locationPicker = Array.isArray(sharedFilters.location_picker)
			? (sharedFilters.location_picker as string[]).filter(Boolean)
			: [];
		if (locationPicker.length > 0) apiFilters.location = locationPicker;
		if (sharedFilters.type && sharedFilters.type !== "" && ["instagram","youtube","tiktok"].includes(platform)) apiFilters.type = sharedFilters.type;
		if (sharedFilters.gender && sharedFilters.gender !== "" && sharedFilters.type !== "business") apiFilters.gender = sharedFilters.gender;
		const profileLanguagePicker = Array.isArray(sharedFilters.profile_language_picker)
			? (sharedFilters.profile_language_picker as string[]).filter(Boolean)
			: [];
		if (profileLanguagePicker.length > 0) {
			apiFilters.profile_language = profileLanguagePicker;
		}
		if (sharedFilters.promotes_affiliate_links === true) apiFilters.promotes_affiliate_links = sharedFilters.promotes_affiliate_links;
		if (sharedFilters.has_done_brand_deals === true) apiFilters.has_done_brand_deals = sharedFilters.has_done_brand_deals;
		if (sharedFilters.has_link_in_bio === true) apiFilters.has_link_in_bio = sharedFilters.has_link_in_bio;
		if (sharedFilters.does_live_streaming === true) apiFilters.does_live_streaming = sharedFilters.does_live_streaming;
		if (sharedFilters.has_merch === true) apiFilters.has_merch = sharedFilters.has_merch;
		const brandsPicker = Array.isArray(sharedFilters.brands_picker)
			? (sharedFilters.brands_picker as string[]).filter(Boolean)
			: [];
		if (brandsPicker.length > 0) apiFilters.brands = brandsPicker;
		if (platform === "instagram") {
			const audience: IDataObject = {};
			const interestsRaw = (sharedFilters.audience_interests_picker as IDataObject)?.values as IDataObject[] | undefined;
			if (Array.isArray(interestsRaw) && interestsRaw.length > 0) {
				const interests = interestsRaw
					.map((row) => {
						const name = ((row?.name as string) || "").trim();
						const min_pct = row?.min_pct as number | undefined;
						if (!name) return null;
						return { name, min_pct: typeof min_pct === "number" ? min_pct : null } as IDataObject;
					})
					.filter((x): x is IDataObject => x !== null);
				if (interests.length > 0) audience.interests = interests;
			}
			const locationsRaw = (sharedFilters.audience_locations_picker as IDataObject)?.values as IDataObject[] | undefined;
			if (Array.isArray(locationsRaw) && locationsRaw.length > 0) {
				const locations = locationsRaw
					.map((row) => {
						const name = ((row?.name as string) || "").trim();
						const type = ((row?.type as string) || "country").trim();
						const min_pct = row?.min_pct as number | undefined;
						if (!name) return null;
						return { name, type, min_pct: typeof min_pct === "number" ? min_pct : null } as IDataObject;
					})
					.filter((x): x is IDataObject => x !== null);
				if (locations.length > 0) audience.location = locations;
			}
			const audienceBrands = Array.isArray(sharedFilters.audience_brands_picker)
				? (sharedFilters.audience_brands_picker as string[]).filter(Boolean)
				: [];
			if (audienceBrands.length > 0) audience.brands = audienceBrands;
			const audienceBrandCategories = Array.isArray(sharedFilters.audience_brand_categories_picker)
				? (sharedFilters.audience_brand_categories_picker as string[]).filter(Boolean)
				: [];
			if (audienceBrandCategories.length > 0) audience.brand_categories = audienceBrandCategories;
			const genderRaw = (sharedFilters.audience_gender_picker as IDataObject)?.value as IDataObject | undefined;
			if (genderRaw && typeof genderRaw === "object") {
				const type = ((genderRaw.type as string) || "").trim();
				const min_pct = genderRaw.min_pct as number | undefined;
				if (type) {
					audience.gender = { type, min_pct: typeof min_pct === "number" ? min_pct : null } as IDataObject;
				}
			}
			const languageRaw = (sharedFilters.audience_language_picker as IDataObject)?.values as IDataObject[] | undefined;
			if (Array.isArray(languageRaw) && languageRaw.length > 0) {
				const languages = languageRaw
					.map((row) => {
						const language_abbr = ((row?.language_abbr as string) || "").trim();
						const min_pct = row?.min_pct as number | undefined;
						if (!language_abbr) return null;
						return { language_abbr, min_pct: typeof min_pct === "number" ? min_pct : null } as IDataObject;
					})
					.filter((x): x is IDataObject => x !== null);
				if (languages.length > 0) audience.language = languages;
			}
			const ageRaw = (sharedFilters.audience_age_picker as IDataObject)?.values as IDataObject[] | undefined;
			if (Array.isArray(ageRaw) && ageRaw.length > 0) {
				const ages = ageRaw
					.map((row) => {
						const range = ((row?.range as string) || "").trim();
						const min_pct = row?.min_pct as number | undefined;
						if (!range) return null;
						return { range, min_pct: typeof min_pct === "number" ? min_pct : null } as IDataObject;
					})
					.filter((x): x is IDataObject => x !== null);
				if (ages.length > 0) audience.age = ages;
			}
			const credibility = (sharedFilters.audience_credibility_picker as string) || "";
			if (credibility) audience.credibility = credibility;
			if (Object.keys(audience).length > 0) apiFilters.audience = audience;
		}
		if (sharedFilters.exclude_role_based_emails === true) apiFilters.exclude_role_based_emails = sharedFilters.exclude_role_based_emails;
		if (sharedFilters.exclude_previous === true) apiFilters.exclude_previous = sharedFilters.exclude_previous;
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
			if (instagramFilters.follower_growth_percentage) apiFilters.follower_growth = { growth_percentage: instagramFilters.follower_growth_percentage, time_range_months: instagramFilters.follower_growth_time_range_months || 3 };
			if (instagramFilters.min_number_of_posts || instagramFilters.max_number_of_posts) apiFilters.number_of_posts = { min: instagramFilters.min_number_of_posts || null, max: instagramFilters.max_number_of_posts || null };
			if (instagramFilters.min_average_likes || instagramFilters.max_average_likes) apiFilters.average_likes = { min: instagramFilters.min_average_likes || null, max: instagramFilters.max_average_likes || null };
			if (instagramFilters.min_average_comments || instagramFilters.max_average_comments) apiFilters.average_comments = { min: instagramFilters.min_average_comments || null, max: instagramFilters.max_average_comments || null };
			if (instagramFilters.min_reels_percent || instagramFilters.max_reels_percent) apiFilters.reels_percent = { min: instagramFilters.min_reels_percent || null, max: instagramFilters.max_reels_percent || null };
			if (instagramFilters.min_average_views_for_reels || instagramFilters.max_average_views_for_reels) apiFilters.average_views_for_reels = { min: instagramFilters.min_average_views_for_reels || null, max: instagramFilters.max_average_views_for_reels || null };
			if (instagramFilters.min_income || instagramFilters.max_income) apiFilters.income = { min: instagramFilters.min_income || null, max: instagramFilters.max_income || null };
			if (instagramFilters.min_video_percentage || instagramFilters.max_video_percentage) apiFilters.video_percentage = { min: instagramFilters.min_video_percentage || null, max: instagramFilters.max_video_percentage || null };
			if (instagramFilters.exclude_private_profile === true) apiFilters.exclude_private_profile = instagramFilters.exclude_private_profile;
			if (instagramFilters.is_verified === true) apiFilters.is_verified = instagramFilters.is_verified;
			if (instagramFilters.has_videos === true) apiFilters.has_videos = instagramFilters.has_videos;
			if (instagramFilters.last_post) apiFilters.last_post = instagramFilters.last_post;
			if (commaToArray(instagramFilters.keywords_in_bio)) apiFilters.keywords_in_bio = commaToArray(instagramFilters.keywords_in_bio);
			if (commaToArray(instagramFilters.exclude_keywords_in_bio)) apiFilters.exclude_keywords_in_bio = commaToArray(instagramFilters.exclude_keywords_in_bio);
			if (commaToArray(instagramFilters.similar_to)) apiFilters.similar_to = commaToArray(instagramFilters.similar_to);
			if (commaToArray(instagramFilters.link_in_bio)) apiFilters.link_in_bio = commaToArray(instagramFilters.link_in_bio);
			if (commaToArray(instagramFilters.hashtags)) apiFilters.hashtags = commaToArray(instagramFilters.hashtags);
			if (commaToArray(instagramFilters.not_hashtags)) apiFilters.not_hashtags = commaToArray(instagramFilters.not_hashtags);
			if (commaToArray(instagramFilters.keywords_in_captions)) apiFilters.keywords_in_captions = commaToArray(instagramFilters.keywords_in_captions);
			if (instagramFilters.engagement_percent_min || instagramFilters.engagement_percent_max) apiFilters.engagement_percent = { min: instagramFilters.engagement_percent_min || null, max: instagramFilters.engagement_percent_max || null };
			if (instagramFilters.has_merch === true) apiFilters.has_merch = instagramFilters.has_merch;
		}

		if (platform === "youtube") {
			if (youtubeFilters.min_subscribers || youtubeFilters.max_subscribers) apiFilters.number_of_subscribers = { min: youtubeFilters.min_subscribers || null, max: youtubeFilters.max_subscribers || null };
			const ytTopicsPicker = Array.isArray(youtubeFilters.topics_picker)
				? (youtubeFilters.topics_picker as string[]).filter(Boolean)
				: [];
			if (ytTopicsPicker.length > 0) apiFilters.topics = ytTopicsPicker;
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
			if (youtubeFilters.subscriber_growth_percentage) apiFilters.subscriber_growth = { growth_percentage: youtubeFilters.subscriber_growth_percentage, time_range_months: youtubeFilters.subscriber_growth_time_range_months || 3 };
			if (youtubeFilters.has_shorts === true) apiFilters.has_shorts = youtubeFilters.has_shorts;
			if (youtubeFilters.min_shorts_percentage || youtubeFilters.max_shorts_percentage) apiFilters.shorts_percentage = { min: youtubeFilters.min_shorts_percentage || null, max: youtubeFilters.max_shorts_percentage || null };
			if (youtubeFilters.engagement_percent_min || youtubeFilters.engagement_percent_max) apiFilters.engagement_percent = { min: youtubeFilters.engagement_percent_min || null, max: youtubeFilters.engagement_percent_max || null };
			if (youtubeFilters.has_community_posts === true) apiFilters.has_community_posts = youtubeFilters.has_community_posts;
			if (youtubeFilters.streams_live === true) apiFilters.streams_live = youtubeFilters.streams_live;
			if (youtubeFilters.has_merch === true) apiFilters.has_merch = youtubeFilters.has_merch;
			if (youtubeFilters.has_podcast === true) apiFilters.has_podcast = youtubeFilters.has_podcast;
			if (youtubeFilters.has_courses === true) apiFilters.has_courses = youtubeFilters.has_courses;
			if (youtubeFilters.has_membership === true) apiFilters.has_membership = youtubeFilters.has_membership;
			if (youtubeFilters.min_average_views_on_long_videos || youtubeFilters.max_average_views_on_long_videos) apiFilters.average_views_on_long_videos = { min: youtubeFilters.min_average_views_on_long_videos || null, max: youtubeFilters.max_average_views_on_long_videos || null };
			if (youtubeFilters.long_video_duration_min != null || youtubeFilters.long_video_duration_max != null) apiFilters.long_video_duration = { min: youtubeFilters.long_video_duration_min ?? null, max: youtubeFilters.long_video_duration_max ?? null };
			if (youtubeFilters.min_average_views_on_shorts || youtubeFilters.max_average_views_on_shorts) apiFilters.average_views_on_shorts = { min: youtubeFilters.min_average_views_on_shorts || null, max: youtubeFilters.max_average_views_on_shorts || null };
			if (youtubeFilters.min_number_of_videos || youtubeFilters.max_number_of_videos) apiFilters.number_of_videos = { min: youtubeFilters.min_number_of_videos || null, max: youtubeFilters.max_number_of_videos || null };
			if (youtubeFilters.is_monetizing === true) apiFilters.is_monetizing = youtubeFilters.is_monetizing;
			if (commaToArray(youtubeFilters.similar_to)) apiFilters.similar_to = commaToArray(youtubeFilters.similar_to);
			if (youtubeFilters.income_min || youtubeFilters.income_max) apiFilters.income = { min: youtubeFilters.income_min || null, max: youtubeFilters.income_max || null };
			if (youtubeFilters.last_upload_long_video) apiFilters.last_upload_long_video = youtubeFilters.last_upload_long_video;
			if (youtubeFilters.last_upload_short_video) apiFilters.last_upload_short_video = youtubeFilters.last_upload_short_video;
			if (youtubeFilters.last_stream_upload) apiFilters.last_stream_upload = youtubeFilters.last_stream_upload;
			if (youtubeFilters.average_stream_views_min || youtubeFilters.average_stream_views_max) apiFilters.average_stream_views = { min: youtubeFilters.average_stream_views_min || null, max: youtubeFilters.average_stream_views_max || null };
			if (youtubeFilters.average_stream_duration_min != null || youtubeFilters.average_stream_duration_max != null) apiFilters.average_stream_duration = { min: youtubeFilters.average_stream_duration_min ?? null, max: youtubeFilters.average_stream_duration_max ?? null };
			if (youtubeFilters.is_verified === true) apiFilters.is_verified = youtubeFilters.is_verified;
		}

		if (platform === "tiktok") {
			if (tiktokFilters.number_of_followers_min || tiktokFilters.number_of_followers_max) apiFilters.number_of_followers = { min: tiktokFilters.number_of_followers_min || null, max: tiktokFilters.number_of_followers_max || null };
			if (tiktokFilters.posting_frequency) apiFilters.posting_frequency = tiktokFilters.posting_frequency;
			if (tiktokFilters.follower_growth_percentage) apiFilters.follower_growth = { growth_percentage: tiktokFilters.follower_growth_percentage, time_range_months: tiktokFilters.follower_growth_time_range_months || 3 };
			if (tiktokFilters.average_likes_min || tiktokFilters.average_likes_max) apiFilters.average_likes = { min: tiktokFilters.average_likes_min || null, max: tiktokFilters.average_likes_max || null };
			if (tiktokFilters.average_comments_min || tiktokFilters.average_comments_max) apiFilters.average_comments = { min: tiktokFilters.average_comments_min || null, max: tiktokFilters.average_comments_max || null };
			if (tiktokFilters.engagement_percent_min || tiktokFilters.engagement_percent_max) apiFilters.engagement_percent = { min: tiktokFilters.engagement_percent_min || null, max: tiktokFilters.engagement_percent_max || null };
			if (tiktokFilters.average_views_min || tiktokFilters.average_views_max) apiFilters.average_views = { min: tiktokFilters.average_views_min || null, max: tiktokFilters.average_views_max || null };
			if (tiktokFilters.average_video_downloads_min || tiktokFilters.average_video_downloads_max) apiFilters.average_video_downloads = { min: tiktokFilters.average_video_downloads_min || null, max: tiktokFilters.average_video_downloads_max || null };
			if (tiktokFilters.video_count_min || tiktokFilters.video_count_max) apiFilters.video_count = { min: tiktokFilters.video_count_min || null, max: tiktokFilters.video_count_max || null };
			if (tiktokFilters.has_tik_tok_shop === true) apiFilters.has_tik_tok_shop = tiktokFilters.has_tik_tok_shop;
			if (tiktokFilters.exclude_private_profile === true) apiFilters.exclude_private_profile = tiktokFilters.exclude_private_profile;
			if (tiktokFilters.is_verified === true) apiFilters.is_verified = tiktokFilters.is_verified;
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
			if (onlyfansFilters.has_videos === true) apiFilters.has_videos = onlyfansFilters.has_videos;
			if (onlyfansFilters.has_free_account === true) apiFilters.has_free_account = onlyfansFilters.has_free_account;
			if (onlyfansFilters.has_live_streams === true) apiFilters.has_live_streams = onlyfansFilters.has_live_streams;
			if (onlyfansFilters.is_verified === true) apiFilters.is_verified = onlyfansFilters.is_verified;
		}

		if (platform === "twitch") {
			if (twitchFilters.followers_min || twitchFilters.followers_max) apiFilters.followers = { min: twitchFilters.followers_min || null, max: twitchFilters.followers_max || null };
			if (twitchFilters.min_streamed_hours_last_30_days || twitchFilters.max_streamed_hours_last_30_days) apiFilters.streamed_hours_last_30_days = { min: twitchFilters.min_streamed_hours_last_30_days || null, max: twitchFilters.max_streamed_hours_last_30_days || null };
			if (twitchFilters.min_maximum_views_count || twitchFilters.max_maximum_views_count) apiFilters.maximum_views_count = { min: twitchFilters.min_maximum_views_count || null, max: twitchFilters.max_maximum_views_count || null };
			if (twitchFilters.min_avg_views_last_30_days || twitchFilters.max_avg_views_last_30_days) apiFilters.avg_views_last_30_days = { min: twitchFilters.min_avg_views_last_30_days || null, max: twitchFilters.max_avg_views_last_30_days || null };
			if (twitchFilters.min_streams_count_last_30_days || twitchFilters.max_streams_count_last_30_days) apiFilters.streams_count_last_30_days = { min: twitchFilters.min_streams_count_last_30_days || null, max: twitchFilters.max_streams_count_last_30_days || null };
			const twitchGamesPicker = Array.isArray(twitchFilters.games_played_picker)
				? (twitchFilters.games_played_picker as string[]).filter(Boolean)
				: [];
			if (twitchGamesPicker.length > 0) apiFilters.games_played = twitchGamesPicker;
			if (twitchFilters.is_twitch_partner === true) apiFilters.is_twitch_partner = twitchFilters.is_twitch_partner;
			if (commaToArray(twitchFilters.keywords_in_description)) apiFilters.keywords_in_description = commaToArray(twitchFilters.keywords_in_description);
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
				const include_audience_data = this.getNodeParameter("include_audience_data", itemIndex, false) as boolean;
				const email_required = (additionalOptions.email_required as string) ?? (nodeParams.email_required as string) ?? "preferred";

				const body: IDataObject = {
					handle,
					platform,
					include_lookalikes,
					include_audience_data,
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
				const binaryPropertyName = this.getNodeParameter("batch_binary_property", itemIndex) as string;
				const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
				const csvBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
				const fileName = binaryData.fileName || "batch.csv";

				const enrichmentMode = this.getNodeParameter("batch_enrichment_mode", itemIndex) as string;
				const batchPlatform = this.getNodeParameter("batch_platform", itemIndex, "") as string;
				const batchOpts = (this.getNodeParameter("batchAdditionalOptions", itemIndex, {}) as IDataObject);
				const opts = (batchOpts.options || {}) as IDataObject;

				const form = new FormData();
				form.append("file", csvBuffer, { filename: fileName, contentType: "text/csv" });
				form.append("enrichment_mode", enrichmentMode);
				if (batchPlatform) form.append("platform", batchPlatform);
				if (opts.metadata) form.append("metadata", String(opts.metadata));
				if (opts.email_required) form.append("email_required", String(opts.email_required));
				if (opts.include_lookalikes) form.append("include_lookalikes", String(opts.include_lookalikes));
				if (opts.include_audience_data) form.append("include_audience_data", String(opts.include_audience_data));
				if (opts.exclude_platforms) form.append("exclude_platforms", String(opts.exclude_platforms));
				if ((opts.min_followers as number) > 0) form.append("min_followers", String(opts.min_followers));

				const credentials = await this.getCredentials("influencersClubApi");
				const apiKey = credentials.apiKey as string;
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/enrichment/batch/",
					body: form,
					headers: {
						...form.getHeaders(),
						Authorization: `Bearer ${apiKey}`,
						"X-Origin": "n8n",
						"X-Integration": "influencers-n8n",
					},
				};
				const resp = await this.helpers.httpRequest(options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "getBatchStatus": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const options = {
					method: "GET" as IHttpRequestMethods,
					url: `https://api-dashboard.influencers.club/public/v1/enrichment/batch/${encodeURIComponent(batchId)}/status/`,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "downloadBatchResults": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const format = this.getNodeParameter("batch_download_format", itemIndex, "json") as string;
				const encodedBatchId = encodeURIComponent(batchId);
				if (format === "url") {
					const options = {
						method: "GET" as IHttpRequestMethods,
						url: `https://api-dashboard.influencers.club/public/v1/enrichment/batch/${encodedBatchId}/download/`,
						json: true,
					};
					const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
					outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				} else if (format === "csv") {
					const options = {
						method: "GET" as IHttpRequestMethods,
						url: `https://api-dashboard.influencers.club/public/v1/enrichment/batch/${encodedBatchId}/?format=csv`,
						encoding: "arraybuffer" as const,
						returnFullResponse: true,
					};
					const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options) as IDataObject;
					const buffer = Buffer.from(resp.body as Buffer);
					const binaryData = await this.helpers.prepareBinaryData(
						buffer,
						`batch-${batchId}.csv`,
						"text/csv",
					);
					outputItems.push({
						json: { batch_id: batchId, format: "csv", size_bytes: buffer.length } as IDataObject,
						binary: { data: binaryData },
						pairedItem: { item: itemIndex },
					});
				} else {
					const options = {
						method: "GET" as IHttpRequestMethods,
						url: `https://api-dashboard.influencers.club/public/v1/enrichment/batch/${encodedBatchId}/?format=json`,
						json: true,
					};
					const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
					if (Array.isArray(resp)) {
						for (const record of resp as IDataObject[]) {
							outputItems.push({ json: record, pairedItem: { item: itemIndex } });
						}
					} else {
						outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
					}
				}
				break;
			}
			case "resumeBatch": {
				const batchId = this.getNodeParameter("batch_id", itemIndex) as string;
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: `https://api-dashboard.influencers.club/public/v1/enrichment/batch/${encodeURIComponent(batchId)}/resume/`,
					body: {},
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "getSocials": {
				const handle = this.getNodeParameter("handle", itemIndex) as string;
				const platform = this.getNodeParameter("platform", itemIndex) as string;
				const body: IDataObject = { handle, platform };
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/creators/socials/",
					body,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "getPosts": {
				const handle = this.getNodeParameter("handle", itemIndex) as string;
				const platform = this.getNodeParameter("video_platform", itemIndex) as string;
				const returnAll = this.getNodeParameter("posts_return_all", itemIndex, false) as boolean;
				const count = this.getNodeParameter("posts_count", itemIndex, 30) as number;

				const aggregated: IDataObject[] = [];
				let pagination_token: string | undefined;
				let lastMeta: IDataObject = {};
				let totalCredits = 0;
				const maxPages = 50;
				for (let page = 0; page < maxPages; page++) {
					const body: IDataObject = { platform, handle, count };
					if (pagination_token) body.pagination_token = pagination_token;
					const options = {
						method: "POST" as IHttpRequestMethods,
						url: "https://api-dashboard.influencers.club/public/v1/creators/content/posts/",
						body,
						json: true,
					};
					const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options) as IDataObject;
					totalCredits += (resp.credits_cost as number) ?? 0;
					const result = (resp.result ?? {}) as IDataObject;
					const pageItems = (result.items as IDataObject[]) ?? [];
					aggregated.push(...pageItems);
					lastMeta = {
						num_results: aggregated.length,
						more_available: result.more_available as boolean,
						next_token: result.next_token as string | null,
						status: result.status as string | undefined,
					};
					const next = result.next_token as string | undefined;
					const more = result.more_available as boolean;
					if (!returnAll || !more || !next) break;
					pagination_token = next;
				}
				outputItems.push({
					json: {
						credits_cost: totalCredits,
						result: { ...lastMeta, items: aggregated },
					} as IDataObject,
					pairedItem: { item: itemIndex },
				});
				break;
			}
			case "getPostDetails": {
				const platform = this.getNodeParameter("video_platform", itemIndex) as string;
				const post_id = this.getNodeParameter("post_id", itemIndex) as string;
				const content_type = this.getNodeParameter("content_type", itemIndex) as string;
				if (platform === "youtube" && content_type === "audio") {
					throw new NodeOperationError(
						this.getNode(),
						"YouTube does not support the \"audio\" content type. Choose data, comments, or transcript instead.",
						{ itemIndex },
					);
				}
				const body: IDataObject = { platform, content_type, post_id };
				if (content_type === "comments") {
					const token = this.getNodeParameter("details_pagination_token", itemIndex, "") as string;
					if (token) body.pagination_token = token;
				}
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/creators/content/details/",
					body,
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "getCredits": {
				const options = {
					method: "GET" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/accounts/credits/",
					json: true,
				};
				const resp = await this.helpers.httpRequestWithAuthentication.call(this, "influencersClubApi", options);
				outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
				break;
			}
			case "audienceOverlap": {
				const platform = this.getNodeParameter("video_platform", itemIndex) as string;
				const creatorsRaw = this.getNodeParameter("overlap_creators.values", itemIndex, []) as IDataObject[];
				const creators = (Array.isArray(creatorsRaw) ? creatorsRaw : [])
					.map((c) => ((c.handle as string) || "").trim())
					.filter(Boolean);
				if (creators.length < 2 || creators.length > 10) {
					throw new NodeOperationError(
						this.getNode(),
						`Audience Overlap requires between 2 and 10 creator handles (got ${creators.length}).`,
						{ itemIndex },
					);
				}
				const body: IDataObject = { platform, creators };
				const options = {
					method: "POST" as IHttpRequestMethods,
					url: "https://api-dashboard.influencers.club/public/v1/creators/audience/overlap/",
					body,
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
