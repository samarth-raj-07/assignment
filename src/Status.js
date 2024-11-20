import React, { useEffect, useState } from 'react';
import './Status.css';
import plusmore from './plusmore.png';
import todo from './to do.png';
import done from './Done.png';
import Cancelled from './canceled.png';
import backlogimg from './backlog.png';
import inprogressimg from './in progress.png';
import CardStatus from './CardStatus';

const Status = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [priorityOrder, setPriorityOrder] = useState(localStorage.getItem('order'));
  const [groupedTickets, setGroupedTickets] = useState({
    Todo: [],
    Done: [],
    cancelled: [],
    Backlog: [],
    'In progress': [],
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    groupAndSortTickets();
  }, [tickets, priorityOrder]);

  useEffect(() => {
    setPriorityOrder(localStorage.getItem('order'));
  }, [localStorage.getItem('order')]);

  const fetchTickets = async () => {
    try {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const result = await response.json();
      setTickets(result.tickets);
      setUsers(result.users);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const groupAndSortTickets = () => {
    const grouped = {
      Todo: [],
      Done: [],
      cancelled: [],
      Backlog: [],
      'In progress': [],
    };

    tickets.forEach(ticket => {
      if (grouped[ticket.status]) {
        grouped[ticket.status].push(ticket);
      }
    });

    // Sorting tickets based on order preference
    Object.keys(grouped).forEach(status => {
      grouped[status].sort((a, b) => {
        if (priorityOrder === "Title") {
          return a.title.localeCompare(b.title);
        } else {
          return parseInt(b.priority) - parseInt(a.priority);
        }
      });
    });

    setGroupedTickets(grouped);
  };

  const getAvailableStatus = (ticket) => {
    const user = users.find(user => user.id === ticket.userId);
    return user ? user.available : true; // Default to true if no user found
  };

  const renderBoard = (status, icon, label) => {
    const statusTickets = groupedTickets[status];
    return (
      <div className="Board" key={status}>
        <div className="boardHeading">
          <img src={icon} className="headingImg" alt={label} />
          <p className="cText">{label}</p>
          <p className="cText">{statusTickets.length}</p>
          <div className="boardHeading" id="pluske">
            <img src={plusmore} className="headingImg" alt="More" />
          </div>
        </div>
        <div className="Cards">
          {statusTickets.map(ticket => (
            <CardStatus key={ticket.id} ticket={ticket} available={getAvailableStatus(ticket)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="Boards">
      {renderBoard('Backlog', backlogimg, 'Backlog')}
      {renderBoard('Todo', todo, 'Todo')}
      {renderBoard('In progress', inprogressimg, 'In-Progress')}
      {renderBoard('Done', done, 'Done')}
      {renderBoard('cancelled', Cancelled, 'Cancelled')}
    </div>
  );
};

export default Status;
