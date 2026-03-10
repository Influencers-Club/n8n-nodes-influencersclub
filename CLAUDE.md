# CLAUDE.md - n8n Community Node Development Standards

This document defines the coding standards, architecture patterns, and best practices
for developing n8n community nodes. All code in this repository must follow these
guidelines to ensure consistency, reliability, and compatibility with the n8n platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Package Configuration](#package-configuration)
4. [Node Base File Structure](#node-base-file-structure)
5. [INodeType Interface](#inodetype-interface)
6. [Description Object](#description-object)
7. [Properties and INodeProperties](#properties-and-inodeproperties)
8. [Resource and Operation Pattern](#resource-and-operation-pattern)
9. [The execute() Method](#the-execute-method)
10. [Credentials](#credentials)
11. [API Requests](#api-requests)
12. [Error Handling](#error-handling)
13. [Binary Data](#binary-data)
14. [Pagination](#pagination)
15. [TypeScript Standards](#typescript-standards)
16. [Naming Conventions](#naming-conventions)
17. [Icons and Assets](#icons-and-assets)
18. [Versioning](#versioning)
19. [Testing](#testing)
20. [Linting](#linting)
21. [Building and Publishing](#building-and-publishing)
22. [Code Organization for Complex Nodes](#code-organization-for-complex-nodes)
23. [Common Pitfalls](#common-pitfalls)

---

## Project Overview

This is an n8n community node package. Community nodes are npm packages that extend
n8n with integrations not included in the core `n8n-nodes-base` package. They follow
the **programmatic style** of node development, which uses an `execute()` method to
process incoming data and build API requests manually.

### Key Technologies

- **TypeScript** (strict mode) -- all node code must be TypeScript
- **Node.js** >= 20.19
- **n8n-workflow** as a peer dependency
- **ESLint** for linting
- **npm** for package distribution

---

## Project Structure

```
n8n-nodes-<package-name>/
  index.ts                          # Entry point: exports nodes and credentials arrays
  package.json                       # npm manifest with "n8n" section
  tsconfig.json                      # TypeScript configuration
  credentials/
    <ServiceName>Api.credentials.ts  # Credential definitions
  nodes/
    <NodeName>/
      <NodeName>.node.ts             # Main node implementation
      <nodeName>.svg                 # Node icon (SVG preferred)
  dist/                              # Compiled output (gitignored, npm-published)
```

### Rules

- The node class name and the `.node.ts` filename MUST match.
  Example: class `InfluencersClub` lives in `InfluencersClub.node.ts`.
- The credentials class name and the `.credentials.ts` filename MUST match.
  Example: class `InfluencersClubApi` lives in `InfluencersClubApi.credentials.ts`.
- Each node lives in its own subdirectory under `nodes/`.
- Icon files sit alongside their node file in the same directory.
- The `dist/` directory is the compiled output; never edit files there directly.

---

## Package Configuration

### package.json Requirements

```jsonc
{
  "name": "n8n-nodes-<package-name>",   // MUST start with "n8n-nodes-" or "@<scope>/n8n-nodes-"
  "version": "1.0.0",                    // Semantic versioning
  "description": "...",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "type": "commonjs",
  "scripts": {
    "build": "tsc",
    "lint": "eslint nodes/**/*.ts index.ts",
    "prepublishOnly": "npm run build && npm run lint"
  },
  "keywords": [
    "n8n",
    "n8n-nodes",
    "n8n-community-node-package"         // REQUIRED keyword for community nodes
  ],
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/<ServiceName>Api.credentials.js"
    ],
    "nodes": [
      "dist/nodes/<NodeName>/<NodeName>.node.js"
    ]
  },
  "peerDependencies": {
    "n8n-workflow": "^1.0.0"             // Always a peer dependency, never a direct dependency
  },
  "engines": {
    "node": ">=20.19 <=24.x"
  },
  "files": [
    "dist",
    "nodes/**/*.svg"                     // Include icon assets
  ]
}
```

### Critical Rules

- `n8n-workflow` is ALWAYS a `peerDependency`, never a regular `dependency`.
- The `"n8n"` section MUST list paths to compiled `.js` files in `dist/`.
- The `"n8n-community-node-package"` keyword is REQUIRED for discovery.
- `"n8nNodesApiVersion": 1` is required.

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2019",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["nodes/**/*.ts", "index.ts"]
}
```

### index.ts (Entry Point)

```typescript
import { MyNode } from "./nodes/MyNode/MyNode.node";
import { MyNodeApi } from "./credentials/MyNodeApi.credentials";

export const nodes = [MyNode];
export const credentials = [MyNodeApi];

export { MyNode } from "./nodes/MyNode/MyNode.node";
export { MyNodeApi } from "./credentials/MyNodeApi.credentials";
```

---

## Node Base File Structure

Every node is a single TypeScript class implementing `INodeType`. The class contains:

1. A `description` property (type `INodeTypeDescription`) defining the node's metadata and UI.
2. An `execute()` method containing the node's runtime logic.
3. Optionally, private helper methods for shared logic.

```typescript
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

export class MyNode implements INodeType {
    description: INodeTypeDescription = {
        // ... node metadata and properties
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // ... node logic
    }
}
```

---

## INodeType Interface

The `INodeType` interface is the contract every node must implement.

### Required Members

| Member        | Type                      | Purpose                                    |
|---------------|---------------------------|--------------------------------------------|
| `description` | `INodeTypeDescription`    | Defines all node metadata, UI, and config  |
| `execute`     | `async (this: IExecuteFunctions) => Promise<INodeExecutionData[][]>` | Runtime logic |

### Optional Members

| Member        | Type                      | Purpose                                    |
|---------------|---------------------------|--------------------------------------------|
| `methods`     | object with `loadOptions` | Dynamic option loading from remote APIs    |
| `webhookMethods` | object                 | For webhook-triggered nodes                |
| `webhook`     | function                  | Webhook handler                            |
| `trigger`     | function                  | For trigger/polling nodes                  |

---

## Description Object

The `description` property defines how the node appears and behaves in the n8n editor.

```typescript
description: INodeTypeDescription = {
    // REQUIRED fields
    displayName: "My Service",           // Human-readable name shown in n8n UI
    name: "myService",                   // Internal camelCase identifier (must be unique)
    group: ["transform"],                // Node category: "transform", "input", "output", "trigger"
    version: 1,                          // Node version (integer, start at 1)
    description: "Interact with My Service API",
    defaults: {
        name: "My Service",             // Default name when node is added to workflow
    },
    inputs: [NodeConnectionTypes.Main],  // Use NodeConnectionTypes enum
    outputs: [NodeConnectionTypes.Main], // Use NodeConnectionTypes enum
    properties: [],                      // Array of INodeProperties (see below)

    // OPTIONAL but recommended fields
    icon: "file:myService.svg",          // Node icon reference
    subtitle: '={{ $parameter["resource"] }} / {{ $parameter["operation"] }}',
    usableAsTool: true,                  // Allow use as AI agent tool
    credentials: [                       // Credential requirements
        {
            name: "myServiceApi",        // Must match credential class name property
            required: true,
        },
    ],
};
```

### Rules for Description

- `name` MUST be unique across all n8n nodes. Use camelCase.
- `displayName` is the human-readable label. Use Title Case.
- `version` MUST be an integer. Start at 1. Increment for breaking changes.
- `inputs` and `outputs` MUST use the `NodeConnectionTypes` enum, not raw strings.
- `subtitle` should show the current resource/operation for user clarity.
- `usableAsTool: true` enables the node as an AI agent tool (recommended).

---

## Properties and INodeProperties

Properties define the configuration UI for the node. Each property is an object
conforming to `INodeProperties`.

### INodeProperties Fields

| Field            | Type      | Required | Description                                              |
|------------------|-----------|----------|----------------------------------------------------------|
| `displayName`    | string    | Yes      | Label shown in the UI (Title Case)                       |
| `name`           | string    | Yes      | Internal identifier (camelCase)                          |
| `type`           | string    | Yes      | UI widget type (see below)                               |
| `default`        | any       | Yes      | Default value                                            |
| `description`    | string    | No       | Help text shown below the field                          |
| `required`       | boolean   | No       | Whether the field is mandatory                           |
| `placeholder`    | string    | No       | Placeholder text in input fields                         |
| `options`        | array     | Cond.    | Required for type "options", "collection", "fixedCollection" |
| `displayOptions` | object    | No       | Conditional visibility rules                             |
| `noDataExpression`| boolean  | No       | Disable expression editor for this field                 |
| `typeOptions`    | object    | No       | Additional type-specific configuration                   |

### Property Types

| Type               | Widget                    | Use Case                                  |
|--------------------|---------------------------|-------------------------------------------|
| `string`           | Text input                | Free text, URLs, identifiers              |
| `number`           | Number input              | Numeric values                            |
| `boolean`          | Toggle switch             | On/off flags                              |
| `options`          | Dropdown select           | Single choice from predefined list        |
| `multiOptions`     | Multi-select dropdown     | Multiple choices from predefined list     |
| `collection`       | Expandable section        | Group of optional fields                  |
| `fixedCollection`  | Fixed group of fields     | Structured groups with named sections     |
| `json`             | JSON editor               | Raw JSON input                            |
| `color`            | Color picker              | Color values                              |
| `dateTime`         | Date/time picker          | Date and time values                      |
| `resourceLocator`  | Resource finder           | Find resources by ID/URL/name             |
| `filter`           | Filter builder            | Complex filter conditions                 |

### displayOptions Pattern

Use `displayOptions` to show/hide properties conditionally:

```typescript
{
    displayName: "Email",
    name: "email",
    type: "string",
    default: "",
    required: true,
    description: "The email address to look up",
    displayOptions: {
        show: {
            resource: ["creator"],          // Show when resource is "creator"
            operation: ["enrichByEmail"],    // AND operation is "enrichByEmail"
        },
    },
}
```

- `show`: property is visible when ALL conditions match (AND logic).
- `hide`: property is hidden when ANY condition matches.
- Conditions are arrays: the field value must match ANY item in the array (OR logic).
- You can reference other property names, including nested ones with `/` prefix
  for parent scope (e.g., `"/advancedFilters.filters.type": ["business"]`).

### typeOptions

Common typeOptions configurations:

```typescript
// Multi-line text area
typeOptions: { rows: 4 }

// Password field (masked input)
typeOptions: { password: true }

// fixedCollection with single set of values
typeOptions: { multipleValues: false }

// fixedCollection allowing multiple entries
typeOptions: { multipleValues: true }

// Number with min/max
typeOptions: { minValue: 0, maxValue: 100 }
```

### Options Array (for type: "options")

Each option in the options array for dropdown properties:

```typescript
options: [
    {
        name: "Get User",           // Display label
        value: "getUser",           // Internal value (camelCase)
        description: "Retrieve a user by ID",
        action: "Get User",         // Action label (for operations)
    },
]
```

- The `action` field is required for operation options. It appears in the n8n UI
  as the action description.

### fixedCollection Pattern

Use `fixedCollection` for structured groups of related fields:

```typescript
{
    displayName: "Additional Options",
    name: "additionalOptions",
    type: "fixedCollection",
    placeholder: "Add options",
    default: {},
    displayOptions: { show: { resource: ["creator"] } },
    options: [
        {
            name: "options",             // Group name
            displayName: "Options",       // Group display name
            values: [                     // Array of INodeProperties within this group
                {
                    displayName: "Include Details",
                    name: "includeDetails",
                    type: "boolean",
                    default: false,
                },
                // ... more properties
            ],
        },
    ],
}
```

Access fixedCollection values in execute():
```typescript
const additionalOptions = (this.getNodeParameter("additionalOptions.options", itemIndex, {}) as IDataObject) || {};
const includeDetails = additionalOptions.includeDetails as boolean;
```

---

## Resource and Operation Pattern

For nodes with multiple resources and operations, use this standard pattern:

### 1. Define the Resource Property (first in properties array)

```typescript
{
    displayName: "Resource",
    name: "resource",
    type: "options",
    noDataExpression: true,       // Disable expressions for resource selector
    options: [
        {
            name: "User",
            value: "user",
            description: "Manage users",
        },
        {
            name: "Post",
            value: "post",
            description: "Manage posts",
        },
    ],
    default: "user",
}
```

### 2. Define Operation Properties (one per resource)

Define a SEPARATE operation property for EACH resource, using `displayOptions`
to show the correct one:

```typescript
// Operations for "user" resource
{
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
        show: { resource: ["user"] },
    },
    options: [
        { name: "Create", value: "create", description: "Create a user", action: "Create a user" },
        { name: "Get", value: "get", description: "Get a user", action: "Get a user" },
        { name: "Delete", value: "delete", description: "Delete a user", action: "Delete a user" },
    ],
    default: "create",
},
// Operations for "post" resource
{
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
        show: { resource: ["post"] },
    },
    options: [
        { name: "Create", value: "create", description: "Create a post", action: "Create a post" },
        { name: "List", value: "list", description: "List all posts", action: "List all posts" },
    ],
    default: "create",
},
```

### 3. Define Operation-Specific Parameters

Each parameter uses `displayOptions` to appear only for its resource/operation:

```typescript
{
    displayName: "User ID",
    name: "userId",
    type: "string",
    required: true,
    default: "",
    displayOptions: {
        show: {
            resource: ["user"],
            operation: ["get", "delete"],
        },
    },
}
```

### Rules

- The `resource` property MUST be the first property in the array.
- Operation properties MUST have `noDataExpression: true`.
- Each operation option MUST include an `action` field.
- Parameters for specific operations MUST use `displayOptions` to scope visibility.
- Use `subtitle: '={{ $parameter["resource"] }} / {{ $parameter["operation"] }}'`
  in the description to show current resource/operation.

---

## The execute() Method

The `execute()` method is the core runtime logic of the node. It processes input
items and returns output items.

### Method Signature

```typescript
async execute(this: IExecuteFunctions) {
    // ...
}
```

- `this` is typed as `IExecuteFunctions` (provided by n8n at runtime).
- The return type is inferred by TypeScript — no need for an explicit annotation.
- Returns a 2D array: outer array = output connectors, inner array = items.
- For a single-output node, return `[outputItems]`.

### Standard execute() Structure

```typescript
async execute(this: IExecuteFunctions) {
    const items = this.getInputData();
    const outputItems: INodeExecutionData[] = [];

    const nodeParams = this.getNode().parameters as IDataObject;
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        try {
            const operation = this.getNodeParameter("operation", itemIndex) as string;

            switch (operation) {
        case "enrichByEmail": {
            const email = this.getNodeParameter("email", itemIndex) as string;
            // ... build body, make API call
            const resp = await this.helpers.httpRequestWithAuthentication.call(
                this, "influencersClubApi", options,
            );
            outputItems.push({ json: resp as IDataObject, pairedItem: { item: itemIndex } });
            break;
        }
        case "anotherOperation": {
            // ... handle another operation
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
```

### Routing Pattern

- Route by `operation` only using a `switch` statement. Do NOT nest by `resource`.
- Resource scoping is handled entirely by `displayOptions` in property definitions,
  so by the time `execute()` runs, each operation value is unique across all resources.
- Use `this.getNode().parameters as IDataObject` when you need to read raw node
  parameters outside the per-item loop (e.g., for static configuration).

### Key Helper Methods

| Method                              | Purpose                                              |
|-------------------------------------|------------------------------------------------------|
| `this.getInputData()`              | Get all input items as `INodeExecutionData[]`        |
| `this.getNodeParameter(name, itemIndex)` | Get parameter value for item at index `itemIndex` |
| `this.getNodeParameter(name, itemIndex, default)` | Get with fallback default value        |
| `this.getNode()`                   | Get current node metadata (name, type)               |
| `this.getWorkflow()`              | Get workflow metadata (name, id)                     |
| `this.getCredentials(type)`        | Get decrypted credentials                            |
| `this.continueOnFail()`           | Check if "Continue On Fail" is enabled               |
| `this.getExecutionId()`           | Get current execution ID                             |
| `this.helpers.httpRequest(options)` | Make unauthenticated HTTP requests                  |
| `this.helpers.httpRequestWithAuthentication(credType, options)` | Authenticated HTTP requests |
| `this.helpers.returnJsonArray(data)` | Convert array to INodeExecutionData[]              |
| `this.helpers.prepareBinaryData(buffer, filename, mimeType)` | Prepare binary data     |
| `this.helpers.assertBinaryData(itemIndex, propertyName)` | Validate & get binary metadata |
| `this.helpers.getBinaryDataBuffer(itemIndex, propertyName)` | Read binary data buffer  |
| `this.helpers.constructExecutionMetaData(data, opts)` | Maintain item linking        |

### Rules for execute()

- ALWAYS iterate over all input items using `this.getInputData()`.
- ALWAYS use `itemIndex` as the loop variable name (not `i`).
- ALWAYS use `outputItems` as the output array name (not `returnData`).
- ALWAYS use `itemIndex` when calling `this.getNodeParameter()`.
- ALWAYS include `pairedItem: { item: itemIndex }` in output items for data linking.
- ALWAYS wrap the main loop body in try/catch for error handling.
- ALWAYS check `this.continueOnFail()` in the catch block.
- ALWAYS return data as `[outputItems]` (array wrapping the items array).
- Route by `operation` using a `switch` statement. Do NOT nest by resource.
- Never use `this.getNodeParameter()` without the item index.
- Omit the explicit return type on `execute()` — let TypeScript infer it.

---

## Credentials

Credentials define how n8n stores and applies authentication.

### Credential File Structure

```typescript
import {
    ICredentialType,
    INodeProperties,
    ICredentialTestRequest,
    IHttpRequestOptions,
    IAuthenticateGeneric,
} from "n8n-workflow";

export class MyServiceApi implements ICredentialType {
    name = "myServiceApi";                    // Internal name (camelCase, must match node credential ref)
    displayName = "My Service API";           // Shown in n8n UI
    documentationUrl = "https://dashboard.myservice.com/api";

    defaults = {
        name: "My Service API",              // Default credential name
    };

    // How n8n applies credentials to HTTP requests
    authenticate: IAuthenticateGeneric = {
        type: "generic",
        properties: {
            headers: {
                Authorization: "=Bearer {{$credentials.apiKey}}",
                "Content-Type": "application/json",
                "X-Origin": "n8n",                    // Identifies request source
                "X-Integration": "myservice-n8n",     // Identifies integration
            },
        },
    };

    // Credential input fields
    properties: INodeProperties[] = [
        {
            displayName: "API Key",
            name: "apiKey",
            type: "string",
            typeOptions: { password: true },   // Masks the input
            default: "",
            required: true,
            description: "Your API key from the service dashboard",
        },
    ];

    // Optional: test the credential with a lightweight API call
    test: ICredentialTestRequest = {
        request: {
            url: "https://api.myservice.com/v1/test-endpoint/",
            method: "POST",
            body: {
                email: "test@example.com",
            },
        },
    };
}
```

### Authentication Types

| Type            | `authenticate` Pattern                                              |
|-----------------|---------------------------------------------------------------------|
| API Key Header  | `headers: { Authorization: "=Bearer {{$credentials.apiKey}}" }`     |
| API Key Query   | `qs: { api_key: "={{$credentials.apiKey}}" }`                       |
| Basic Auth      | `headers: { Authorization: '=Basic {{$credentials.user}}:{{$credentials.password}}' }` |
| Custom Headers  | Add any custom headers needed by the API                            |

### Rules for Credentials

- Credential `name` MUST match the name referenced in the node's `credentials` array.
- Always use `typeOptions: { password: true }` for sensitive fields (API keys, secrets).
- Include a `test` request when possible to validate credentials.
- Include `documentationUrl` pointing to the API's authentication docs.
- The `authenticate` object is automatically applied to all
  `httpRequestWithAuthentication` calls.

---

## API Requests

### Using httpRequestWithAuthentication

This is the PRIMARY method for making API calls. It automatically applies
the credential's `authenticate` configuration.

```typescript
const options = {
    method: "POST" as IHttpRequestMethods,
    url: "https://api.myservice.com/v1/users",
    body: { name: "John", email: "john@example.com" },
    json: true,
};

const response = await this.helpers.httpRequestWithAuthentication.call(
    this,
    "myServiceApi",     // credential type name
    options,
);

outputItems.push({
    json: response as IDataObject,
    pairedItem: { item: itemIndex },
});
```

### Request Options

```typescript
interface IHttpRequestOptions {
    method: IHttpRequestMethods;      // "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    url: string;
    headers?: Record<string, string>;
    qs?: IDataObject;                 // Query string parameters
    body?: IDataObject | string;
    json?: boolean;                   // Parse response as JSON
    encoding?: string;                // For binary responses, use "arraybuffer"
    returnFullResponse?: boolean;     // Return headers + status + body
}
```

### Rules for API Requests

- ALWAYS use `httpRequestWithAuthentication` for authenticated API calls.
- ALWAYS type the method with `as IHttpRequestMethods`.
- ALWAYS set `json: true` for JSON API responses.
- ALWAYS use `encodeURIComponent()` for URL path parameters.
- NEVER hardcode credentials in request options; rely on the authenticate object.
- For non-authenticated calls, use `this.helpers.httpRequest()`.
- EXCEPTION: For multipart/form-data file uploads, use `this.helpers.httpRequest()`
  with manual credentials to avoid Content-Type conflicts (see below).

### Multipart/Form-Data File Upload

When an API expects `multipart/form-data` (e.g., CSV file uploads), the credential's
`Content-Type: application/json` header will override the form-data Content-Type and
cause 415 errors. Use `this.helpers.httpRequest()` with manual credentials instead.

```typescript
import FormData from "form-data";

// 1. Read binary file from input
const binaryPropertyName = this.getNodeParameter("binaryProperty", itemIndex) as string;
const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
const fileName = binaryData.fileName || "file.csv";

// 2. Build FormData with file and string fields
const form = new FormData();
form.append("file", fileBuffer, { filename: fileName, contentType: "text/csv" });
form.append("field_name", "field_value");

// 3. Get credentials manually and send with httpRequest (not httpRequestWithAuthentication)
const credentials = await this.getCredentials("myServiceApi");
const apiKey = credentials.apiKey as string;
const options = {
    method: "POST" as IHttpRequestMethods,
    url: "https://api.myservice.com/upload",
    body: form,
    headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${apiKey}`,
        "X-Origin": "n8n",
        "X-Integration": "myservice-n8n",
    },
};
const resp = await this.helpers.httpRequest(options);
```

#### Why not httpRequestWithAuthentication?

`httpRequestWithAuthentication` applies the credential's `authenticate` headers AFTER
the request headers. If the credential sets `Content-Type: application/json`, it
overrides the `multipart/form-data; boundary=...` header that FormData requires,
causing 415 (Unsupported Media Type) errors. Using `httpRequest` with manual credentials
avoids this conflict.

#### Rules for Form-Data Uploads

- ALWAYS use `import FormData from "form-data"` at the top of the node file.
- ALWAYS use `form.getHeaders()` to get the Content-Type with boundary — never set it manually.
- ALWAYS use `this.helpers.httpRequest()` (NOT `httpRequestWithAuthentication`) for form-data.
- ALWAYS get credentials manually with `this.getCredentials()` and apply headers yourself.
- Use `assertBinaryData()` to validate the binary property exists before reading it.
- Do NOT set `json: true` for form-data requests.

---

## Error Handling

n8n provides two specialized error classes:

### NodeApiError

Use for errors from external API calls and HTTP request failures:

```typescript
throw new NodeApiError(this.getNode(), error as JsonObject);
```

- Wraps HTTP errors with status codes and response bodies.
- Provides structured error display in the n8n UI.
- Use when an API returns an error response.

### NodeOperationError

Use for operational/validation errors within the node logic:

```typescript
throw new NodeOperationError(
    this.getNode(),
    "At least one email is required.",
    { itemIndex },
);
```

- For invalid input, missing parameters, or logical errors.
- Include `{ itemIndex }` to highlight which item caused the error.

### Standard Error Handling Pattern

```typescript
for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
    try {
        // ... node logic
    } catch (error) {
        if (this.continueOnFail()) {
            // Return error as data so workflow can continue
            outputItems.push({
                json: { error: (error as Error).message } as IDataObject,
                pairedItem: { item: itemIndex },
            });
        } else {
            // Re-throw as NodeApiError for proper n8n error display
            throw new NodeApiError(this.getNode(), error as JsonObject);
        }
    }
}
```

### Rules

- ALWAYS check `this.continueOnFail()` in catch blocks.
- ALWAYS include `pairedItem` in error output items.
- Use `NodeOperationError` for input validation (before API calls).
- Use `NodeApiError` for API/network errors (after API calls fail).
- ALWAYS cast errors: `error as JsonObject` for NodeApiError,
  `(error as Error).message` for continueOnFail output.
- Include `{ itemIndex }` in NodeOperationError for item-level error highlighting.

---

## Binary Data

When your node handles files (downloads, uploads, transformations):

### Downloading Files (Creating Binary Output)

```typescript
// 1. Make request to get file buffer
const response = await this.helpers.httpRequestWithAuthentication.call(
    this,
    "myServiceApi",
    {
        method: "GET",
        url: `https://api.myservice.com/files/${fileId}`,
        encoding: "arraybuffer",          // Important: get raw buffer
        returnFullResponse: true,         // To access headers for mime type
    },
);

// 2. Prepare binary data
const binaryData = await this.helpers.prepareBinaryData(
    Buffer.from(response.body as Buffer),
    "filename.pdf",                       // filename
    "application/pdf",                    // MIME type
);

// 3. Return with binary property
outputItems.push({
    json: {} as IDataObject,
    binary: {
        data: binaryData,                // "data" is the default binary property name
    },
    pairedItem: { item: itemIndex },
});
```

### Reading Binary Input

```typescript
// 1. Validate binary data exists and get metadata (fileName, mimeType)
const binaryPropertyName = "data";       // Default binary property name
const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);

// 2. Get binary data as a Buffer
const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

// 3. Access file metadata
const fileName = binaryData.fileName || "fallback.csv";
const mimeType = binaryData.mimeType || "text/csv";
```

### Rules

- Use `encoding: "arraybuffer"` when downloading binary content.
- Always use `this.helpers.prepareBinaryData()` to package binary data.
- Always use `this.helpers.assertBinaryData()` to validate binary input exists.
- Always use `this.helpers.getBinaryDataBuffer()` to read binary input as a Buffer.
- The default binary property name is `"data"`.
- Include proper MIME types and filenames.
- For multipart/form-data file uploads, see the "Multipart/Form-Data File Upload"
  section under API Requests.

---

## Pagination

When an API returns paginated results, implement pagination to fetch all pages
or respect the user's limit.

### Offset-Based Pagination

```typescript
const limit = this.getNodeParameter("limit", itemIndex, 50) as number;
const returnAll = this.getNodeParameter("returnAll", itemIndex, false) as boolean;

let page = 0;
const allResults: IDataObject[] = [];

do {
    const body: IDataObject = {
        paging: { limit: returnAll ? 100 : limit, page },
    };

    const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        "myServiceApi",
        { method: "POST", url: apiUrl, body, json: true },
    );

    const results = (response as IDataObject).data as IDataObject[];
    allResults.push(...results);

    if (!returnAll || results.length < (returnAll ? 100 : limit)) {
        break;
    }
    page++;
} while (returnAll);

// Push results
for (const result of allResults) {
    outputItems.push({ json: result, pairedItem: { item: itemIndex } });
}
```

### Cursor-Based Pagination

```typescript
let cursor: string | undefined;
const allResults: IDataObject[] = [];

do {
    const qs: IDataObject = { limit: 100 };
    if (cursor) qs.cursor = cursor;

    const response = await this.helpers.httpRequestWithAuthentication.call(
        this,
        "myServiceApi",
        { method: "GET", url: apiUrl, qs, json: true },
    );

    const data = response as IDataObject;
    allResults.push(...(data.results as IDataObject[]));
    cursor = data.next_cursor as string | undefined;
} while (cursor);
```

### Rules

- Provide a `limit` parameter so users can control result count.
- Consider providing a `returnAll` boolean for fetching all pages.
- Always handle the last page correctly (fewer results than limit).
- Use the pagination method matching the API (offset, cursor, page number).

---

## TypeScript Standards

### Imports

Always import n8n types explicitly from `n8n-workflow`:

```typescript
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
```

### Type Safety

- Enable `"strict": true` in tsconfig.json.
- Always cast `getNodeParameter()` results to their expected type.
- Use `as IDataObject` for API response objects.
- Use `as string`, `as number`, `as boolean` for primitive parameters.
- Prefer `??` (nullish coalescing) over `||` for defaults that might be `0` or `""`.
- Use `!= null` or `!== undefined` checks for optional numeric values that might be `0`.

### Type Patterns

```typescript
// Getting parameters with proper typing
const name = this.getNodeParameter("name", itemIndex) as string;
const limit = this.getNodeParameter("limit", itemIndex, 10) as number;
const active = this.getNodeParameter("active", itemIndex) as boolean;

// Handling fixedCollection values
const additionalOptions = (this.getNodeParameter("additionalOptions.options", itemIndex, {}) as IDataObject) || {};
const value = (additionalOptions.someField as string) ?? "default";

// API response typing
const response = await this.helpers.httpRequestWithAuthentication.call(
    this, "influencersClubApi", requestOptions,
);
const data = response as IDataObject;

// Handling arrays from fixedCollections
const items = this.getNodeParameter("items.values", itemIndex, []) as IDataObject[];
```

### Coding Style

- Use tabs for indentation.
- Use double quotes for strings.
- Use semicolons.
- Use trailing commas in multi-line structures.
- Use `const` by default, `let` only when reassignment is needed, never `var`.
- Prefer `for...of` over `forEach` for iteration.
- Use template literals for string interpolation.
- Use early returns to reduce nesting.

---

## Naming Conventions

### Package Names

- Format: `n8n-nodes-<package-name>` or `@<scope>/n8n-nodes-<package-name>`
- Use lowercase with hyphens: `n8n-nodes-influencersclub`

### Node Names

| Context          | Convention   | Example                    |
|------------------|-------------|----------------------------|
| Class name       | PascalCase  | `InfluencersClub`          |
| `name` property  | camelCase   | `influencersClub`          |
| `displayName`    | Title Case  | `Influencers Club`         |
| Filename         | PascalCase  | `InfluencersClub.node.ts`  |

### Credential Names

| Context          | Convention   | Example                          |
|------------------|-------------|----------------------------------|
| Class name       | PascalCase  | `InfluencersClubApi`             |
| `name` property  | camelCase   | `influencersClubApi`             |
| `displayName`    | Title Case  | `Influencers Club API`           |
| Filename         | PascalCase  | `InfluencersClubApi.credentials.ts` |

### Property Names

| Context          | Convention   | Example                    |
|------------------|-------------|----------------------------|
| `name` field     | camelCase   | `emailRequired`            |
| `displayName`    | Title Case  | `Email Required`           |
| API field keys   | snake_case  | `email_required`           |
| Resource values  | camelCase   | `batchEnrichment`          |
| Operation values | camelCase   | `enrichByEmail`            |

---

## Icons and Assets

### Icon Requirements

- **Format**: SVG preferred; PNG also accepted.
- **Size**: SVG should be designed at 60x60px viewport.
- **Color**: Should work on both light and dark backgrounds.
- **File location**: Same directory as the node file.
- **Naming**: `<nodeName>.svg` (camelCase matching the node name property).
- **Reference**: `icon: "file:myService.svg"` in the description object.

### Icon Reference in Description

```typescript
icon: "file:influencersClub.svg",
```

The `file:` prefix tells n8n to look for the icon file alongside the node file.

---

## Versioning

### Package Versioning

- Use semantic versioning (semver): `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes to node behavior or API
- MINOR: New features, new operations, new resources
- PATCH: Bug fixes, documentation improvements

### Node Versioning

- The `version` field in the description is an integer (not semver).
- Start at `1`.
- Increment when making breaking changes to the node's parameter structure.
- n8n supports multiple node versions running simultaneously.
- When incrementing, you can keep backward compatibility by supporting
  both old and new parameter structures.

---

## Testing

### Local Testing

1. Build the project: `npm run build`
2. Link the package: `npm link` in the project root
3. In your n8n installation: `npm link n8n-nodes-<package-name>`
4. Restart n8n and test the node in workflows.

### Test Checklist

- [ ] Node appears in n8n editor with correct icon and name
- [ ] All resources and operations are selectable
- [ ] All parameters render correctly with proper display options
- [ ] Credentials can be created and tested
- [ ] Each operation produces correct API requests
- [ ] Error handling works (both continue-on-fail and stop-on-error)
- [ ] Input/output data linking is correct (pairedItem)
- [ ] Edge cases: empty input, invalid parameters, API errors
- [ ] Subtitle shows current resource/operation
- [ ] Node works as an AI agent tool (if usableAsTool is true)

### Automated Testing

- Use Jest for unit tests.
- Test both happy paths and error cases.
- Mock HTTP requests to test node logic without hitting real APIs.

---

## Linting

### ESLint Configuration

Use `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` for linting:

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint
```

Run linting:
```bash
npm run lint        # View issues (runs: eslint nodes/**/*.ts index.ts)
```

### Rules

- Fix all lint errors before publishing.
- The linter runs automatically in `prepublishOnly`.
- Strict mode is required for n8n Cloud verification.

---

## Building and Publishing

### Build

```bash
npm run build       # Compiles TypeScript to dist/
```

### Pre-publish Checks

1. `npm run build` succeeds without errors.
2. `npm run lint` passes with no errors.
3. Version in package.json is incremented.
4. All files listed in `"files"` are present.
5. The `"n8n"` section paths point to correct dist files.

### Publish

```bash
npm publish         # Publishes to npm (runs prepublishOnly automatically)
```

### Rules

- ALWAYS run `build` and `lint` before publishing.
- ALWAYS increment the version number.
- NEVER publish with lint errors.
- NEVER include `node_modules` in the published package.
- The `"files"` field in package.json controls what gets published.

---

## Code Organization for Complex Nodes

For nodes with many resources and operations, split code into modules:

### Recommended Split Structure

```
nodes/
  MyNode/
    MyNode.node.ts              # Main node class (description + execute router)
    actions/
      user/
        create.ts               # User create operation
        get.ts                  # User get operation
        index.ts                # Exports all user operations
      post/
        create.ts               # Post create operation
        list.ts                 # Post list operation
        index.ts
    descriptions/
      UserDescription.ts        # INodeProperties[] for user resource
      PostDescription.ts        # INodeProperties[] for post resource
    helpers/
      apiHelpers.ts             # Shared API request helpers
      filterHelpers.ts          # Filter building utilities
    myNode.svg
```

### Property Definition in Separate Files

```typescript
// descriptions/UserDescription.ts
import { INodeProperties } from "n8n-workflow";

export const userOperations: INodeProperties[] = [
    {
        displayName: "Operation",
        name: "operation",
        type: "options",
        noDataExpression: true,
        displayOptions: { show: { resource: ["user"] } },
        options: [
            { name: "Create", value: "create", action: "Create a user" },
            { name: "Get", value: "get", action: "Get a user" },
        ],
        default: "create",
    },
];

export const userFields: INodeProperties[] = [
    {
        displayName: "User ID",
        name: "userId",
        type: "string",
        required: true,
        default: "",
        displayOptions: { show: { resource: ["user"], operation: ["get"] } },
    },
];
```

### Static Helper Methods

For shared logic like filter building, use static methods on the node class
or extract into separate utility files:

```typescript
export class MyNode implements INodeType {
    // Static helper accessible in execute() without "this" context issues
    private static buildFilters(
        ctx: IExecuteFunctions,
        itemIndex: number,
    ): IDataObject {
        // ... build API filter object from node parameters
        return filters;
    }

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Call static helper
        const filters = MyNode.buildFilters(this, itemIndex);
    }
}
```

### Rules for Complex Nodes

- Keep the main node file focused on description and execute routing.
- Extract property definitions into separate files for readability.
- Use static methods or helper modules for shared logic.
- Group related operations by resource.
- When the node file exceeds ~500 lines, consider splitting.

---

## Common Pitfalls

### 1. Forgetting pairedItem

Always include `pairedItem: { item: itemIndex }` in output items. Without it, data
linking breaks and downstream nodes cannot reference the correct source item.

### 2. Missing continueOnFail Check

Every try/catch in execute() MUST check `this.continueOnFail()`. Without this,
the "Continue On Fail" workflow setting has no effect.

### 3. Using || Instead of ?? for Defaults

```typescript
// BAD: if value is 0 or "", this uses the fallback
const limit = options.limit || 10;

// GOOD: only uses fallback for null/undefined
const limit = (options.limit as number) ?? 10;
```

### 4. Not Encoding URL Parameters

```typescript
// BAD: breaks if batchId contains special characters
url: `https://api.example.com/batch/${batchId}/`

// GOOD: safely encodes the parameter
url: `https://api.example.com/batch/${encodeURIComponent(batchId)}/`
```

### 5. Forgetting to Cast getNodeParameter Results

```typescript
// BAD: type is unknown/any
const email = this.getNodeParameter("email", itemIndex);

// GOOD: properly typed
const email = this.getNodeParameter("email", itemIndex) as string;
```

### 6. n8n-workflow as Direct Dependency

```jsonc
// BAD: will cause version conflicts
"dependencies": { "n8n-workflow": "^1.0.0" }

// GOOD: n8n provides it at runtime
"peerDependencies": { "n8n-workflow": "^1.0.0" }
```

### 7. Modifying Input Items Directly

```typescript
// BAD: mutates input data
items[itemIndex].json.newField = "value";

// GOOD: create new output items
outputItems.push({
    json: { ...items[itemIndex].json, newField: "value" } as IDataObject,
    pairedItem: { item: itemIndex },
});
```

### 8. Returning Wrong Data Shape

```typescript
// BAD: returns flat array
return outputItems;

// GOOD: wraps in outer array (one per output connector)
return [outputItems];
```

### 9. Credential Content-Type Overriding Form-Data

If the credential's `authenticate` sets `Content-Type: application/json`, it will
override the `multipart/form-data; boundary=...` header needed for file uploads,
causing 415 errors. The credential headers are applied AFTER request headers by
`httpRequestWithAuthentication`.

```typescript
// BAD: credential's Content-Type: application/json overrides form-data
const options = {
    method: "POST" as IHttpRequestMethods,
    url: "https://api.example.com/upload",
    body: form,
    headers: form.getHeaders(),  // Gets overridden by credential!
};
await this.helpers.httpRequestWithAuthentication.call(this, "myApi", options);

// GOOD: use httpRequest with manual credentials for form-data uploads
const credentials = await this.getCredentials("myApi");
const options = {
    method: "POST" as IHttpRequestMethods,
    url: "https://api.example.com/upload",
    body: form,
    headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${credentials.apiKey}`,
    },
};
await this.helpers.httpRequest(options);
```

---

## Quick Reference: Imports Cheat Sheet

```typescript
// Node development essentials
import {
    INodeType,                    // Interface your node class implements
    INodeTypeDescription,         // Type for the description property
    IExecuteFunctions,            // Type for "this" in execute()
    IHttpRequestMethods,          // "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    IDataObject,                  // Generic key-value object type
    INodeExecutionData,           // Single item in input/output
    NodeApiError,                 // Error class for API failures
    NodeOperationError,           // Error class for logic/validation failures
    NodeConnectionTypes,          // Enum for input/output connection types
    JsonObject,                   // JSON-compatible object type
} from "n8n-workflow";

// Credential development essentials
import {
    ICredentialType,              // Interface your credential class implements
    INodeProperties,              // Type for credential property definitions
    ICredentialTestRequest,       // Type for credential test configuration
    IHttpRequestOptions,          // Type for HTTP request options
    IAuthenticateGeneric,         // Type for generic authentication config
} from "n8n-workflow";

// For multipart/form-data file uploads
import FormData from "form-data"; // Available via n8n's transitive dependencies
```

---

## Quick Reference: Common Patterns

### Comma-Separated String to Array

```typescript
const commaToArray = (v: unknown): string[] | undefined =>
    typeof v === "string"
        ? String(v).split(",").map((k: string) => k.trim()).filter(Boolean)
        : undefined;
```

### Safe Parameter Extraction from fixedCollection

```typescript
const getParam = (path: string, fallback: unknown = {}): IDataObject => {
    const raw = this.getNodeParameter(path, itemIndex, fallback) as IDataObject | IDataObject[];
    return (Array.isArray(raw) && raw.length ? raw[0] : raw) as IDataObject;
};
```

### Conditional Filter Building

```typescript
const filters: IDataObject = {};
if (minValue || maxValue) {
    filters.range = { min: minValue || null, max: maxValue || null };
}
if (commaToArray(keywords)) {
    filters.keywords = commaToArray(keywords);
}
```
