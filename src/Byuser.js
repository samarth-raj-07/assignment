import React, { useEffect, useState } from 'react';
import './Status.css';
import plusmore from './plusmore.png';
import CardUser from './Card1.js';
import availableimg from './availableimg.png';
import notavailableimg from './notavailableimg.png';
import usr1 from './usr-1.png';
import usr2 from './usr-2.png';
import usr3 from './usr-3.png';
import usr4 from './usr-4.png';
import usr5 from './usr-5.png';
import usr6 from './usr-6.png';
import usr7 from './usr-7.png';



const usrImageMap = {
  "usr-1": usr1,
  "usr-2": usr2,
  "usr-3": usr3,
  "usr-4": usr4,
  "usr-5": usr5,
  "usr-6": usr6,
  "usr-7": usr7,
};

const Byuser = () => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [userMass, setUserMass] = useState([]);
  const [order, setOrder] = useState(localStorage.getItem('order') || 'Priority');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateUserMass();
  }, [tickets, users, order]);
  
  useEffect(() => {
    setOrder(localStorage.getItem('order'));
  }, [localStorage.getItem('order')]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const result = await response.json();
      setTickets(result.tickets);
      setUsers(result.users);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateUserMass = () => {
    const mass = users.map((user) => {
      const userTickets = tickets.filter(ticket => ticket.userId === user.id);

      // Sort tickets based on the order
      const sortedTickets = sortTickets(userTickets);

      return { user, tickets: sortedTickets };
    });
    setUserMass(mass);
  };

  const sortTickets = (userTickets) => {
    return userTickets.sort((a, b) => {
      if (order === 'Title') {
        return a.title.localeCompare(b.title); // Sort by title alphabetically
      } else {
        return b.priority - a.priority; // Sort by priority (high to low)
      }
    });
  };

  const getUserImage = (userId) => usrImageMap[userId] || usr1;

  const renderUserBoard = (user, tickets) => {
    const available = user.available;
    const userImage = getUserImage(user.id);
    const availabilityIcon = available ? availableimg : notavailableimg;

    return (
      <div className="Board" key={user.id}>
        <div className="boardHeading">
          <img src={userImage} className="headingImg2" alt="User" />
          <p className="cText" style={{ width: "500px" }}>{user.name}</p>
          <p className="cText">{tickets.length}</p>
          <img src={availabilityIcon} className="dot" alt="Availability" />
          <div className="boardHeading" id="pluske">
            <img src={plusmore} className="headingImg" alt="More" />
          </div>
        </div>

        <div className="Cards">
          {tickets.map(ticket => (
            <CardUser key={ticket.id} ticket={ticket} available={available} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="Boards">
      {userMass.map(({ user, tickets }) => renderUserBoard(user, tickets))}
    </div>
  );
};



export default Byuser;
