import './App.css';
import Navbar from './Navbar.js';
import Status from './Status.js';
import Priority from './Priority';
import Byuser from './Byuser.js';
import { useState, useEffect } from 'react';

function App() {
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
  const [order, setOrder] = useState(localStorage.getItem('order') || 'Priority');

  useEffect(() => {
    // Update localStorage whenever grouping or order changes
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('order', order);
  }, [grouping, order]);

  const setGroupingValue = (newValue) => {
    const validGroupingValues = ['status', 'priority', 'user'];
    if (validGroupingValues.includes(newValue)) {
      setGrouping(newValue);
    } else {
      console.error('Invalid grouping value provided:', newValue);
    }
  };

  const setOrderingValue = (newValue) => {
    const validOrderingValues = ['Priority', 'Title'];
    if (validOrderingValues.includes(newValue)) {
      setOrder(newValue);
    } else {
      console.error('Invalid ordering value provided:', newValue);
    }
  };

  // Render the appropriate content based on grouping
  const renderContent = () => {
    switch (grouping) {
      case 'status':
        return <Status order={order} />;
      case 'priority':
        return <Priority order={order} />;
      case 'user':
        return <Byuser order={order} />;
      default:
        return null;
    }
  };

  return (
    <div className='fullBody'>
      <Navbar 
        order={order} 
        grouping={grouping} 
        setGroupingValue={setGroupingValue} 
        setOrderingValue={setOrderingValue}
      />
      {renderContent()}
    </div>
  );
}

export default App;
