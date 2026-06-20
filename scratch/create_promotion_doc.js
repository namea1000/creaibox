const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

// 1. Google Drive Client 초기화
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
    console.log("Preparing to create Google Doc for CreAibox Promotion Strategy...");

    // 구글 문서로 변환될 HTML 형식의 본문 내용 정의
    const docTitle = "CreAibox 무료 미디어 라이브러리 홍보 및 시너지 전략";
    const docContentHTML = `
      <h1>CreAibox 무료 미디어 라이브러리 홍보 및 시너지 전략 보고서</h1>
      <p>본 문서는 크리에이박스(CreAibox) 내 무료 미디어 에셋 라이브러리 활성화 및 이미지 제작 요청 통로 개설을 통한 유저 락인(Lock-in), 입소문 마케팅 바이럴 루프 구축, 그리고 플랫폼 내 다른 AI 제작 스튜디오와의 시너지 극대화 방안을 정리한 전략서입니다.</p>

      <hr />

      <h2>1. 핵심 배경 및 서비스 가치</h2>
      <ul>
        <li><strong>기존 무료 에셋 서비스의 한계:</strong> Unsplash, Pixabay 등 기존 무료 스톡 이미지 플랫폼은 이미 만들어진 데이터만 조회/다운로드할 수 있어 유저의 니즈에 정확히 부합하지 못하는 경우가 빈번합니다.</li>
        <li><strong>크리에이박스만의 차별적 강점 (쌍방향 피드백 루프):</strong> 사용자가 필요한 구체적인 이미지를 플랫폼 관리자에게 요청하고, 관리자는 이를 고품질로 즉시 제작하여 공유 에셋에 업로드 및 답변 댓글을 작성합니다.</li>
        <li><strong>가치 창출:</strong> 사용자는 맞춤형 고품질 무료 이미지를 획득하고, 플랫폼은 최신 유저 수요 데이터를 수집하여 에셋 DB를 타겟팅 재생산하며, 신규 유저는 활발한 기여와 공유 문화를 보고 플랫폼 신뢰도를 구축합니다.</li>
      </ul>

      <h2>2. 홍보 및 바이럴 성장 전략 (Growth Loop)</h2>
      <h3>2-1. 제작 완료 알림 및 바이럴 공유 유도</h3>
      <ul>
        <li><strong>제작 완료 알림 자동화:</strong> 관리자가 댓글 등록 시, 이미지 제작을 요청한 유저에게 즉각적인 알림(Email 및 푸시 알림)을 전송하여 재방문을 유도합니다.</li>
        <li><strong>커뮤니티 바이럴 백링크 구축:</strong> 네이버 블로그, Tistory 등 외부 플랫폼에 이미지를 공유할 때 "크리에이박스 무료 라이브러리에 내가 요청해서 제작된 이미지"임을 알리는 자동 서명 출처 링크를 삽입하도록 장려합니다.</li>
      </ul>
      <h3>2-2. 핀터레스트(Pinterest) 연동 자동 핀닝(Pinning)</h3>
      <ul>
        <li>무료 라이브러리에 새 이미지가 업로드되거나 제작 요청으로 완성된 건을 크리에이박스 공식 Pinterest 보드에 자동으로 핀(Pin)하고 상세 페이지 링크를 백링크로 매핑하여 막대한 외부 오가닉 검색 트래픽을 흡수합니다.</li>
      </ul>

      <h2>3. 사이트 내 핵심 스튜디오 시너지 전략 (Cross-Selling)</h2>
      <h3>3-1. 이미지 편집기(Workspace)의 유기적 연동</h3>
      <ul>
        <li>라이브러리 이미지 마우스 호버 시 노출되는 '이미지 편집' 버튼을 통해, 클릭 한 번으로 크리에이박스의 <strong>'이미지 스튜디오 워크스페이스'</strong>로 이미지를 로드하여 자사 이미지 보정, 캔버스 편집 툴의 경험으로 자연스럽게 전환시킵니다.</li>
      </ul>
      <h3>3-2. 무료 에셋 다운로드 화면의 마케팅 깔때기(Funnel)</h3>
      <ul>
        <li>무료 에셋 다운로드 전후 시점에 "AI로 직접 나만의 맞춤형 이미지 3초 만에 무제한 생성하기" 등 유료/구독 스튜디오 기능(Image Studio)으로 유입시키는 크리에이티브 배너 및 숏컷 경로를 유기적으로 배치합니다.</li>
      </ul>

      <h2>4. 장기 스케일업 및 인프라 로드맵</h2>
      <ul>
        <li><strong>스토리지 다원화 및 속도 최적화:</strong> 수만~수십만 장 규모의 에셋 적재 시, 구글 드라이브 API 레이트 리밋 우회를 위해 CDN 및 Cloudflare R2/Supabase Storage 마이그레이션을 추진합니다.</li>
        <li><strong>크레딧/포인트 연동:</strong>
          <ul>
            <li>이미지 제작 요청 1건당 소량의 '커뮤니티 포인트'를 소비하도록 설계하여 악의적 무분별 요청을 방지합니다.</li>
            <li>사용자가 고품질의 본인 제작 에셋을 무료 라이브러리에 공유/기여하는 경우, 보상으로 크리에이박스 AI 생성을 위한 크레딧 포인트를 충전해 주어 건강한 공유 경제 모델을 가동합니다.</li>
          </ul>
        </li>
      </ul>
    `;

    // 2. Google Drive API를 사용해 Google Doc 파일 생성
    // mimeType: 'application/vnd.google-apps.document'로 주면 drive가 자동으로 HTML을 구글 문서로 파싱 및 변환해줌.
    const fileMetadata = {
      name: docTitle,
      mimeType: "application/vnd.google-apps.document",
    };

    const media = {
      mimeType: "text/html",
      body: docContentHTML,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;
    const docUrl = `https://docs.google.com/document/d/${fileId}/edit`;

    console.log("\n==================================================");
    console.log("✔ Google Doc successfully created!");
    console.log(`Document Title: ${docTitle}`);
    console.log(`Document ID: ${fileId}`);
    console.log(`Direct Link: ${docUrl}`);
    console.log("==================================================");

  } catch (err) {
    console.error("Failed to create Google Doc:", err);
  }
}

run();
