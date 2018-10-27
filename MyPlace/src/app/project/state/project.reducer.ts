import * as forRoot from "./project.actions";
import { ProjectsState } from "./project.state";

const initialState: ProjectsState = {
    selectedProjects:[]
};

export function projectsReducer(state: ProjectsState = initialState, action: forRoot.ProjectsAction): ProjectsState {
    //console.log("reducer:",state);
    //alert("reducer");
    switch (action.type) {
        case forRoot.SAVE_SELECTED_PROJECT:
            return {   
                ...state,
                selectedProjects:state.selectedProjects
            };
        case forRoot.GET_SELECTED_PROJECT:
            return {
                ...state
            };
        default:
            return state;
    }
}
