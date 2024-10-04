import { useState } from 'react'
import { useClient } from './settings'

//MicIcon, MicOffIcon, VideoCamIcon, ExitToAppIcon
export default function Controls(props) {
	const client = useClient()
	const { tracks, setStart, setInCall } = props
	const [trackState, setTrackState] = useState({ video: true, audio: true })

	const mute = async(type) => {
		if(type === 'audio') {
			await tracks[0].setEnabled(!trackState.audio)
			setTrackState((ps) => {
				return { ...ps, audio: !ps.audio }
			})
		}
		if(type === 'video') {
			await tracks[1].setEnabled(!trackState.video)
			setTrackState((ps) => {
				return { ...ps, video: !ps.video }
			})
		}
	}

	const leaveChannel = async() => {
		await client.leave()
		client.removeAllListeners()
		tracks[0].close()
		tracks[1].close()
		setStart(false)
		setInCall(false)
	}

	return(
		<div className='row justify-content-md-center'>
			<div className='col'>
			{ trackState.audio ? (
				<button style={{background:'green'}} onClick={()=>mute('audio')}>Mic</button>
				) : (
				<button style={{background:'red'}} onClick={()=>mute('audio')}>MicOff</button>
			)}
			</div>
			<div className='col'>
			{ trackState.video ? (
				<button style={{background:'green'}} onClick={()=>mute('video')}>Vid</button>
				) : (
				<button style={{background:'red'}} onClick={()=>mute('video')}>VidOff</button>
			)}
			</div>
			<div className='col'>
				<button style={{background:'blue'}} onClick={()=>leaveChannel()}>Leave</button>			
			</div>
		</div>
	)
}