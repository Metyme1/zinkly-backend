import { Modal } from 'antd';
import React from 'react';
import { FaCircle } from 'react-icons/fa';

const BookingDetailsModal = ({open,setOpen}) => {
    return (
        <div>
             <div>
              <Modal
        centered
        footer={false} 
        open={open}
        onCancel={() => setOpen(false)}
        width={500}
      >  
      <div className='py-3 px-8'> 
      <h1 className=' font-semibold text-xl text-center py-3'>Booking Details</h1>
        <div className="p-6 flex flex-col justify-start gap-2 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Booking ID: : </p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">5648633</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Client Name:</p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">John Abraham</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Musician Name</p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">Taylor Swift </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Date</p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">2024-07-24</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Time</p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">10:00 AM</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Lesson Type</p>
            <p className="text-[#5C5C5C] text-sm font-medium whitespace-nowrap">Guitar</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[#000000] text-sm whitespace-nowrap">Duration</p>
            <p className="text-[#000000] text-sm font-medium whitespace-nowrap">1 Hour</p>
          </div>
        
          <div className="flex justify-start items-center gap-2 text-[#00B047]">
            <FaCircle className="text-lg" /> Completed
          </div>
        </div>
      </div>
     
      </Modal> 
        </div>
        </div>
    );
};

export default BookingDetailsModal;