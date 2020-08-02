import { SIGN_IN, SIGN_OUT, RESTORE_TOKEN } from '../constants/actionTypes';

export function signin(token, id) {
    return {
        type: SIGN_IN,
        payload: { token, id }
    }
}

export function signout() {
    return {
        type: SIGN_OUT
    }
}

export function restore_token(token, id) {
    return {
        type: RESTORE_TOKEN,
        payload: { token, id }
    }
}
