import React, { useState} from 'react'
import styles from './styles.module.css'

const SendMessage = ({ socket, username, room }) => {
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if(message !== '') {
            const __createdtime__ = Date.now();
            // Send message to server
            socket.emit('send_message', { username, room, message, __createdtime__});
            setMessage('');
        }
    }
  return (
    <div className={styles.sendMessageContainer}>
        <input 
            className={styles.messageInput}
            placeholder='Message...'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
         />
         <button className='btn btn-primary' onClick={sendMessage}>
            Send
         </button>
    </div>
  )
}

export default SendMessage;