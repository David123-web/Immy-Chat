import { useState } from 'react'

const Choice = (props) => {
	const [backG, setBackG] = useState('#fff')

	const clicked = (answ) => {
		//console.log(answ)
		if(answ && !props.answered){
			setBackG('#D5FFD5') 
		} else if(!answ && !props.answered) {
			setBackG('#FFC9C9')
		}
		props.setAnswered(true)
	}

	const mouseInteraction = (color) => {
		//console.log(props.answered)
		if(!props.answered) {
			setBackG(color)
		}
	}

	return(
		<div className='d-flex align-items-start justify-content-center' onClick={e=>clicked(props.answer)} style={{backgroundColor:backG,maxWidth:300,minWidth:250,borderRadius:5,marginBottom:10,cursor:'pointer',boxShadow:"1px 3px 1px #00000029",textAlign:'center',padding:10,border:'0.5px solid #00000029'}}
		onMouseEnter={e=>mouseInteraction('#E3E3E3')} onMouseLeave={e=>mouseInteraction('#fff')}>
			<span style={{width:'100%',color:'#956424'}}>{props.content}</span>
		</div>
	)
}

export default Choice