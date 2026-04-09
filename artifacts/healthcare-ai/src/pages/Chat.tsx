import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

const initialMessages: Message[] = [
  { id: "1", sender: "user", text: "I've been having a headache and mild fever since yesterday" },
  { id: "2", sender: "ai", text: "I understand you're not feeling well. Let me help assess your symptoms. How severe is your headache on a scale of 1-10? Also, what's your temperature?" },
  { id: "3", sender: "user", text: "Headache is about 6/10. Temperature is 38.2°C" },
  { id: "4", sender: "ai", text: "Thank you. A fever of 38.2°C with a moderate headache could indicate a viral infection. Are you experiencing any other symptoms like sore throat, body aches, or fatigue?" },
  { id: "5", sender: "user", text: "Yes, I have body aches and I'm really tired" },
  { id: "6", sender: "ai", text: "Based on your symptoms — fever, headache, body aches, and fatigue — this pattern is consistent with a viral illness, possibly influenza. I recommend rest, staying hydrated, and monitoring your temperature." },
  { id: "7", sender: "user", text: "Should I see a doctor?" },
  { id: "8", sender: "ai", text: "Given your symptoms, I'd recommend seeing a doctor if your fever exceeds 39.5°C, symptoms worsen after 3-4 days, or you develop difficulty breathing. Would you like me to help you book an appointment?" }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg: Message = { id: Date.now().toString(), sender: "user", text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: "ai",
        text: "I've analyzed your message. Please describe your symptoms in more detail so I can give you a better assessment."
      }]);
    }, 1500);
  };

  const suggestions = ["fever", "headache", "cough", "fatigue", "chest pain"];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur p-4 flex items-center justify-between sticky top-0 z-10" data-testid="chat-header">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-background rounded-full" />
          </div>
          <div>
            <h2 className="font-semibold leading-tight">MediAI Assistant</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6" data-testid="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
              msg.sender === "user" 
                ? "bg-primary text-primary-foreground rounded-br-sm" 
                : "bg-muted text-foreground rounded-bl-sm border border-border/50"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-muted border border-border/50 rounded-2xl rounded-bl-sm px-4 py-4 flex items-center gap-1.5 shadow-sm w-[72px]">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce-dot" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce-dot animation-delay-200" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce-dot animation-delay-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none hide-scrollbar">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(prev => prev ? `${prev}, ${s}` : s)}
              className="px-3 py-1.5 rounded-full bg-muted/50 border hover:bg-muted text-xs font-medium whitespace-nowrap transition-colors"
              data-testid={`suggestion-chip-${s.replace(' ', '-')}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 relative">
          <Button variant="ghost" size="icon" className="shrink-0 h-12 w-12 rounded-full hover:bg-muted" data-testid="btn-attach">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your symptoms..."
              className="pr-12 min-h-[48px] rounded-2xl border-muted-foreground/20 focus-visible:ring-primary shadow-sm"
              data-testid="input-chat-message"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`shrink-0 h-12 w-12 rounded-full transition-all ${isRecording ? 'text-destructive animate-pulse-ring' : 'text-muted-foreground hover:bg-muted'}`}
            onClick={() => setIsRecording(!isRecording)}
            data-testid="btn-mic"
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button 
            size="icon" 
            className="shrink-0 h-12 w-12 rounded-full shadow-sm btn-active-scale" 
            onClick={handleSend}
            disabled={!input.trim()}
            data-testid="btn-send-message"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-muted-foreground">MediAI may produce inaccurate information about medical conditions.</p>
        </div>
      </div>
    </div>
  );
}
