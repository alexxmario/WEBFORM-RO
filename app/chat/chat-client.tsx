"use client";

import { mergeMessages } from "@/lib/chat-messages";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

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

interface ChatClientProps {
  initialUser: {
    id: string;
    email: string;
    role: string;
  };
}

export function ChatClient({ initialUser }: ChatClientProps) {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");

  const activeRoom=useRef<string | null>(null);
  const [sending,setSending]=useState(false);
  const [initError,setInitError]=useState(false);
  const isAdmin = initialUser.role === "admin";

  useEffect(() => {
    const init = async () => {
      try {
        // Get access token for API calls
        const { data } = await supabase.auth.getSession();
        setAccessToken(data.session?.access_token || "");

        await initRoom(initialUser.id, initialUser.email);
      } catch (error) {
        console.error("Error during init:", error);
        setInitError(true);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [initialUser, supabase]);

  useEffect(() => {
    if (!roomId) return;

    activeRoom.current=roomId;
    loadMessages(roomId);

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const record = payload.new as {
            id: string;
            content: string;
            created_at: string;
            sender_id: string;
            room_id: string;
          };

          if(activeRoom.current!==record.room_id) return;
          setMessages(prev=>mergeMessages(prev,[record]));
        },
      )
      .subscribe();

    return () => {
      activeRoom.current=null;
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, supabase]);

  const initRoom = async (userId: string, userEmail: string) => {
    try {
      const res = await fetch("/api/chat/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email: userEmail }),
      });

      if (!res.ok) {
        console.error("Failed to init room:", res.status);
        throw new Error("Chat unavailable");
      }

      const data = await res.json();
      setRoomId(data.roomId);
    } catch (error) {
      console.error("Error initializing room:", error);
      setInitError(true);
    }
  };

  const loadMessages = async (room: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id, profiles:sender_id (email)")
        .eq("room_id", room)
        .order("created_at", { ascending: false }).limit(200);

      if (error) {
        console.error("Error loading messages:", error);
        return;
      }

      if (data) {
        const mapped: Message[] = data.map((m) => {
          const profiles = m.profiles as unknown;
          const email = Array.isArray(profiles)
            ? (profiles[0] as { email?: string })?.email
            : (profiles as { email?: string })?.email;

          return {
            id: String(m.id),
            content: String(m.content),
            created_at: String(m.created_at),
            sender_id: String(m.sender_id),
            sender_email: email,
          };
        });
        if(activeRoom.current===room) setMessages(prev=>mergeMessages(prev,mapped));
      }
    } catch (error) {
      console.error("Exception loading messages:", error);
    }
  };

  const handleSend = async () => {
    if (!roomId || !messageText.trim() || sending) return;
    const content=messageText.trim(),targetRoom=roomId;
    if(content.length>5000){toast.error("Mesajul poate avea maximum 5.000 de caractere.");return;}
    setSending(true);
    try {
      const {data,error}=await supabase.from("messages").insert({room_id:targetRoom,sender_id:initialUser.id,content}).select("id,content,created_at,sender_id").single();
      if(error) throw error;
      if(activeRoom.current===targetRoom){setMessages(prev=>mergeMessages(prev,[data]));setMessageText("");}
    } catch {toast.error("Mesajul nu a fost trimis. Textul a fost păstrat; încearcă din nou.");}
    finally {setSending(false);}
  };

  const handleRoomSelect = async (selectedRoomId: string) => {
    activeRoom.current=selectedRoomId;
    setRoomId(selectedRoomId);
    setMessages([]);
  };

  if(initError) return <><Header/><main id="main" className="container pt-40 text-center"><h1 className="text-2xl">Nu am putut deschide conversația.</h1><button className="action action-dark mt-6" onClick={()=>window.location.reload()}>Încearcă din nou</button></main></>;

  if (loading) {
    return (
      <main className="container flex min-h-screen items-center justify-center px-4 py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <>
      <Header />
      <main id="main" className="flex flex-col md:flex-row min-h-screen pt-24">
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
                    {isAdmin ? "Conversații clienți" : "Chat-ul proiectului tău"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAdmin
                      ? `Cont administrator · ${initialUser.email}`
                      : "Aici primești întrebările, versiunile site-ului și trimiți modificările."}
                  </p>
                </div>
              </div>
              <div className="flex h-[60vh] flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-background/80 p-4">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex flex-col ${
                        message.sender_id === initialUser.id ? "items-end text-right" : "items-start text-left"
                      }`}
                    >
                      <div className="text-xs text-muted-foreground">
                        {message.sender_id === initialUser.id ? "Tu" : isAdmin ? message.sender_email || "Client" : "Echipa WebForm"}
                      </div>
                      <div className="mt-1 max-w-[80%] rounded-2xl border border-border/50 bg-card/80 px-3 py-2 text-sm text-foreground">
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {!messages.length && (
                    <div className="text-center text-sm text-muted-foreground">
                      {isAdmin ? "Conversația nu are încă mesaje." : "După formular, mesajul de bun venit și pașii proiectului apar aici."}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Textarea
                    aria-label="Mesaj"
                    maxLength={5000}
                    disabled={sending}
                    placeholder="Scrie un mesaj..."
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
                  <Button disabled={sending || !roomId || !messageText.trim()} className="self-end sm:self-auto" onClick={handleSend}>
                    <Send className="mr-2 h-4 w-4" />
                    {sending ? "Se trimite..." : "Trimite"}
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
