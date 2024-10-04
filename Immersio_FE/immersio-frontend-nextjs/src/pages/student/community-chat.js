import { CheckOutlined, CloseOutlined, PlusOutlined, TeamOutlined } from '@ant-design/icons'
import { Avatar, Modal, Tooltip } from 'antd'
import { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import StudentRoute from '../../../components/routes/StudentRoute'
import { Context } from '../../../context'
import { withTranslationsProps } from '../../next/with-app'
import { http } from '../../services/axiosService'

const CommunityChat = () => {
	const [friendMail, setFriendMail] = useState('')
	const [visible, setVisible] = useState(false)
	const { state } = useContext(Context)
	const { friendsInvitations } = state
	const { onlineUsers } = state
	const { friends } = state
	const { user } = state

	const sendFriendInvitation = async() => {
		try {
			let { data } = await http.post('/api/community-chat/invite-friend', { friendMail })
			console.log(data)
		} catch(err) {
			console.log(err.response.data)
			toast.error(err.response.data)
		}
	}

	const acceptFriendInvitation = async(invitation) => {
		try {
			let { data } = await http.post('/api/community-chat/accept-invitation', { invitation })
			console.log(data)
		} catch(err) {
			console.log(err.response.data)
			toast.error(err.response.data)
		}
	}

	const rejectFriendInvitation = async(invitation) => {
		try {
			console.log('deleting invitation from', user.id)
			let { data } = await http.post('/api/community-chat/reject-invitation', { invitation })

		} catch(err) {
			console.log(err.response.data)
			toast.error(err.response.data)
		}
	}

	const checkOnlineUsers = (friends = [], onlineUsers = []) => {
		if(friends && onlineUsers) {
			friends.forEach((f) => {
				const isUserOnline = onlineUsers.find(user => user.userId === f.id)
				f.isOnline = isUserOnline ? true : false
			})
		} else friends = []
		return friends
	}

	checkOnlineUsers(friends, onlineUsers)

	return(
		<StudentRoute>
			<div className="container-fluid" style={{paddingTop: 30}}>
                <div className="animated fadeIn">
                	<div className="card">
        				<div className="card-header" style={{justifyContent: 'center'}}>
            				<h3 className="page-title float-left mb-0 mt-2">Community chat</h3>
                    	</div>
				        <div className="discord-bg">
				        	<div className='row'>
					        	<div className='col-1 btn-disc-bar'>
					        		<button className='main-discord-btn'><TeamOutlined className='discord-icon'/></button>
					        		<button className='main-discord-btn'><PlusOutlined className='discord-icon'/></button>
					        	</div>
					        	<div className='col-2 friends-bg'>
					        		<button className='addFriend-discord' onClick={()=>setVisible(true)}>Add Friend</button>
					        		<div style={{height:'40vh'}}>
					        			<p className='discord-titles'>Private Messages</p>
					        			{
						        			checkOnlineUsers(friends, onlineUsers).map((f, key) => (
						        				<div className='friend-button' key={key}>
						        					<Avatar style={{background: '#12b1b7'}}>{f.firstName.substring(0,2)}</Avatar>
						        					<p>{f.firstName}</p>
						        					{ f.isOnline && <div className='online-indicator'></div> }
						        				</div>
						        			))
						        		}
					        		</div>

					        		<div>
					        			<p className='discord-titles'>Pending Invitations</p>

					        			{
						        			friendsInvitations && friendsInvitations.map((f, key) => (
					        					<Tooltip placement="right" title={f.senderId.email} key={key}>
						        					<div className='friend-button'>
						        						<Avatar style={{background: '#12b1b7'}}>{f.senderId.firstName.substring(0,2)}</Avatar>
						        						<p>{f.senderId.firstName}</p>
						        						<CheckOutlined className='discord-icon' onClick={()=>acceptFriendInvitation(f)} style={{color:'white', fontSize: 15, cursor:'pointer',position:'absolute', right:22}}/>
						        						<CloseOutlined className='discord-icon' onClick={()=>rejectFriendInvitation(f)} style={{color:'white', fontSize: 15, cursor:'pointer',position:'absolute', right:5}}/>
						        					</div>
      											</Tooltip>
						        			))
						        		}
					        		</div>
					        		
					        	</div>
					        	<div className='col-8'>
					        		<div className='main-discord-input'>
					        			<input type='text' className='form-control' />
					        		</div>
					        	</div>
				        	</div>

				        	<Modal title='Invite a friend' centered visible={visible} onCancel={()=> setVisible(false)} footer={null}>
				        		<p>Enter an e-mail address of a friend which you would like to invite</p>
				        		<p className='discord-titles' style={{textAlign:'left'}}>mail</p>
				        		<input placeholder='Mail address' className='discord-inputs' value={friendMail} onChange={(v)=>setFriendMail(v.target.value)}/>
				        		<button className='send-Disc-btn' onClick={sendFriendInvitation}>Send</button>
						    </Modal>
				        	

        				</div>
    				</div>
                </div>
            </div>
		</StudentRoute>
	)
}

export async function getServerSideProps(ctx) {
  return await withTranslationsProps(ctx)
}

export default CommunityChat