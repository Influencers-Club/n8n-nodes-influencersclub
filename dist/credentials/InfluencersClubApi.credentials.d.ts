import { ICredentialType, INodeProperties, ICredentialTestRequest, IAuthenticateGeneric } from "n8n-workflow";
export declare class InfluencersClubApi implements ICredentialType {
    name: string;
    displayName: string;
    documentationUrl: string;
    defaults: {
        name: string;
    };
    authenticate: IAuthenticateGeneric;
    properties: INodeProperties[];
    test: ICredentialTestRequest;
}
