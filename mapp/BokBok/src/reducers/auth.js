import { SIGN_IN, SIGN_OUT, RESTORE_TOKEN } from '../constants/actionTypes';
const initialState = {
    token: null,
    isLoading: true
};
const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case RESTORE_TOKEN:
            return {
                ...state,
                token: action.payload,
                isLoading: false
            }
        case SIGN_IN:
            return {
                ...state,
                token: action.payload
            };
        case SIGN_OUT:
            return {
                ...state,
                token: null
            }
        default:
            return state;
    }
}

export default authReducer;
