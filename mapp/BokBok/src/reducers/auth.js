import { SIGN_IN, SIGN_OUT } from '../constants/actionTypes';
const initialState = {
    token: ''
};
const authReducer = (state = initialState, action) => {

    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                token: action.payload
            };
        case SIGN_OUT:
            return {
                ...state,
                token: ''
            }
        default:
            return state;
    }
}

export default authReducer;
