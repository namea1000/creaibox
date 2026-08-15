import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const clientId = process.env.GCP_OAUTH_CLIENT_ID;
const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
oauth2Client.setCredentials({ refresh_token: refreshToken });

const docs = google.docs({ version: "v1", auth: oauth2Client });
const documentId = "1CevHSgtJn0F45KkF6puddN0aQpunjege5OYB5BDBmGU";

async function main() {
  try {
    // 1. Get current document to inspect ranges
    const res = await docs.documents.get({ documentId });
    const content = res.data.body?.content || [];
    
    // Find startIndex of "서론" and total length
    let introIndex = -1;
    let endIndex = 1;
    for (const c of content) {
      if (c.paragraph) {
        const text = c.paragraph.elements?.map(e => e.textRun?.content || "").join("") || "";
        if (text.includes("서론") && introIndex === -1) {
          introIndex = c.startIndex || -1;
        }
      }
      if (c.endIndex && c.endIndex > endIndex) {
        endIndex = c.endIndex;
      }
    }

    console.log(`Intro starts at ${introIndex}, Document ends at ${endIndex}`);

    if (introIndex === -1) {
      console.error("Could not find '서론' in document.");
      return;
    }

    // 2. Prepare the comprehensive blog article text
    const fullArticle = `서론: IT 뉴스 속 '엔진(Engine)'이란 대체 무엇인가?

"구글이 새로운 검색 엔진을 공개했다", "어떤 IT 기업이 독자 AI 추천 엔진을 개발했다..."
테크 뉴스나 IT 기사를 읽다 보면 '엔진(Engine)'이라는 단어를 수없이 접하게 됩니다. 자동차도 아닌 웹사이트나 소프트웨어에 왜 '엔진'이라는 거창한 이름을 붙이는 걸까요?

자동차의 외관이 아무리 날렵한 슈퍼카 디자인이라도 보닛 안의 심장인 '엔진'이 부실하면 시속 100km조차 제대로 달릴 수 없습니다. 소프트웨어와 웹사이트도 마찬가지입니다. 

• 디자인(UI/UX): 사용자의 눈에 보이는 예쁜 버튼, 글자 폰트, 감각적인 레이아웃
• 엔진(Engine): 화면 뒤편에서 데이터를 긁어오고, 생각하고, 초고속으로 계산해 완벽한 화면을 조립해내는 핵심 동력과 처리 기술의 총집합

즉, IT에서 엔진이란 "복잡한 데이터나 사용자의 요구를 입력했을 때, 스스로 판단하고 초고속으로 가공하여 고품질 결과물을 뿜어내는 핵심 시스템"을 뜻합니다.


1. 보통의 홈페이지 vs '강력한 엔진'을 품은 홈페이지의 차이

기존의 평범한 홈페이지 제작 툴들은 단순히 사각형 박스에 글자를 넣고 이미지를 붙여 넣는 정적인 캔버스에 불과했습니다. 수정할 때마다 레이아웃이 깨지고, 모바일 화면에서는 글자가 잘리며, 검색엔진 등록조차 복잡했습니다.

하지만 '독자적인 엔진'을 탑재한 차세대 플랫폼은 완전히 다른 차원의 사용자 경험을 제공합니다. 사용자가 일일이 코딩이나 디자인을 하지 않아도, 엔진이 알아서 고해상도 이미지를 최적화하고, 인터랙티브 애니메이션을 결합하며, 네이버와 구글 검색 로봇에 실시간 신호를 쏘아 올립니다.


2. CreaiBox(creaibox.com)가 개발 중인 커스텀 웹사이트 2대 핵심 엔진

CreaiBox 개발팀은 1인 기업, 소상공인, 영세 자영업자, 스타트업 누구나 전문가 없이도 가장 강력하고 아름다운 비즈니스 홈페이지를 가질 수 있도록 2대 핵심 엔진을 구축하고 있습니다.

① 엔진 1: 『1초 AI 무인 사이트 이관 & 복제 엔진』
오래된 구형 웹사이트(아임웹, 카페24, 워드프레스, 그누보드 등)를 운영하던 사장님이 URL 단 1개만 입력하면 작동하는 무인 이관 엔진입니다.
• 외부 CSS 딥 하베스터(CSS Deep Harvester): 스타일시트 코드 속에 숨겨진 고화질 아파트 조감도나 대형 배경 사진까지 100% 엑스레이처럼 찾아내어 Cloudflare R2 글로벌 CDN에 WebP로 압축 백업합니다.
• 투명 오버레이 & 통합 메가 메뉴 엔진: 마우스 호버 시 90px에서 320px로 부드럽게 펼쳐지며 7단 그리드로 하위 메뉴가 일제히 내려오는 대기업급 럭셔리 헤더를 1초 만에 완성합니다.

② 엔진 2: 『AI 홈페이지 매직 빌더(Magic Builder) 엔진』
기존 사이트가 없어도 괜찮습니다. 업종과 상호명, 몇 가지 키워드만 선택하고 클릭 몇 번만 누르면 최신 트렌드에 최적화된 자사몰 웹사이트가 순식간에 탄생합니다.
• 16종 인터랙티브 컴포넌트 자동 조립:
  - 마우스를 올리면 2배로 선명하게 커지는 '실시간 입지 지도 돋보기(InteractiveLocationMagnifier)'
  - 시선을 사로잡으며 360도 빙글빙글 회전하는 '무한 회전 텍스트 궤도 배지'
  - 스크롤에 맞춰 숫자가 가속 카운트업되는 '통계 카운터'
  - 드래그로 전후를 비교하는 '비포&애프터 비교 슬라이더'
  - 유튜브 TV-CF 광고영상 모달 플레이어, 아이폰 목업 프레임, 15대 소셜 미디어 컬러 배지 등 16가지 프리미엄 부품이 자동으로 조립됩니다.


3. 1인 기업과 자영업자를 위한 CreaiBox의 경제적 혁신

지금까지 제대로 된 비즈니스 웹사이트를 외주 제작하려면 수백만 원의 제작비와 수개월의 시간이 소요되었고, 매달 값비싼 유지보수 비용이 발생했습니다. 자금과 인력이 부족한 1인 창업가나 영세 자영업자에게는 너무나 큰 진입 장벽이었습니다.

CreaiBox(creaibox.com)는 이러한 외주 시장의 비용 거품을 완전히 걷어내고자 합니다.
• 초간단(Zero-Code): 코딩 지식이 전혀 없어도 마우스 클릭 몇 번으로 제작
• 초스피드(0.01s Fast): 네이버 뉴스급 수소폭탄 가속 서빙과 0초 인터넷 실시간 라이브 배포
• 초저비용(Affordable): 부담 없는 가격으로 누구나 엔터프라이즈급 자사몰 소유 가능


4. "곧 개발을 완료하고 베타(Beta) 버전을 오픈합니다!"

CreaiBox 개발팀은 매일매일 개발 일지(Devlog)를 기록하며 엔진의 성능과 안정성을 극한으로 끌어올리고 있습니다. 수많은 사이트 복제 테스트와 AI 매직 빌더 템플릿 연동 작업이 막바지 단계에 도달했습니다.

머지않아 세상의 모든 1인 기업과 자영업자 대표님들이 손쉽게 자신만의 멋진 비즈니스 자사몰을 열 수 있도록, 공식 베타(Beta) 버전을 전격 오픈할 예정입니다.

기술은 멈추는 순간 구식이 됩니다. 
겉모습만 흉내 내는 것을 넘어 보이지 않는 심장(엔진)부터 완벽하게 만들어가는 CreaiBox의 혁신에 많은 기대와 응원을 부탁드립니다!


• 공식 플랫폼: creaibox.com
• 문의 및 사전 알림 신청: creaibox.com 공식 홈페이지`;

    // 3. Delete existing text from introIndex to endIndex - 1, and insert fullArticle
    const requests = [
      {
        deleteContentRange: {
          range: {
            startIndex: introIndex,
            endIndex: endIndex - 1,
          },
        },
      },
      {
        insertText: {
          location: {
            index: introIndex,
          },
          text: fullArticle + "\n",
        },
      },
    ];

    const updateRes = await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });

    console.log("Successfully updated Google Docs document!");
  } catch (err: any) {
    console.error("Error updating doc:", err);
  }
}

main();
