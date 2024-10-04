import React, { useEffect, useRef } from "react"

const ChatBody = ({ messages }) => {
	const messagesEndRef = useRef(null);  	
  	const scrollToBottom = () => {
    	messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  	};
  	useEffect(scrollToBottom, [messages]);
	
	return(
		<div className='chat-body'>
			<div className='bubble-container'>
	    		<div  className='inline immy-bubble'>
					Hi! My name is Immy
	    		</div>
	    	</div>
			{ messages.map((message, index) => (
				<>
				{message?.role == 'assistant' ? (
					<div className='bubble-container' key={index + 1}>
						<div className='inline immy-bubble'>
							{message.content}
						</div>
					</div>
					) : (
					<div className='bubble-container' key={index + 1}>
						<div className='inline immy-myBubble'>
							{message.content}
						</div>
					</div>
					)
				}
				</>
		    ))}
		    <div ref={messagesEndRef} />
		</div>
	)
}

export default ChatBody