import { User, Company, ResourceGroup, Resource } from "../model/interfaces"
export interface AdminState {
    user: User;
    companies: Company[];
    resourceGroups: ResourceGroup[];
    resourceProjects: Resource[];
    resourceGroupId:number;
}
