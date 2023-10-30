import React from 'react';
import styles from './styles.module.css';
import RoomAndUsers from './roomAndUsers';
import Messages from './messages';
import SendMessage from './sendMessage';

const Chat = ({ socket, room, username }) => {
  return (
    <div className={styles.chatContainer}>
        <RoomAndUsers socket={socket} username={username} room={room} />
        
        <div>
            <Messages socket={socket} username={username} />
            <SendMessage socket={socket} username={username} room={room} />
        </div>
    </div>
  )
}

export default Chat