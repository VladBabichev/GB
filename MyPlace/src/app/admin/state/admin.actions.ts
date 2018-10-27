import { Action } from "@ngrx/store";
import { User,Company,ResourceGroup,Resource } from "../model/interfaces";

export const SET = "ADMIN: SET";
export const GET = "ADMIN: GET";
export const SELECT_COMPANIES = "ADMIN: SELECT_COMPANIES";
export const SELECT_COMPANIES_COMPLEATED = "ADMIN: SELECT_COMPANIES_COMPLEATED";
export const REFRESH_FAILED = "ADMIN: REFRESH_FAILED";
export const END_REFRESH = "ADMIN: END_REFRESH";
export const SELECT_RESORCES = "ADMIN: SELECT_RESORCES";
export const SELECT_RESORCES_COMPLEATED = "ADMIN: SELECT_RESORCES_COMPLEATED";
export const SELECT_RESORCE_GROUPS = "ADMIN: SELECT_RESORCE_GROUPS";
export const SELECT_RESORCE_GROUPS_COMPLEATED = "ADMIN: SELECT_RESORCE_GROUPS_COMPLEATED";
// resources
export const SELECT_RESORCE_PROJECTS = "ADMIN: SELECT_RESORCE_PROJECTS";
export const SELECT_RESORCE_PROJECTS_COMPLEATED = "ADMIN: SELECT_RESORCE_PROJECTS_COMPLEATED";
export const GET_CURRENT_RESOURCE_GROUP_ID = "ADMIN: GET_CURRENT_RESOURCE_GROUP_ID";

export class Get implements Action {
    readonly type = GET;
}

export class Set implements Action {
    readonly type = SET;

    constructor(public user: User) {
    }
}
export class SelectCompanies implements Action {
    readonly type = SELECT_COMPANIES;

    constructor(public companies: Company[]) {
    }
}

export class SelectCompaniesCompleated implements Action {
    readonly type = SELECT_COMPANIES_COMPLEATED;
    constructor(public companies: Company[]) {
    }
}

export class RefreshFailed implements Action {
    readonly type = REFRESH_FAILED;

    constructor(public error: any) {
    }
}
export class EndRefresh implements Action {
    readonly type = END_REFRESH;

    constructor(public companies: Company[]) {
    }
}

export class SelectResouceGroups implements Action {
    readonly type = SELECT_RESORCE_GROUPS;

    constructor(public resourceGroups: ResourceGroup[]) {
    }
}
export class SelectResouceGroupsCompleated implements Action {
    readonly type = SELECT_RESORCE_GROUPS_COMPLEATED;
    constructor(public resourceGroups: ResourceGroup[]) {
    }
}
export class SelectResouceProjects implements Action {
    readonly type = SELECT_RESORCE_PROJECTS;

    constructor(public resourceGroupId: number) {
    }
}
export class SelectResouceProjectsCompleated implements Action {
    readonly type = SELECT_RESORCE_PROJECTS_COMPLEATED;
    constructor(public resourceProjects: Resource[]) {
    }
}

export type AdminAction
    = Get
    | Set
    | RefreshFailed
    | SelectCompaniesCompleated
    | SelectCompanies
    | EndRefresh
    | SelectResouceGroups
    | SelectResouceGroupsCompleated
    | SelectResouceProjects
    | SelectResouceProjectsCompleated;
    
