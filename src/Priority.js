import React, { useEffect, useState } from 'react';
import './Status.css';
import plusmore from './plusmore.png';
import nopriorityimg from './nopriority.png';
import urgentimg from './urgent.png';
import highimg from './high.png';
import mediumimg from './medium.png';
import lowimg from './low.png';
import CardPriority from './CardPriority';

const Priority = () => {
  const [tickets, setTickets] = useState([]);
  const [priorityOrder, setPriorityOrder] = useState(localStorage.getItem('order'));
  const [priorityGroups, setPriorityGroups] = useState({
    nopriority: [],
    lowpriority: [],
    mediumpriority: [],
    hightpriority: [],
    urgent: [],
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    categorizeAndSortTickets();
  }, [tickets, priorityOrder]);
  useEffect(() => {
    setPriorityOrder(localStorage.getItem('order'));
  }, [localStorage.getItem('order')]);
  
  const fetchTickets = async () => {
    try {
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const result = await response.json();
      setTickets(result.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const categorizeAndSortTickets = () => {
    const categorized = {
      nopriority: [],
      lowpriority: [],
      mediumpriority: [],
      hightpriority: [],
      urgent: [],
    };

    tickets.forEach(ticket => {
      switch (ticket.priority) {
        case 0:
          categorized.nopriority.push(ticket);
          break;
        case 1:
          categorized.lowpriority.push(ticket);
          break;
        case 2:
          categorized.mediumpriority.push(ticket);
          break;
        case 3:
          categorized.hightpriority.push(ticket);
          break;
        case 4:
          categorized.urgent.push(ticket);
          break;
        default:
          break;
      }
    });

    // Sort each priority group by title
    Object.keys(categorized).forEach(group => {
      categorized[group].sort((a, b) => a.title.localeCompare(b.title));
    });

    setPriorityGroups(categorized);
  };

  // Render a priority board for each group
  const renderPriorityBoard = (group, icon, label) => (
    <div className="Board" key={group}>
      <div className="boardHeading">
        <img src={icon} className="headingImg" alt={label} />
        <p className="cText" style={{ width: '190px' }}>{label}</p>
        <p className="cText">{priorityGroups[group].length}</p>
        <div className="boardHeading" id="pluske">
          <img src={plusmore} className="headingImg" alt="More" />
        </div>
      </div>

      <div className="Cards">
        {priorityGroups[group].length > 0 &&
          priorityGroups[group].map(ticket => (
            <CardPriority key={ticket.id} ticket={ticket} />
          ))}
      </div>
    </div>
  );

  return (
    <div className="Boards">
      {renderPriorityBoard('nopriority', nopriorityimg, 'No-Priority')}
      {renderPriorityBoard('urgent', urgentimg, 'Urgent')}
      {renderPriorityBoard('hightpriority', highimg, 'High')}
      {renderPriorityBoard('mediumpriority', mediumimg, 'Medium')}
      {renderPriorityBoard('lowpriority', lowimg, 'Low')}
    </div>
  );
};

export default Priority;
