export interface Message {
  id: string;
  sender: string;
  avatarColor: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  isBot?: boolean;
  badge?: string;
}

export interface Creator {
  name: string;
  role: string;
  status: "online" | "away" | "offline";
  avatarColor: string;
}

export interface Channel {
  id: string;
  title: string;
  desc: string;
  icon: string; // Dynamic icon component name from Lucide
  color: string;
  badgeColor: string;
  unreadCount?: number;
}
