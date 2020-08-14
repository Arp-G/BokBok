import { SET_SOCKET, LOAD_CONVERSATION_LIST, UPDATE_CONVERSATION_LIST } from '../constants/actionTypes';

export function set_socket(socket) {
    console.log("SET SOCKET WAS CALLED WITH", socket)
    return {
        type: SET_SOCKET,
        payload: { socket }
    }
}

export function load_conversations(conversations) {
    return {
        type: LOAD_CONVERSATION_LIST,
        payload: conversations
    }
}

export function update_conversation(conversation) {
    return {
        type: UPDATE_CONVERSATION_LIST,
        payload: { conversation }
    }
}
