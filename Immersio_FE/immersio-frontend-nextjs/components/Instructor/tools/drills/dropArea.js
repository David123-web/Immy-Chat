import React from 'react'
import { useState } from 'react'
import { Image} from 'antd';

function dropArea(props) {
	const [ hasInfo, setHasInfo] = useState(false)
	const [ backG, setBackG] = useState('#956424')
	const [ answer, setAnswer] = useState('')
	const [ current, setCurrent] = useState('')

	const drop = e => {
		e.preventDefault()
		let counter = props.counter
		const card_id = e.dataTransfer.getData('card_id')
		const card = document.getElementById(card_id)
		if(hasInfo) {
			//Take back to the list 
			setTimeout(() => {
				current.style.display='block'
			}, 0)
			counter = counter+1
		}
		setTimeout(() => {
			card.style.display='none'
		}, 0)
		setAnswer(card_id)
		setCurrent(card)
		setHasInfo(true)
		counter = counter-1
		props.setCounter(counter)

		//console.log(card_id)
		checkAnswers(card_id)

		console.log(props.list)
		if(counter <= (props.list.length*-1)){
			props.setAnswered(true)
		}
	}

	const checkAnswers = (answ) => {
		//console.log(props.id+ '==' +answ)
		console.log(props.counter)
		if(props.id == answ){
			setBackG('#D5FFD5') 
		} else {
			setBackG('pink')
		}
	}

	const dragOver = e => {
		e.preventDefault()
	}

	return(
		<>
		{
			props.answered ? (
				<div onDrop={drop} onDragOver={dragOver} className={props.className} style={props.style}>
					{
						props.image && 
						<Image width={150} height={150} preview={false} src={props.image} style={{position:'absolute'}}/>

					}
					{ hasInfo &&
						<div style={{background:backG,color:'#956424',textAlign:'center',borderRadius:3,width:'98%',height:37,display: 'flex', justifyContent: 'center', alignItems: 'center',position:'absolute'}}>
							<span>{ answer.replace('/*/*ID:','') }</span>
						</div>
					}
				</div>
				) : (
				<div onDrop={drop} onDragOver={dragOver} className={props.className} style={props.style}>
					{
						props.image && 
						<Image width={150} height={150} preview={false} src={props.image}/>

					}
					{ hasInfo &&
						<div style={{background:'#ddd',color:'#956424',textAlign:'center',borderRadius:3,width:'98%',height:'98%',display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
							<span>{ answer.replace('/*/*ID:','') }</span>
						</div>
					}
				</div>
			)
		}
		</>
	)
}

export default dropArea