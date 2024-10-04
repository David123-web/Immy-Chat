import { createClient, createMicrophoneAndCameraTracks } from 'agora-rtc-react'

const appId = 'f6883edeb376407898aec99c9db31524'
const token = '006f6883edeb376407898aec99c9db31524IAAlXMCFTpPCr6tjk5v6NtwV7rFJI8qL5myujTZnv4KhkAZa8+gAAAAAEABVqCrXKobAYgEAAQAphsBi'


export const config = { mode: 'rtc', codec: 'vp8', appId: appId, token: token }
export const useClient = createClient(config)
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks()
export const channelName = 'testing'
