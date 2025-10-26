import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, Loader, RefreshCw } from 'lucide-react';

const ChatBox = () => {
  const [activeTab, setActiveTab] = useState('cases');
  const [message, setMessage] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const chatEndRef = useRef(null);

  const API_BASE_URL = 'https://runpro9ja-pxqoa.ondigitalocean.app/api';

  // Get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch support agents
  const fetchSupportAgents = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/support/agents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
        
        // Auto-select first agent if available
        if (data.agents && data.agents.length > 0) {
          setSelectedAgent(data.agents[0]);
        }
      } else {
        console.error('Failed to fetch agents');
        // Set default agents as fallback
        setAgents(getDefaultSupportAgents());
        setSelectedAgent(getDefaultSupportAgents()[0]);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgents(getDefaultSupportAgents());
      setSelectedAgent(getDefaultSupportAgents()[0]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/support/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        // Transform conversations to match your case format
        const transformedCases = transformConversationsToCases(data.conversations);
        setCases(transformedCases);
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start a new support chat
  const startSupportChat = async (initialMessage = 'Hello, I need help') => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/support/start-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: initialMessage,
          category: 'general_support'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Support chat started:', data);
        return data;
      } else {
        console.error('Failed to start support chat');
        return null;
      }
    } catch (error) {
      console.error('Error starting support chat:', error);
      return null;
    }
  };

  // Send message to support
  const sendSupportMessage = async (messageText, receiverId = null) => {
    try {
      setSending(true);
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/support/send-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          category: 'general_support',
          receiverId: receiverId || (selectedAgent && selectedAgent.id !== 'support_system' ? selectedAgent.id : null)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent:', data);
        
        // Refresh conversations to get updated messages
        await fetchConversations();
        return data;
      } else {
        console.error('Failed to send message');
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Get specific conversation with an agent
  const fetchConversation = async (agentId) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/support/conversation/${agentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      } else {
        console.error('Failed to fetch conversation');
        return [];
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return [];
    }
  };

  // Transform backend conversations to frontend case format
  const transformConversationsToCases = (conversations) => {
    if (!conversations || !Array.isArray(conversations)) return [];

    return conversations.map((conv, index) => ({
      id: `CAS-${String(index + 1).padStart(3, '0')}`,
      channel: getChannelFromConversation(conv),
      time: formatTime(conv.createdAt),
      preview: conv.message || 'No message content',
      messages: transformMessages(conv),
      backendData: conv // Keep original data for reference
    }));
  };

  const getChannelFromConversation = (conv) => {
    // You can map this based on your actual data
    const channels = ['Email', 'Whatsapp', 'Twitter', 'Instagram'];
    return channels[Math.floor(Math.random() * channels.length)];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const transformMessages = (conv) => {
    if (!conv) return [];
    
    return [{
      sender: conv.sender && conv.sender._id ? 'customer' : 'agent',
      text: conv.message || 'No message',
      time: formatTime(conv.createdAt),
      name: conv.sender ? conv.sender.name : 'Support Agent'
    }];
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (message.trim() && selectedCase) {
      try {
        await sendSupportMessage(message.trim());
        setMessage('');
        
        // Auto-scroll to bottom
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } catch (error) {
        alert('Failed to send message. Please try again.');
      }
    }
  };

  // Handle case selection
  const handleCaseSelect = async (case_) => {
    setSelectedCase(case_);
    
    // If this case has a real agent ID, fetch the full conversation
    if (case_.backendData && case_.backendData.receiver) {
      const messages = await fetchConversation(case_.backendData.receiver._id || case_.backendData.receiver);
      if (messages.length > 0) {
        setSelectedCase(prev => ({
          ...prev,
          messages: messages.map(msg => ({
            sender: msg.sender && msg.sender._id ? 'customer' : 'agent',
            text: msg.message,
            time: formatTime(msg.createdAt),
            name: msg.sender ? msg.sender.name : 'Support Agent'
          }))
        }));
      }
    }
  };

  // Initialize component
  useEffect(() => {
    fetchSupportAgents();
    fetchConversations();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedCase]);

  // Fallback sample data (same as your original)
  const [cases, setCases] = useState([
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
    }
    // ... include other sample cases as fallback
  ]);

  const getChannelColor = (channel) => {
    const colors = {
      'Email': 'bg-emerald-600',
      'Whatsapp': 'bg-green-500',
      'Twitter': 'bg-blue-400',
      'Instagram': 'bg-pink-500'
    };
    return colors[channel] || 'bg-gray-500';
  };

  const getDefaultSupportAgents = () => {
    return [
      {
        id: 'support_system',
        name: 'RunPro Support Team',
        role: 'Customer Support',
        online: true,
        avatar: '',
        lastSeen: new Date()
      }
    ];
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Chat Box</h2>
          <button
            onClick={fetchConversations}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh conversations"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
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
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : cases.length > 0 ? (
            cases.map((case_) => (
              <div
                key={case_.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedCase?.id === case_.id ? 'bg-emerald-50' : ''
                }`}
                onClick={() => handleCaseSelect(case_)}
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
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCase ? (
          <>
            {/* Chat Header */}
            <div className="bg-emerald-600 text-white p-4">
              <div className="font-semibold">Admin Team</div>
              <div className="text-sm opacity-90">
                {selectedAgent ? selectedAgent.name : 'Support Team'}
              </div>
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
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
                />
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg">Select a case to start chatting</p>
              <button
                onClick={() => startSupportChat()}
                className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;