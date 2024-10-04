//import { AgoraVideoPlayer } from 'agora-rtc-react'
import { useState, useEffect } from 'react'

export default function Video(props) {
	const { users, tracks } = props
	const [gridSpacing, setGridSpacing] = useState(12)
	
	useEffect(() => {
		setGridSpacing(Math.max(Math.floor(12/(users.length+1))), 4)
	}, [users, tracks])

	return(
		<div style={{height:'100%'}}>
			<div style={{height:'100%'}}>
				<AgoraVideoPlayer videoTrack={tracks[1]} style={{height:'100%',width:'100%'}}/>
				{ users.length > 0 && users.map((user) => {
					if (user.videoTrack) {
						return <div>
							{/*<AgoraVideoPlayer videoTrack={user.videoTrack} key={user.uid} style={{height:'100%',width:'100%'}}/>*/}
						</div>
					} else return null
				})}
			</div>
		</div>
	)
}
