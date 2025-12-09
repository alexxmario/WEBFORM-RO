"use client";

import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatSidebar } from "@/components/ChatSidebar";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  sender_email?: string;
};

export default function ChatPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const init = async () => {
      try {
        console.log("Starting initialization...");
        const { data } = await supabase.auth.getSession();
        const user = data.session?.user;
        const token = data.session?.access_token;

        if (!user) {
          console.log("No user found, redirecting to login");
          router.replace("/login");
          return;
        }

        console.log("User found:", user.email);
        setAccessToken(token || "");

        // Fetch user's role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        console.log("Profile fetch result:", { profile, profileError });

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }

        const role = profile?.role || "client";
        console.log("User role determined:", role, "Is admin:", role === "admin");
        setSessionUser({ id: user.id, email: user.email || "", role });

        await initRoom(user.id, user.email || "");
        console.log("Init complete, hiding loading");
        setIsInitialized(true);
      } catch (error) {
        console.error("Critical error during init:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isInitialized, router, supabase]);

  useEffect(() => {
    if (!roomId) return;

    console.log("Setting up room subscription for:", roomId);
    loadMessages(roomId);

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          console.log("New message received via realtime:", payload);
          const record = payload.new as {
            id: string;
            content: string;
            created_at: string;
            sender_id: string;
            room_id: string;
          };

          // Fetch sender email from profiles
          const { data: senderProfile } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", record.sender_id)
            .single();

          setMessages((prev) => [
            ...prev,
            {
              id: record.id,
              content: record.content,
              created_at: record.created_at,
              sender_id: record.sender_id,
              sender_email: senderProfile?.email,
            },
          ]);
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      console.log("Unsubscribing from room:", roomId);
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, supabase]);

  const initRoom = async (userId: string, userEmail: string) => {
    try {
      console.log("Initializing room for:", userId, userEmail);
      const res = await fetch("/api/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: userEmail }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to init room:", res.status, errorText);
        return;
      }

      const data = await res.json();
      console.log("Room initialized:", data.roomId);
      setRoomId(data.roomId);
    } catch (error) {
      console.error("Error initializing room:", error);
    }
  };

  const loadMessages = async (room: string) => {
    try {
      console.log("Loading messages for room:", room);
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id, profiles:sender_id (email)")
        .eq("room_id", room)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      if (data) {
        console.log("Loaded messages:", data.length);
        const mapped: Message[] = data.map((m) => ({
          id: String(m.id),
          content: String(m.content),
          created_at: String(m.created_at),
          sender_id: String(m.sender_id),
          sender_email: Array.isArray(m.profiles) ? m.profiles[0]?.email : m.profiles?.email,
        }));
        setMessages(mapped);
      }
    } catch (error) {
      console.error("Exception loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!roomId || !sessionUser || !messageText.trim()) return;
    const content = messageText.trim();
    setMessageText("");

    const { error } = await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: sessionUser.id,
      content,
    });

    if (error) {
      console.error("Error sending message:", error);
      alert(`Failed to send message: ${error.message}`);
      setMessageText(content); // Restore message on error
    }
  };

  const handleRoomSelect = async (selectedRoomId: string) => {
    setRoomId(selectedRoomId);
    setMessages([]);
  };

  if (loading) {
    return (
      <main className="container flex min-h-screen items-center justify-center px-4 py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const isAdmin = sessionUser?.role === "admin";

  return (
    <>
      <Header />
      <main className="flex min-h-screen pt-20">
        {isAdmin && (
          <ChatSidebar
            currentRoomId={roomId}
            onRoomSelect={handleRoomSelect}
            accessToken={accessToken}
          />
        )}
        <div className={`flex-1 flex flex-col ${isAdmin ? "" : "container px-4 sm:px-8"}`}>
          <div className={`flex-1 flex flex-col gap-4 ${isAdmin ? "p-6" : "py-10"}`}>
            <div className="flex-1 space-y-4 rounded-3xl border border-border/60 bg-card/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isAdmin ? "Admin Support Chat" : "Support chat"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin
                      ? `Viewing conversation • ${sessionUser?.email}`
                      : `Signed in as ${sessionUser?.email}. Messages update in real time.`}
                  </p>
                </div>
              </div>
              <div className="flex h-[60vh] flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-background/80 p-4">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender_id === sessionUser?.id ? "items-end text-right" : "items-start text-left"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">
                        {message.sender_id === sessionUser?.id ? "You" : message.sender_email || "Client"}
                      </div>
                      <div className="mt-1 max-w-[80%] rounded-2xl border border-border/50 bg-card/80 px-3 py-2 text-sm text-foreground">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {!messages.length && (
                    <div className="text-center text-sm text-muted-foreground">
                      {isAdmin ? "No messages in this conversation yet." : "No messages yet. Say hello!"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Textarea
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="min-h-[60px] flex-1"
                  />
                  <Button className="self-end sm:self-auto" onClick={handleSend}>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
