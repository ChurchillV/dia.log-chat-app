import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const Messages = ({ socket, username }) => {
    const [messagesReceived, setMessagesReceived] = useState([]);
    
    const messagesColumnRef = useRef(null);

    // Runs whenever a socket event is received from the server
    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            setMessagesReceived((state) => [
                ...state,
                {
                    message : data.message,
                    username : data.username,
                    __createdtime__ : data.__createdtime__,
                },
            ]);
        });
    // Remove event listener on component unmount
    return () => socket.off('receive_message');
    }, [socket]);

    // Fetch last 100 messages sent in the chat
    useEffect(() => {
        socket.on('last_100_messages', (last100Messages) => {
            console.log('Last 100 messages: ', JSON.parse(last100Messages));
            last100Messages = JSON.parse(last100Messages);

            // Sort messages by __createdtime__
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        return () => socket.off('last_100_messages');
    }, [socket]);

    // Scroll to the most recent message
    useEffect(() => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]);

    // Sort messages according to __createdtime__
    function sortMessagesByDate(messages) {
        return messages.sort(
            (a,b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    // Format date to 'dd/mm/yyyy, hh:mm:ss' format
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        console.log('date formatted');
        return date.toLocaleString();
    }
    return (
    <div className={styles.messagesColumn} ref={messagesColumnRef}>
        {messagesReceived.map((msg, i) => (
            <div className={styles.message} key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={styles.msgMeta}>{(msg.username == username) ? "You" : msg.username}</span>
                    <span className={styles.msgMeta}>
                        {formatDateFromTimestamp(msg.__createdtime__)}
                    </span>
                </div>
                <p className={styles.msgText}>{msg.message}</p>
                <br />
            </div>
        ))}
    </div>
  )
}


export default Messages