import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "").replace(/^\/healthcare-ai/, "") || "";

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hello! I'm MediAI, your AI health assistant. Describe your symptoms or ask me any health-related question and I'll do my best to help. Remember, I'm here to inform — always consult a doctor for a proper diagnosis.",
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history,
        }),
      });

      const json = await res.json() as {
        success: boolean;
        data?: { reply: string };
        error?: { message: string };
      };

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? "Failed to get a response.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: json.data!.reply,
        },
      ]);
    } catch (err) {
      const errorText =
        err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorText} Please try again.`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm border border-border/50"
            }`}>
              {msg.content}
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
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Describe your symptoms..."
              className="pr-12 min-h-[48px] rounded-2xl border-muted-foreground/20 focus-visible:ring-primary shadow-sm"
              data-testid="input-chat-message"
              disabled={isTyping}
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
            disabled={!input.trim() || isTyping}
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
