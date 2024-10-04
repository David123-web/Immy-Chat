import { connectWithSocketServer } from '../../../realTimeCommunication/socketConnection'
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

export const startSocketConnection = (userDetails) => {
    if (userDetails) {
        console.log('current:', userDetails.id)
        // connectWithSocketServer(user, dispatch)
    }
}