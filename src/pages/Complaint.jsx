import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

const ChatBox = () => {
  const [activeTab, setActiveTab] = useState('cases');
  const [message, setMessage] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const chatEndRef = useRef(null);

  const cases = [
    {
      id: 'CAS-001',
      channel: 'Email',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow. If not, I might as well go for a refund.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow. If not, I might as well go for a refund.',
          time: 'Monday 10:54'
        },
        {
          sender: 'agent',
          text: 'Sure, you can pay to it but the service that want to observe a back so that I can assign a service provider.',
          time: 'Monday 10:54',
          name: 'Mr Abubakar'
        },
        {
          sender: 'customer',
          text: "Alost, why can't you do it yourself? Have the last responsible in a while, would you give me a reply?",
          time: 'Monday 11:20'
        }
      ]
    },
    {
      id: 'CAS-002',
      channel: 'Whatsapp',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow.',
          time: 'Monday 10:54'
        },
        {
          sender: 'agent',
          text: 'Sorry, I have diarrhea as a result of food poisoning. Had to rush to the pharmacy.',
          time: 'Monday 11:54',
          name: 'Rose Chukwu'
        }
      ]
    },
    {
      id: 'CAS-003',
      channel: 'Twitter',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow.',
          time: 'Monday 10:54'
        }
      ]
    },
    {
      id: 'CAS-004',
      channel: 'Instagram',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow. If not, I might as well go for a refund.',
          time: 'Monday 10:54'
        },
        {
          sender: 'agent',
          text: 'You could put status anyone before you go. Put status that in the form of a video that states that you have an unscheduled payment. See to it that you leave a space for a message so soon as to...',
          time: 'Monday 11:20'
        }
      ]
    },
    {
      id: 'CAS-005',
      channel: 'Twitter',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow. If not, I might as well go for a refund.',
          time: 'Monday 10:54'
        },
        {
          sender: 'agent',
          text: 'Sorry, I have diarrhea as a result of food poisoning. Had to rush to the pharmacy.',
          time: 'Monday 11:54',
          name: 'Rose Chukwu'
        }
      ]
    },
    {
      id: 'CAS-006',
      channel: 'Twitter',
      time: '30 minutes ago',
      preview: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow.',
      messages: [
        {
          sender: 'customer',
          text: 'I have transferred the money for the laundry service today but just realized that I would not be at home tomorrow. Would it be possible for the laundry service provider to come pick up my cloth this evening or the day after tomorrow as it can not be possible tomorrow. If not, I might as well go for a refund.',
          time: 'Monday 10:54'
        },
        {
          sender: 'agent',
          text: 'And, why can\'t you do it yourself? Rose has not responded in a while, would you keep the customer waiting?',
          time: 'Monday 11:20'
        }
      ]
    }
  ];

  const getChannelColor = (channel) => {
    const colors = {
      'Email': 'bg-emerald-600',
      'Whatsapp': 'bg-green-500',
      'Twitter': 'bg-blue-400',
      'Instagram': 'bg-pink-500'
    };
    return colors[channel] || 'bg-gray-500';
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedCase) {
      // In a real app, this would send the message to the server
      setMessage('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedCase]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Chat Box</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'cases'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('cases')}
          >
            Cases
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'open'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('open')}
          >
            Open Cases
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'priority'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('priority')}
          >
            Priority Queue
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'pending'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Followups
          </button>
        </div>

        {/* Case List */}
        <div className="flex-1 overflow-y-auto">
          {cases.map((case_) => (
            <div
              key={case_.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedCase?.id === case_.id ? 'bg-emerald-50' : ''
              }`}
              onClick={() => setSelectedCase(case_)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs font-medium text-white px-2 py-1 rounded ${getChannelColor(case_.channel)}`}>
                  {case_.channel}
                </span>
                <span className="text-xs text-gray-500">{case_.time}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-semibold">{case_.id}</span> {case_.preview}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCase ? (
          <>
            {/* Chat Header */}
            <div className="bg-emerald-600 text-white p-4">
              <div className="font-semibold">Admin Team</div>
              <div className="text-sm opacity-90">Mr Abubakar</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedCase.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${msg.sender === 'agent' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.sender === 'agent'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      {msg.name && <span className="font-medium">{msg.name}</span>}
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  type="text"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <span className="text-sm font-medium">Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg">Select a case to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;