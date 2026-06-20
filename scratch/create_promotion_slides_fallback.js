const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

// 1. Google Client 초기화
function getDriveClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in .env.local.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

async function run() {
  try {
    const drive = getDriveClient();
    console.log("Attempting to create Google Slides using Drive HTML conversion fallback...");

    // 슬라이드 형식으로 자동 변환되도록 HTML 본문을 <section>으로 나누어 구성합니다.
    const docTitle = "CreAibox 무료 미디어 라이브러리 홍보 및 시너지 전략 (Slides)";
    const slidesHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Arial', sans-serif; }
          h1 { color: #0f172a; }
          h2 { color: #1e3a8a; }
          p, li { color: #334155; font-size: 14px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <!-- Slide 1 -->
        <section>
          <h1>CreAibox 무료 미디어 라이브러리<br>홍보 및 시너지 전략</h1>
          <h3>에셋 제작 요청 피드백 루프와 서비스 확장 전략</h3>
          <p>2026. 06. 20<br>크리에이박스 스튜디오</p>
        </section>

        <hr>

        <!-- Slide 2 -->
        <section>
          <h2>1. 무료 미디어 라이브러리 개요 & 가치</h2>
          <ul>
            <li><strong>목적:</strong> 고품질 무료 미디어를 매개로 한 마케팅 깔때기 및 바이럴 허브 구축</li>
            <li><strong>핵심 차별화 요소 (쌍방향 피드백 루프):</strong></li>
            <ul>
              <li>기존 단방향 검색(Pixabay, Unsplash)의 한계 극복</li>
              <li>사용자가 '요청'하고 관리자가 '만들어주는' 소통 창구 제공</li>
            </ul>
            <li><strong>가치 창출:</strong> 사용자 맞춤형 에셋 수급 및 에셋 재생산 생태계 순환</li>
          </ul>
        </section>

        <hr>

        <!-- Slide 3 -->
        <section>
          <h2>2. 홍보 및 바이럴 성장 전략 (Growth Loop)</h2>
          <ul>
            <li><strong>제작 완료 피드백 알림:</strong> 이미지 제작 완료 시 이메일/알림 연동을 통해 재방문 유도</li>
            <li><strong>핀터레스트(Pinterest) 연동 자동화:</strong> 제작 완료 이미지를 공식 보드에 자동 핀(Pin)하여 해외 검색 트래픽 유입</li>
            <li><strong>출처 링크 서명 백링크:</strong> 외부 블로그 공유 시 자동 링크 출처 삽입을 통한 도메인 파워 강화</li>
          </ul>
        </section>

        <hr>

        <!-- Slide 4 -->
        <section>
          <h2>3. 서비스 내 핵심 스튜디오 시너지 전략</h2>
          <ul>
            <li><strong>원클릭 이미지 편집기(Workspace) 연동:</strong> 라이브러리 에셋에서 클릭 한 번으로 편집 스튜디오에 원본 로드</li>
            <li><strong>AI 스튜디오 전환 마케팅 깔때기:</strong></li>
            <ul>
              <li>다운로드 전후 유저 흐름 내 '직접 AI 이미지 생성하기' 배너 노출</li>
              <li>무료 회원 유입을 핵심 유료 기능(구독)으로 전환시키는 교두보</li>
            </ul>
          </ul>
        </section>

        <hr>

        <!-- Slide 5 -->
        <section>
          <h2>4. 장기 스케일업 및 로드맵</h2>
          <ul>
            <li><strong>인프라 확장:</strong> 수십만 장 규모 에셋 증가에 맞춰 Cloudflare R2 / Supabase Storage 마이그레이션</li>
            <li><strong>커뮤니티 기여 경제 구축 (포인트 연동):</strong></li>
            <ul>
              <li>제작 요청 시 포인트 소비제 적용 (어뷰징 및 과부하 방지)</li>
              <li>고품질 개인 에셋을 기여한 회원에게 AI 생성 크레딧 보상 제공</li>
            </ul>
          </ul>
        </section>
      </body>
      </html>
    `;

    // Google Drive API를 사용해 PPT 형식으로 변환하여 업로드 요청
    // mimeType: 'application/vnd.google-apps.presentation' (프레젠테이션 형식)
    // media.mimeType: 'text/html'
    const fileMetadata = {
      name: docTitle,
      mimeType: "application/vnd.google-apps.presentation",
    };

    const media = {
      mimeType: "text/html",
      body: slidesHTML,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;
    const slidesUrl = `https://docs.google.com/presentation/d/${fileId}/edit`;

    console.log("\n==================================================");
    console.log("✔ Google Slides successfully created via Fallback!");
    console.log(`Slides Title: ${docTitle}`);
    console.log(`Slides ID: ${fileId}`);
    console.log(`Direct Link: ${slidesUrl}`);
    console.log("==================================================");

  } catch (err) {
    console.error("Failed to create Google Slides via fallback:", err);
  }
}

run();
