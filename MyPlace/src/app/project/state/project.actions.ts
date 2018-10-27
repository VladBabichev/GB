import { Action } from "@ngrx/store";

import { ProjectsState } from "./project.state";

export const SAVE_SELECTED_PROJECT = "PROJECTSSTATE: SAVE_SELECTED_PROJECT";
export const GET_SELECTED_PROJECT = "PROJECTSSTATE: GET_SELECTED_PROJECT";

export class SaveSelectedProject implements Action {
    readonly type = SAVE_SELECTED_PROJECT;

    constructor(public selectedProjects: number[]) {
    }
}
export class GetSelectedProject implements Action {
    readonly type = GET_SELECTED_PROJECT;

    constructor(public selectedProjects: number[]) {
    }
}
export type ProjectsAction
    = SaveSelectedProject
    | GetSelectedProject;
    



