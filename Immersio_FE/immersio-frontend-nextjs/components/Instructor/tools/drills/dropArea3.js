import React from 'react'

function dropArea(props) {
	const drop = e => {
		e.preventDefault()
		//If DA exists, continue
		const card_id = e.dataTransfer.getData('card_id')
		let findItem = props.list.findIndex( i => i.draggable == e.target.id)
		if(findItem >= 0) {
			props.list[findItem].answer = card_id
			//console.log(props.draggables)
			findItem = props.draggables.findIndex( answ => answ == card_id)
			props.draggables.splice(findItem, 1)
			props.setDraggables([...props.draggables])
			//props.setDropArea([...props.dropArea])
		}
		//const card = document.getElementById(card_id)
		//console.log("Card",card)
		//console.log("Target",e.target.id)
	}

	const dragOver = e => {
		e.preventDefault()
	}

	return(
		<div id={props.id} onDrop={drop} onDragOver={dragOver} className={props.className} style={props.style}>
			{ props.children }
		</div>
	)
}

export default dropArea