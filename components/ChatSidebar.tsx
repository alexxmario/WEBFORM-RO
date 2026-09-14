"use client";

import { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Room = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  profiles: {
    email: string;
    name?: string;
  };
  latestMessage: string | null;
  latestMessageTime: string | null;
};

type ChatSidebarProps = {
  currentRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  accessToken: string;
};

export function ChatSidebar({ currentRoomId, onRoomSelect, accessToken }: ChatSidebarProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(accessToken) fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/chat/rooms", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch rooms");
        return;
      }

      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  return (
    <div className="flex h-full w-full md:w-80 flex-col border-r border-border/60 bg-card/50">
      <div className="border-b border-border/60 p-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MessageCircle className="h-5 w-5" />
          Conversations
        </h2>
        <p className="text-xs text-muted-foreground">All client conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">Loading conversations...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomSelect(room.id)}
                className={cn(
                  "w-full rounded-xl p-3 text-left transition-colors",
                  currentRoomId === room.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {room.profiles?.name || room.profiles?.email || "Unknown"}
                      </p>
                      {room.latestMessageTime && (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(room.latestMessageTime)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{room.profiles?.email}</p>
                    {room.latestMessage && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {room.latestMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
