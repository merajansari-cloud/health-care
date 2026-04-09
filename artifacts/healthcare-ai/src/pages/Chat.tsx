import { useState, useRef, useEffect } from "react";
import { Mic, Paperclip, Send, Activity, Camera, FolderOpen, X, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AttachedFile = {
  file: File;
  previewUrl: string | null;
  type: "image" | "other";
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachment?: {
    name: string;
    previewUrl: string | null;
    type: "image" | "other";
  };
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
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attached, setAttached] = useState<AttachedFile | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const attachBtnRef = useRef<HTMLButtonElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!showAttachMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node) &&
        attachBtnRef.current &&
        !attachBtnRef.current.contains(e.target as Node)
      ) {
        setShowAttachMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAttachMenu]);

  const handleFileSelect = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : null;
    setAttached({ file, previewUrl, type: isImage ? "image" : "other" });
    setShowAttachMenu(false);
  };

  const removeAttachment = () => {
    if (attached?.previewUrl) URL.revokeObjectURL(attached.previewUrl);
    setAttached(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!input.trim() && !attached) || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() || (attached ? `[Attached: ${attached.file.name}]` : ""),
      attachment: attached
        ? { name: attached.file.name, previewUrl: attached.previewUrl, type: attached.type }
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttached(null);
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
      const errorText = err instanceof Error ? err.message : "Something went wrong.";
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
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm space-y-2 ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm border border-border/50"
            }`}>
              {/* Attachment preview in bubble */}
              {msg.attachment && (
                <div className={`rounded-xl overflow-hidden border ${msg.role === "user" ? "border-white/20" : "border-border/50"}`}>
                  {msg.attachment.type === "image" && msg.attachment.previewUrl ? (
                    <img
                      src={msg.attachment.previewUrl}
                      alt={msg.attachment.name}
                      className="max-h-48 w-full object-cover"
                    />
                  ) : (
                    <div className={`flex items-center gap-2 px-3 py-2 text-sm ${msg.role === "user" ? "bg-white/10" : "bg-muted"}`}>
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate text-xs">{msg.attachment.name}</span>
                    </div>
                  )}
                </div>
              )}
              {/* Text content — hide if it's just the auto-generated attachment label */}
              {msg.content && !msg.content.startsWith("[Attached:") && (
                <span>{msg.content}</span>
              )}
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
        {/* Suggestion chips */}
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

        {/* Attached file chip */}
        {attached && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="flex items-center gap-2 bg-muted border border-border rounded-xl px-3 py-1.5 text-sm max-w-xs animate-in fade-in slide-in-from-bottom-1 duration-200">
              {attached.type === "image" && attached.previewUrl ? (
                <img src={attached.previewUrl} alt="preview" className="w-6 h-6 rounded object-cover shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className="truncate text-xs text-foreground max-w-[140px]">{attached.file.name}</span>
              <button
                onClick={removeAttachment}
                className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                aria-label="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-2 relative">

          {/* Attach button + popup */}
          <div className="relative shrink-0">
            <Button
              ref={attachBtnRef}
              variant="ghost"
              size="icon"
              className={`h-12 w-12 rounded-full hover:bg-muted transition-colors ${showAttachMenu ? "bg-muted text-primary" : ""}`}
              onClick={() => setShowAttachMenu((v) => !v)}
              data-testid="btn-attach"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>

            {/* Popup menu */}
            {showAttachMenu && (
              <div
                ref={attachMenuRef}
                className="absolute bottom-14 left-0 bg-background border border-border rounded-2xl shadow-lg p-1.5 flex flex-col gap-0.5 min-w-[150px] z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
              >
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm font-medium text-left"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-primary" />
                  </span>
                  Camera
                </button>
                <button
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-sm font-medium text-left"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Image className="w-4 h-4 text-secondary" />
                  </span>
                  Photo / File
                </button>
              </div>
            )}
          </div>

          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />

          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={attached ? "Add a message (optional)…" : "Describe your symptoms..."}
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
            disabled={(!input.trim() && !attached) || isTyping}
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
