import * as forRoot from "../../state";
const initialState = {
    uploading: false,
    percentDone: 0,
    error: null
};
export function feedbackReducer(state = initialState, action) {
    switch (action.type) {
        case forRoot.SEND_FEEDBACK:
            return Object.assign({}, state, { uploading: true, percentDone: 0, error: null });
        case forRoot.SEND_FEEDBACK_PROGRESS:
            return Object.assign({}, state, { percentDone: action.percentDone });
        case forRoot.SEND_FEEDBACK_SUCCEEDED:
            return Object.assign({}, state, { uploading: false });
        case forRoot.SEND_FEEDBACK_FAILED:
            return Object.assign({}, state, { uploading: false, error: action.error });
        default:
            return state;
    }
}
//# sourceMappingURL=feedback.reducer.js.map