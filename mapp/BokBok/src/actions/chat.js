import { LOAD_CONVERSATION_LIST, UPDATE_CONVERSATION_LIST } from '../constants/actionTypes';

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
