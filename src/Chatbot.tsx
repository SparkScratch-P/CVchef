import React, { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Send, Bot, User, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  role: "user" | "assistant" | "system"; 
  content: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  resumeContext?: string; 
}

export default function Chatbot({ isOpen, onClose, resumeContext }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getChatCompletion = useAction(api.ai.getChatCompletion);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        const initialBotMessage: ChatMessage = {role: "assistant", content: "Hello! I'm CVChef's AI Assistant. How can I help you with your resume or job search today?"};
        let initialMessages: ChatMessage[] = [initialBotMessage];

        if (resumeContext && resumeContext.trim() !== "") {
            // Add resume context as a system message (not displayed but sent to AI)
            // and a user message to kickstart context-aware conversation.
            initialMessages = [
                {role: "system", content: `Current resume context: ${resumeContext}`},
                initialBotMessage,
                {role: "user", content: "Here's my current resume draft. Can you give me some feedback or help me improve it?"},
            ];
            // Immediately call the AI with this context
            fetchAIResponse(initialMessages.filter(m => m.role !== 'assistant'));
        }
        setMessages(initialMessages.filter(m => m.role !== 'system')); // Don't display system message
    }
  }, [isOpen, resumeContext]);


  const fetchAIResponse = async (currentMessages: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const apiMessageHistory = currentMessages.filter(msg => msg.role !== 'system');
      const assistantResponse = await getChatCompletion({
        messageHistory: apiMessageHistory,
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantResponse },
      ]);
    } catch (error: any) {
      console.error("Failed to get AI response:", error);
      toast.error(error.message || "Error getting response from AI. Please try again.");
       setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: `Sorry, I encountered an error: ${error.message || "Could not connect to AI assistant."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    
    // Include system messages if they exist (like resumeContext)
    const fullHistoryForAPI = [...messages.filter(m => m.role === 'system'), ...newMessages];
    fetchAIResponse(fullHistoryForAPI);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md h-[70vh] max-h-[600px] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300 z-50">
      <header className="bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="font-semibold text-lg flex items-center">
          <Bot size={20} className="mr-2" /> AI Resume Assistant
        </h3>
        <button
          onClick={onClose}
          className="text-primary-light hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <XCircle size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`prose prose-sm max-w-[80%] p-3 rounded-xl shadow ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.role === "assistant" && <Bot size={16} className="inline mr-1 mb-0.5" />}
              {msg.role === "user" && <User size={16} className="inline mr-1 mb-0.5" />}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-xl shadow bg-gray-200 text-gray-800 rounded-bl-none flex items-center">
                    <Bot size={16} className="inline mr-1 mb-0.5" />
                    <Loader2 size={16} className="animate-spin ml-1" />
                    <span className="ml-2 text-sm">Typing...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for resume advice..."
            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary outline-none shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
