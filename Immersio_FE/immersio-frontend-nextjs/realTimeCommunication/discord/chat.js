
export const updateDirectChatHistoryIfActive = (data, dispatch) => {
	const { participants, messages } = data
	let chosenChatDetails = JSON.parse(window.localStorage.getItem('choosenChatDetails'))
	let userDetails = JSON.parse(window.localStorage.getItem('user'))
	// find id of user from token and id from active conversation
  	const receiverId = chosenChatDetails?.id;
  	const userId = userDetails._id;

  	if (receiverId && userId) {
	    const usersInCoversation = [receiverId, userId];
	    updateChatHistoryIfSameConversationActive({
	      participants,
	      usersInCoversation,
	      messages,
	      dispatch
	    });
  	}
}

const updateChatHistoryIfSameConversationActive = ({
  	participants,
  	usersInCoversation,
  	messages,
  	dispatch
}) => {
  	const result = participants.every(function (participantId) {
    	return usersInCoversation.includes(participantId);
  	});

  	if (result) {
		dispatch({
                type: "UPDATE_DISCORD_CONVERSATION",
                payload: messages,
        })
        window.localStorage.setItem("discordMessages", messages)
  	}
};