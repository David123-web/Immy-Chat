import { useState } from 'react'

const Fill = (props) => {
	const [backG, setBackG] = useState('#FFC9C9')
	const [answer, setAnswer] = useState('')

	const handleChange = (e) => {
		setAnswer(e.target.value)
		if (e.target.value == props.answer) {
			setBackG('#D5FFD5') 
		} else {
			setBackG('#FFC9C9')
		}
	}

	return(
		<>
		{
			props.answered ? (
				<>
					<input type='text' value={answer} className='form-control' style={{width:150,marginRight:5,background:backG}} disabled/>
				</>
				) : (
					<input type='text' className='form-control' style={{width:150,marginRight:5}} onChange={e => handleChange(e)}/>
				)
		}
		</>
	)
}

export default Fill