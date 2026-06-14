"use client";

import { useParams } from "next/navigation";
import ChatRoom from "./components/ChatRoom";

export default function CommunitySectionPage() {
  const { section } = useParams<{ section: string }>();

  return <ChatRoom section={section || "chat"} />;
}

