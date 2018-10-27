import * as forRoot from "./admin.actions";
import { AdminState } from "./admin.state";

const initialState: AdminState = {
    user: null,
    companies: null,
    resourceGroups: null,
    resourceProjects: null,
    resourceGroupId:null
};

export function adminReducer(state: AdminState = initialState, action: forRoot.AdminAction): AdminState {
 
    switch (action.type) {
        case forRoot.SET:
            return {
                ...state,
                user:action.user
            };

        case forRoot.GET:
            return {
                ...state
            };      
        case forRoot.SELECT_COMPANIES:
            return {
                ...state
            };  
        case forRoot.SELECT_COMPANIES_COMPLEATED:
            return {
                ...state,
                companies:action.companies
            };  
        case forRoot.SELECT_RESORCE_GROUPS:
            return {
                ...state
            };
        case forRoot.SELECT_RESORCE_GROUPS_COMPLEATED:
            return {
                ...state,
                resourceGroups: action.resourceGroups
            };  
        case forRoot.SELECT_RESORCE_PROJECTS:
            return {
                ...state,
                resourceGroupId:action.resourceGroupId
            };
        case forRoot.SELECT_RESORCE_PROJECTS_COMPLEATED:
            return {
                ...state,
                resourceProjects: action.resourceProjects
            };  
        default:
            return state;
    }
}
