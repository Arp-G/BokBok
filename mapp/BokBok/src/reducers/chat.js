import { LOAD_CONVERSATION_LIST, UPDATE_CONVERSATION_LIST } from '../constants/actionTypes';
const initialState = {
    loadingConversaions: false,
    conversations: []
};
const chatReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_CONVERSATION_LIST:
            return {
                ...state,
                conversations: action.payload
            }
        case UPDATE_CONVERSATION_LIST:
            console.log("PAYLOAD: " ,action.payload);
            return {
                ...state,
                conversations: state.conversations.map(conversation =>
                    conversation.conversation_id == action.payload.conversation_id
                        ? {
                            ...conversation,
                            unseen_message_count: conversation.unseen_message_count + 1,
                            last_message: action.payload.conversation.last_message,
                            sender_name: action.payload.conversation.sender_name
                        }
                        : conversation)
            }
        default:
            return state;
    }
}

export default chatReducer;
