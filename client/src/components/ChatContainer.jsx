import React, { useEffect, useRef } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();
  const currentUserId = '680f50e4f10f3cd28382ecf9'; // ID of Martin Johnson (current user)

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="Help" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((message, index) => {
          const isSentByCurrentUser = message.senderId === currentUserId;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-4 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar on left if receiver */}
              {!isSentByCurrentUser && (
                <div className="text-center text-xs">
                  <img src={assets.avatar_icon} alt="" className="w-7 rounded-full" />
                  <p className="text-gray-500">{formatMessageTime(message.createdAt)}</p>
                </div>
              )}

              {/* Message bubble or image */}
              {message.image ? (
                <img
                  src={message.image}
                  alt=""
                  className="max-w-[230px] border border-gray-700 rounded-lg"
                />
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white bg-violet-500/30 ${
                    isSentByCurrentUser ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                >
                  {message.text}
                </p>
              )}

              {/* Avatar on right if sender */}
              {isSentByCurrentUser && (
                <div className="text-center text-xs">
                  <img src={assets.profile_martin} alt="" className="w-7 rounded-full" />
                  <p className="text-gray-500">{formatMessageTime(message.createdAt)}</p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      {/* Footer */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
     <div className='flex items-center gap-3 bg-white/10 backdrop-blur-lg p-2 rounded-lg w-full'>
       <input type="text"  placeholder='Send a message' className='flex-1 text-sm border-none rounded-lg outline-none text-white placeholder-gray-400'/>
       <input type="file" name="" id="image" accept='image/png,image/jpeg' hidden />
       <label htmlFor="image">
        <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="" />
        </label>



      </div>
      <img src={assets.send_button} alt="" className='w-7 cursor-pointer' />


      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
