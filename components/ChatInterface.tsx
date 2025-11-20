
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, XMarkIcon, ChatBubbleLeftRightIcon, BuildingOffice2Icon, BuildingStorefrontIcon, UserIcon, ArrowPathRoundedSquareIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface User {
  name: string;
  role: string;
  companyName?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'partner';
  timestamp: Date;
}

export const ChatInterface = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Pharmacists can switch between "Supplier" (Manufacturer) and "Patients"
  // Patients always chat with Pharmacist.
  // Manufacturers always chat with Pharmacists.
  const [activeChannel, setActiveChannel] = useState<'upstream' | 'downstream'>('upstream'); 

  // Store history for each channel so context isn't lost when switching
  const [channelHistory, setChannelHistory] = useState<Record<string, Message[]>>({
      upstream: [{ id: '1', text: 'Secure Channel Established. Encryption: AES-256.', sender: 'system', timestamp: new Date() }],
      downstream: [{ id: '2', text: 'Patient Inquiry Channel Active.', sender: 'system', timestamp: new Date() }]
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Order Form State
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderItem, setOrderItem] = useState('');
  const [orderQty, setOrderQty] = useState('');

  // Determine Partner Details based on Role and Active Channel
  let partnerName = '';
  let PartnerIcon = BuildingStorefrontIcon;
  let headerColor = 'bg-zinc-900/90';
  let iconBg = 'bg-zinc-800';
  let iconColor = 'text-zinc-400';

  if (user.role === 'patient') {
      partnerName = 'Verified Pharmacist';
      PartnerIcon = BuildingStorefrontIcon;
      iconBg = 'bg-teal-500/20';
      iconColor = 'text-teal-400';
      headerColor = 'bg-teal-900/90';
  } else if (user.role === 'manufacturer') {
      partnerName = 'Pharmacy Network';
      PartnerIcon = BuildingStorefrontIcon;
      iconBg = 'bg-teal-500/20';
      iconColor = 'text-teal-400';
      headerColor = 'bg-blue-900/90';
  } else if (user.role === 'pharmacist') {
      if (activeChannel === 'upstream') {
          partnerName = 'Manufacturer / Distributor';
          PartnerIcon = BuildingOffice2Icon;
          iconBg = 'bg-blue-500/20';
          iconColor = 'text-blue-400';
          headerColor = 'bg-blue-900/90';
      } else {
          partnerName = 'Patient Inquiries';
          PartnerIcon = UserIcon;
          iconBg = 'bg-indigo-500/20';
          iconColor = 'text-indigo-400';
          headerColor = 'bg-indigo-900/90';
      }
  }

  // Derived current messages
  const messages = channelHistory[activeChannel] || [];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const addMessage = (channel: string, msg: Message) => {
      setChannelHistory(prev => ({
          ...prev,
          [channel]: [...(prev[channel] || []), msg]
      }));
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!orderItem || !orderQty) return;

      const text = `PURCHASE ORDER REQUEST\nItem: ${orderItem}\nQuantity: ${orderQty} units\nPriority: Standard`;
      
      const newUserMsg: Message = {
        id: Date.now().toString(),
        text: text,
        sender: 'user',
        timestamp: new Date()
      };
  
      addMessage(activeChannel, newUserMsg);
      setShowOrderForm(false);
      setOrderItem('');
      setOrderQty('');
      setIsTyping(true);
  
      // Simulate Manufacturer confirmation
      setTimeout(() => {
        const replyText = `Order #${Math.floor(Math.random() * 9000) + 1000} Confirmed. ${orderQty} units of ${orderItem} allocated from Factory Warehouse. Dispatch scheduled within 24 hours.`;
        const partnerMsg: Message = {
            id: (Date.now() + 1).toString(),
            text: replyText,
            sender: 'partner',
            timestamp: new Date()
        };
        addMessage(activeChannel, partnerMsg);
        setIsTyping(false);
      }, 2500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const currentChannel = activeChannel; // capture current channel for async closure

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    addMessage(currentChannel, newUserMsg);
    setInputValue('');
    setIsTyping(true);

    // Simulate partner response
    setTimeout(() => {
      let replyText = "Message received.";
      const lowerInput = inputValue.toLowerCase();
      
      // Logic for automated responses based on context
      if (user.role === 'patient') {
          // Patient -> Pharmacist
          if (lowerInput.includes('dosage') || lowerInput.includes('take')) {
              replyText = "Please take one tablet after meals. Avoid taking it on an empty stomach to prevent nausea.";
          } else if (lowerInput.includes('side effect') || lowerInput.includes('dizzy')) {
              replyText = "Dizziness is a known but rare side effect. If it persists for more than 2 hours, please visit the clinic.";
          } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
              replyText = "The current retail price is ₹145 per strip. We have stock available.";
          } else {
              replyText = "I've verified the batch number you scanned. It is authentic and safe to use.";
          }
      } else if (user.role === 'manufacturer') {
          // Manufacturer -> Pharmacist
          if (lowerInput.includes('sales') || lowerInput.includes('demand')) {
              replyText = "Weekly sales report received. Demand in the North region has increased by 15%.";
          } else if (lowerInput.includes('delivery') || lowerInput.includes('shipment')) {
              replyText = "Batch #8992 is currently in transit. Expected arrival at the distribution hub is tomorrow.";
          } else if (lowerInput.includes('recall')) {
              replyText = "Acknowledged. We have quarantined the affected batch immediately.";
          } else {
              replyText = "Copy that. Inventory levels are being updated in the central database.";
          }
      } else if (user.role === 'pharmacist') {
          if (currentChannel === 'upstream') {
              // Pharmacist -> Manufacturer
              if (lowerInput.includes('stock') || lowerInput.includes('order')) {
                  replyText = "For bulk orders, please use the 'Place Order' button above for faster processing.";
              } else if (lowerInput.includes('expiry')) {
                  replyText = "Please return any stock expiring within 30 days for credit.";
              } else {
                  replyText = "We have logged your query with the logistics team.";
              }
          } else {
              // Pharmacist -> Patient
              if (lowerInput.includes('help')) {
                  replyText = "I am taking my medication but feeling nauseous. Is this normal?";
              } else if (lowerInput.includes('refill')) {
                  replyText = "Can I get a refill for my prescription #9921?";
              } else {
                  replyText = "Thank you for the information. I will check the app.";
              }
          }
      }

      const partnerMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: replyText,
          sender: 'partner',
          timestamp: new Date()
      };
      
      addMessage(currentChannel, partnerMsg);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-3 rounded-full shadow-2xl border border-zinc-700 transition-all hover:scale-105 group"
      >
        <div className="relative">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-teal-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black"></span>
        </div>
        <div className="flex flex-col items-start">
            <span className="text-xs font-bold">Secure Chat</span>
            <span className="text-[10px] text-zinc-400">
                {user.role === 'pharmacist' ? 'Network Active' : partnerName}
            </span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#0E0E10] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      
      {/* Header */}
      <div className={`${headerColor} p-4 flex items-center justify-between shrink-0 border-b border-white/10 backdrop-blur-md`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconBg} border border-white/10`}>
            <PartnerIcon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">{partnerName}</h3>
            <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-white/70">Online & Encrypted</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
            {/* Pharmacist Order Button - Only Upstream */}
            {user.role === 'pharmacist' && activeChannel === 'upstream' && (
                <button 
                    onClick={() => setShowOrderForm(!showOrderForm)}
                    className={`p-1.5 rounded-lg transition-colors ${showOrderForm ? 'bg-white text-blue-600' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
                    title="Place Order"
                >
                    <ShoppingCartIcon className="w-5 h-5" />
                </button>
            )}

            {/* Pharmacist Switcher */}
            {user.role === 'pharmacist' && (
                <button 
                    onClick={() => setActiveChannel(prev => prev === 'upstream' ? 'downstream' : 'upstream')}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
                    title="Switch Channel"
                >
                    <ArrowPathRoundedSquareIcon className="w-5 h-5" />
                </button>
            )}
            <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Order Form Overlay */}
      {showOrderForm && (
          <div className="bg-zinc-900 p-4 border-b border-zinc-800 animate-in slide-in-from-top-5">
              <h4 className="text-xs font-bold text-white uppercase mb-3 flex items-center">
                  <ShoppingCartIcon className="w-4 h-4 mr-1 text-teal-400" />
                  Create Purchase Order
              </h4>
              <form onSubmit={handleOrderSubmit} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Drug Name / SKU"
                    value={orderItem}
                    onChange={(e) => setOrderItem(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Quantity (e.g., 500 units)"
                    value={orderQty}
                    onChange={(e) => setOrderQty(e.target.value)}
                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white focus:border-teal-500 outline-none"
                    required
                  />
                  <div className="flex space-x-2 pt-1">
                      <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2 rounded transition-colors">
                          Confirm Order
                      </button>
                      <button type="button" onClick={() => setShowOrderForm(false)} className="px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-2 rounded transition-colors">
                          Cancel
                      </button>
                  </div>
              </form>
          </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 h-80 overflow-y-auto p-4 space-y-4 bg-black/40 custom-scrollbar">
        {messages.map((msg) => {
            const isMe = msg.sender === 'user';
            const isSystem = msg.sender === 'system';
            const isOrder = msg.text.includes('PURCHASE ORDER');
            
            if (isSystem) {
                return (
                    <div key={msg.id} className="flex justify-center my-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800/50">
                            {msg.text}
                        </span>
                    </div>
                );
            }

            return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                        className={`
                            max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-line
                            ${isOrder ? 'border-l-4 border-teal-400' : ''}
                            ${isMe 
                                ? 'bg-teal-600 text-white rounded-br-none' 
                                : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'}
                        `}
                    >
                        {isOrder && <div className="text-[10px] font-bold opacity-70 mb-1">SENT VIA DIRECT ORDER</div>}
                        {msg.text}
                        <div className={`text-[9px] mt-1 text-right opacity-60 ${isMe ? 'text-teal-100' : 'text-zinc-500'}`}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
            );
        })}
        {isTyping && (
             <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none border border-zinc-700 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!showOrderForm && (
        <form onSubmit={handleSend} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={user.role === 'pharmacist' 
                    ? activeChannel === 'upstream' ? "Message Manufacturer..." : "Message Patient..."
                    : "Type a secure message..."}
                className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder-zinc-600"
            />
            <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl transition-all shadow-lg active:scale-95"
            >
                <PaperAirplaneIcon className="w-4 h-4" />
            </button>
        </form>
      )}
    </div>
  );
};
