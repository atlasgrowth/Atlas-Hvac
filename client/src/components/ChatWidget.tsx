import { useState } from "react";
import { Company } from "@/types/company";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ChatWidgetProps {
  company: Company;
}

export default function ChatWidget({ company }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // In a real implementation, this would send the message to the backend
      console.log("Chat message:", message);
      
      toast({
        title: "Message Sent",
        description: "We'll respond to your message shortly!",
      });
      
      setMessage("");
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          className="bg-amber-500 hover:bg-amber-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-colors"
          onClick={toggleChat}
          aria-label="Chat with us"
        >
          <span className="material-icons text-2xl">
            {isOpen ? "close" : "chat"}
          </span>
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80">
          <Card className="shadow-xl">
            <div className="bg-primary text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <span className="material-icons mr-2">forum</span>
                <h3 className="font-semibold">Chat with {company.name}</h3>
              </div>
              <button 
                className="text-white hover:text-gray-200"
                onClick={toggleChat}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto bg-white">
              <div className="bg-gray-100 p-3 rounded-lg mb-2 max-w-[90%]">
                <p className="text-sm">Hello! How can we help you today with your HVAC needs?</p>
                <span className="text-xs text-gray-500 mt-1 block">Support Team</span>
              </div>
            </div>
            
            <div className="p-3 border-t">
              <form onSubmit={handleSubmit} className="flex">
                <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Type your message..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-blue-700 text-white rounded-l-none"
                >
                  <span className="material-icons">send</span>
                </Button>
              </form>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
