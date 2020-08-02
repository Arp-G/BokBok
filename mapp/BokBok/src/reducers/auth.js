import { SIGN_IN, SIGN_OUT, RESTORE_TOKEN } from '../constants/actionTypes';
const initialState = {
    id: null,
    token: null,
    isLoading: true
};
const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case RESTORE_TOKEN:
            return {
                ...state,
                token: action.payload.token,
                id: action.payload.id,
                isLoading: false
            }
        case SIGN_IN:
            return {
                ...state,
                token: action.payload.token,
                id: action.payload.id
            };
        case SIGN_OUT:
            return {
                ...state,
                token: null,
                id: null
            }
        default:
            return state;
    }
}

export default authReducer;
