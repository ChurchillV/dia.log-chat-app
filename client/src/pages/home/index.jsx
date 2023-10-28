import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Home = ({ username, setUsername, room, setRoom, socket }) => {

  const navigate = useNavigate();
  
  const joinRoom = () => {
    if(username !== '' && room !== '') {
      socket.emit('join_room', {username, room});
    }
    navigate('/chat', { replace : true });
  }
  return (
    <div className={styles.container}>
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Dia.log</h1>
            <input 
              placeholder='Username' 
              className={styles.input}
              name='username'
              onChange={(e) => setUsername(e.target.value)} 
            />

            <select 
              className={styles.input}
              onChange={(e) => setRoom(e.target.value)}>
                <option>-- Select Room --</option>
                <option value="Computer1">Computer 1</option>
                <option value="Computer2">Computer 2</option>
                <option value="Computer3">Computer 3</option>
                <option value="Computer4">Computer 4</option>
            </select>
            <button 
              className='btn btn-secondary'
              onClick = { joinRoom } 
            >
              Join a Room
            </button>
        </div>
    </div>
  )
}

export default Home