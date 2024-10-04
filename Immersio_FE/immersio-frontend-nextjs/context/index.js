import { useReducer, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

//initial state
const initialState = {
	user: null,
	friends: null,
	friendsInvitations: null,
	onlineUsers: null
}

//create context
const Context = createContext()

//rooot reducer
const rootReducer = (state, action) => {
	//console.log(action)
	switch(action.type) {
		case 'LOGIN':
			return { ...state, user: action.payload }
		case 'UPDATE':
			return { ...state, user: action.payload }
		case 'LOGOUT': 
			return { ...state, user: null, friendsInvitations: null, friends: null }
		case 'NEW_INVITATION': 
			return { ...state, friendsInvitations: action.payload }
		case 'FRIEND_LIST_UPDATE': 
			return { ...state, friends: action.payload }
		case 'UPDATE_ONLINE_USERS': 
			return { ...state, onlineUsers: action.payload }
		default:
			return state
	}
}

// context OPSProvider
const OPSProvider = ({children}) => {
	//we will receive children props
	const [state, dispatch] = useReducer(rootReducer, initialState)
	const router = useRouter()

	useEffect(() => {
		/*dispatch({
			type: 'LOGIN',
			payload: JSON.parse(window.localStorage.getItem('user'))
		})*/
		if (window.localStorage.getItem('user') != null) {
			//connectWithSocketServer(JSON.parse(window.localStorage.getItem('user')), dispatch)
		}
	}, [])

	axios.interceptors.response.use(
		function(response) {
			//any status code that lie within the range of 2xx cause this function
			//to trigger
			return response;
		},
		function(error) {
			//any status codes that falls outside the range of 2xx cause this function
			//to trigger
			let res = error.response;
			if(res.status === 401 && res.config && !res.config.__isRetryRequest) {
				return new Promise((resolve, reject) => {
					axios.get('/api/logout')
					.then((data) => {
						console.log('/401 error > logout')
						dispatch({ type: 'LOGOUT'})
						window.localStorage.removeItem('user')
						//router.push('/')
					}).catch(err => {
						console.log('AXIOS INTERCEPTOR ERR ', err)
						reject(error)
					})
				})
			}
			return Promise.reject(error)			
		}
	)

	useEffect(() => {
		// const getCsrfToken = async() => {
		// 	const { data } = await axios.get('/api/csrf-token')
		// 	console.log('CSRF', data)
		// 	axios.defaults.headers["X-CSRF-Token"] = data.getCsrfToken;
		// }
		// getCsrfToken()
	}, [])

	return (
		<Context.Provider value={{state, dispatch}}>
			{children}
		</Context.Provider>
	)
}

export { Context, OPSProvider }