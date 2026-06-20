const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

function getAuthClient() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in environment variables.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}

const categories = [
  // 1. 자연 & 풍경
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "바다 & 해변 (Sea & Beach)", tertiary: "에메랄드빛 해변, 파도치는 바위 해안, 일몰 비치, 백사장 코코넛 야자수" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "산 & 계곡 (Mountains & Valleys)", tertiary: "눈 덮인 고산, 피오르드 협곡, 가을 단풍 산길, 안개 낀 침엽수림" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "강 & 호수 (Rivers & Lakes)", tertiary: "거울 같은 호수 잔물결, 울창한 강변 숲, 폭포수가 떨어지는 계곡" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "하늘 & 우주 (Sky & Space)", tertiary: "푸른 하늘과 뭉게구름, 노을빛 황혼, 은하수가 수놓아진 밤하늘, 신비로운 오로라" },
  { primary: "자연 & 풍경 (Nature & Landscapes)", secondary: "날씨 & 계절 (Weather & Seasons)", tertiary: "비 내리는 도시 창가, 눈 내리는 겨울 가로등, 벚꽃이 날리는 봄 길, 낙엽 쌓인 벤치" },

  // 2. 동식물
  { primary: "동식물 (Flora & Fauna)", secondary: "반려동물 (Pets)", tertiary: "해맑게 웃는 강아지, 낮잠 자는 고양이, 잔디밭을 뛰어노는 골든 리트리버, 털 뭉치 아기 고양이" },
  { primary: "동식물 (Flora & Fauna)", secondary: "꽃 & 정원 (Flowers & Gardens)", tertiary: "활짝 핀 붉은 장미, 해바라기 밭, 들판의 라벤더, 안개꽃 다발" },
  { primary: "동식물 (Flora & Fauna)", secondary: "야생 동물 (Wildlife)", tertiary: "숲속의 사슴, 하늘을 나는 독수리, 나뭇가지 위 아기 새, 귀여운 다람쥐" },
  { primary: "동식물 (Flora & Fauna)", secondary: "식물 & 숲 (Plants & Forests)", tertiary: "몬스테라 초록 잎사귀, 선인장 정원, 피톤치드 가득한 대나무 숲" },

  // 3. 인물 & 일상
  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "인물 프로필 (Portraits)", tertiary: "자연스러운 미소의 남성, 카메라를 응시하는 여성, 빈티지 흑백 인물 프로필" },
  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "라이프스타일 (Lifestyle)", tertiary: "카페에서 커피를 마시는 모습, 책을 읽는 일상, 조깅하는 사람, 가족과의 캠핑" },
  { primary: "인물 & 일상 (People & Lifestyle)", secondary: "감성 & 무드 (Moods)", tertiary: "창밖을 바라보는 쓸쓸함, 활기차게 웃는 웃음소리, 아늑한 벽난로 앞 온기" },

  // 4. 비즈니스 & 테크
  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "오피스 라이프 (Office)", tertiary: "회의실 브레인스토밍, 노트북 작업대, 모던 오피스 인테리어, 정장을 입은 팀원들" },
  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "IT & 테크놀로지 (Technology)", tertiary: "사이버펑크 데이터 센터, 인공지능 로봇 손, 코딩 중인 화면, 가상현실 VR 헤드셋" },
  { primary: "비즈니스 & 테크 (Business & Tech)", secondary: "기획 & 금융 (Planning & Finance)", tertiary: "주식 차트 화면, 포스트잇이 붙은 화이트보드, 깔끔하게 정리된 그래프 리포트" },

  // 5. 예술 & 배경 디자인
  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "추상화 & 그래픽 (Abstract Art)", tertiary: "다채로운 액체 아크릴 마블링, 네온 기하학 패턴, 미니멀리즘 3D 오브젝트" },
  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "템플릿 배경 (Background Templates)", tertiary: "제품 촬영용 파스텔톤 스탠드, 질감이 살아있는 질석 벽면, 대리석 텍스처 백그라운드" },
  { primary: "예술 & 배경 디자인 (Art & Backgrounds)", secondary: "일러스트 & 아트워크 (Illustrations)", tertiary: "동화 같은 수채화 일러스트, 레트로 픽셀 아트, 플랫 디자인 벡터 아이콘" }
];

async function main() {
  const auth = getAuthClient();
  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });

  console.log("Creating Google Spreadsheet...");
  
  // 1. Google Spreadsheet 파일 생성
  const driveResponse = await drive.files.create({
    requestBody: {
      name: "CreAIbox AI 콘텐츠 카테고리 및 이미지 프롬프트 설계서",
      mimeType: "application/vnd.google-apps.spreadsheet",
      parents: [process.env.GDRIVE_FREE_ASSETS_FOLDER_ID] // 무료 에셋 루트 폴더 하위에 생성하여 정리
    },
    fields: "id, name"
  });

  const spreadsheetId = driveResponse.data.id;
  console.log(`Created Spreadsheet ID: ${spreadsheetId}`);

  // 2. 누구나 볼 수 있도록 읽기 권한 추가
  await drive.permissions.create({
    fileId: spreadsheetId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
  console.log("Permission granted: anyone can view.");

  // 3. 첫 번째 시트에 카테고리 데이터 주입
  const headers = [
    ["1차 대분류 카테고리 (Primary)", "2차 중분류 카테고리 (Secondary)", "3차 소분류 추천 키워드 (Tertiary Keywords)", "대량 생성용 이미지 프롬프트 (Image Prompts)", "생성 방식 (Tool)", "업로드 링크 (Link)"]
  ];

  const rows = categories.map((c) => [c.primary, c.secondary, c.tertiary, "", "", ""]);
  const values = [...headers, ...rows];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "시트1!A1",
    valueInputOption: "RAW",
    requestBody: { values },
  });

  // 4. 셀 스타일 포맷팅 (헤더 배경색 및 폰트 강조) 적용
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 6
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.08, green: 0.18, blue: 0.36 }, // 남색 톤
                textFormat: {
                  bold: true,
                  foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, // 하얀색 글씨
                  fontSize: 10
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE"
              }
            },
            fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)"
          }
        },
        {
          // 열 너비 자동 맞춤
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 6
            }
          }
        }
      ]
    }
  });

  console.log("Spreadsheet initialization succeeded!");
  console.log(`Open in Browser: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
}

main().catch((err) => {
  console.error("Execution failed:", err);
});
