import { SIGN_IN, SIGN_OUT } from '../constants/actionTypes';

export function signin(token) {
    return {
        type: SIGN_IN,
        payload: token
    }
}

export function signout() {
    return {
        type: SIGN_OUT
    }
}
