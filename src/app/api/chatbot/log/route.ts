import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 1. GET: Fetch chatbot interactions & compute aggregated analytics for admin dashboard
export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // Fetch all logs ordered by creation date descending
    const { data: logs, error } = await supabase
      .from("chatbot_interactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database fetch error for chatbot logs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalCount = logs.length;
    
    // Calculate unique users count
    const uniqueEmails = new Set(logs.map((log) => log.user_email));
    const uniqueUsers = uniqueEmails.size;

    // Calculate match rate
    const matchedCount = logs.filter((log) => log.matched).length;
    const matchRate = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 100;

    // Unresolved questions requested by users
    const unansweredRequests = logs.filter((log) => !log.matched && log.feedback_status === "requested");

    // Group chat logs by user email for history restoration
    const userConversations: Record<string, typeof logs> = {};
    // Sort logs ascending for natural conversation flow inside viewer
    const sortedLogs = [...logs].reverse();
    sortedLogs.forEach((log) => {
      if (!userConversations[log.user_email]) {
        userConversations[log.user_email] = [];
      }
      userConversations[log.user_email].push(log);
    });

    return NextResponse.json({
      summary: {
        totalCount,
        uniqueUsers,
        matchRate,
        unansweredCount: unansweredRequests.length,
      },
      userConversations,
      unansweredRequests,
      allLogs: logs,
    });
  } catch (err: any) {
    console.error("GET chatbot logs unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST: Log a new chatbot message exchange
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userQuestion, botResponse, matched } = body;

    if (!userQuestion || botResponse === undefined) {
      return NextResponse.json(
        { error: "필수 로깅 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_interactions")
      .insert([
        {
          user_email: userEmail || "anonymous",
          user_question: userQuestion,
          bot_response: botResponse,
          matched: matched !== undefined ? matched : true,
          feedback_status: "none",
        },
      ])
      .select();

    if (error) {
      console.error("Database insert error for chatbot logs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("POST chatbot log unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PATCH: Update unresolved query feedback status
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, feedbackStatus } = body;

    if (!id || !feedbackStatus) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("chatbot_interactions")
      .update({ feedback_status: feedbackStatus })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Database update error for chatbot feedback:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("PATCH chatbot feedback unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
