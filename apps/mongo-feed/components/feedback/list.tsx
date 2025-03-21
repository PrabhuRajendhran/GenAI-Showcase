"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorMessage } from "@/components/ui/error-message"

export function FeedbackList() {
  const [recentChats, setRecentChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/feedback/recent")
        if (!response.ok) {
          throw new Error("Failed to fetch recent chats")
        }
        const data = await response.json()
        setRecentChats(data)
      } catch (err) {
        setError("Failed to load recent feedback")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-4">
      {recentChats.map((chat: any) => (
        <div key={chat.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium
            ${
              chat.overallSentiment === "positive"
                ? "bg-emerald-100 text-emerald-700"
                : chat.overallSentiment === "negative"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {chat.overallSentiment.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <p className="font-medium">{chat.mainTopics.join(", ")}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>{chat.messages.length} messages</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
