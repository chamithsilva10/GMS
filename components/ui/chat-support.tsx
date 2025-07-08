"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Bot, User, X, Minimize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot" | "agent"
  timestamp: Date
  type?: "text" | "quick_reply" | "file"
}

interface ChatSupportProps {
  isOpen: boolean
  onToggle: () => void
}

export function ChatSupport({ isOpen, onToggle }: ChatSupportProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your NCAS assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    "How do I apply for a grant?",
    "What documents do I need?",
    "Check application status",
    "Payment issues",
    "Contact support agent",
  ]

  const botResponses: Record<string, string> = {
    "how do i apply for a grant":
      "To apply for a grant: 1) Create an account, 2) Browse available grants, 3) Fill out the application form, 4) Upload required documents, 5) Submit your application. Would you like me to guide you through any specific step?",
    "what documents do i need":
      "Common required documents include: Business registration, Financial statements, Project proposal, Budget breakdown, Tax certificates. The exact requirements depend on the grant type. Check the specific grant details for complete requirements.",
    "check application status":
      "You can check your application status by logging into your dashboard. Applications go through these stages: Draft → Submitted → Under Review → Approved/Rejected. You'll receive email notifications for status changes.",
    "payment issues":
      "For payment issues: 1) Check your payment method, 2) Verify card details, 3) Ensure sufficient funds, 4) Try a different payment method. If problems persist, I can connect you with a support agent.",
    "contact support agent": "I'm connecting you with a human support agent. Please wait a moment...",
    hello: "Hello! How can I assist you with your grant application today?",
    help: "I can help you with: Grant applications, Document requirements, Payment issues, Application status, and general questions. What would you like to know?",
    thanks: "You're welcome! Is there anything else I can help you with today?",
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage.toLowerCase())
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (input: string): string => {
    // Check for exact matches first
    for (const [key, response] of Object.entries(botResponses)) {
      if (input.includes(key)) {
        return response
      }
    }

    // Default response
    return "I understand you're asking about grant applications. Could you please be more specific? You can also use the quick reply buttons below for common questions, or I can connect you with a human agent for personalized assistance."
  }

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply)
    handleSendMessage()
  }

  if (!isOpen) {
    return (
      <Button onClick={onToggle} className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-50" size="lg">
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <div>
            <CardTitle className="text-sm">NCAS Support</CardTitle>
            <CardDescription className="text-xs">
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            </CardDescription>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.sender === "bot" && <Bot className="w-4 h-4" />}
                  {message.sender === "user" && <User className="w-4 h-4" />}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="p-2 border-t">
          <div className="flex flex-wrap gap-1 mb-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-6 bg-transparent"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
