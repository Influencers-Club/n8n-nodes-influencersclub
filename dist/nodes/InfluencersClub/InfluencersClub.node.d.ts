import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData, INodePropertyOptions, ILoadOptionsFunctions } from "n8n-workflow";
export declare class InfluencersClub implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getLanguages(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getYtTopics(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getGames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getBrands(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getAudienceInterests(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getAudienceLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getAudienceBrandNames(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getAudienceBrandCategories(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getLocations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    private static buildApiFilters;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
