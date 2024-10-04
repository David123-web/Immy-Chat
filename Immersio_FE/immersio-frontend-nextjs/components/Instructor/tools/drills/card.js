import React from 'react'

const Card = (props) => {

	const dragStart = e => {
		const target = e.target
		e.dataTransfer.setData('card_id', target.id)
		/*setTimeout(() => {
			target.style.display='none'
		}, 0)*/
	}

	const dragOver = e => {
		e.stopPropagation()
		//console.log(e)
		const target = e.target
		target.style.display='block'
	}

	return(
		<div id={props.id} draggable={props.draggable} onDragStart={dragStart} onDragOver={dragOver} className={props.className} style={props.style}>
			{ props.content }
		</div>
	)
}

export default Card