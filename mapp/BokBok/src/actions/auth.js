import { SIGN_IN, SIGN_OUT, RESTORE_TOKEN } from '../constants/actionTypes';

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

export function restore_token(token) {
    return {
        type: RESTORE_TOKEN,
        payload: token
    }
}
