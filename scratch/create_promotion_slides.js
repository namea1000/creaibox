const { google } = require("googleapis");
require("dotenv").config({ path: "./.env.local" });

// 1. Google Client 초기화
function getOAuth2Client() {
  const clientId = process.env.GCP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GCP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GCP_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GCP OAuth2 credentials are not fully configured in .env.local.");
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return oauth2Client;
}

async function run() {
  try {
    const auth = getOAuth2Client();
    const slides = google.slides({ version: "v1", auth });
    
    console.log("Preparing to create Google Slides presentation...");

    // A. 새 프레젠테이션 생성
    const presentation = await slides.presentations.create({
      requestBody: {
        title: "CreAibox 무료 미디어 라이브러리 홍보 및 시너지 전략",
      },
    });

    const presentationId = presentation.data.presentationId;
    console.log(`Created Presentation ID: ${presentationId}`);

    // B. 슬라이드 일괄 편집 업데이트 (batchUpdate)
    // 5장의 슬라이드를 정의하고 텍스트 및 박스를 생성합니다.
    const slidesData = [
      {
        id: "slide_1_cover",
        title: "CreAibox 무료 미디어 라이브러리\n홍보 및 시너지 전략",
        subtitle: "에셋 제작 요청 피드백 루프와 서비스 확장 전략\n\n2026. 06. 20\n크리에이박스 스튜디오",
        isCover: true
      },
      {
        id: "slide_2_overview",
        title: "1. 무료 미디어 라이브러리 개요 & 가치",
        body: "• 목적: 고품질 무료 미디어를 매개로 한 마케팅 깔때기 및 바이럴 허브 구축\n\n• 핵심 차별화 요소 (쌍방향 피드백 루프):\n  - 기존 단방향 검색(Pixabay, Unsplash)의 한계 극복\n  - 사용자가 '요청'하고 관리자가 '만들어주는' 소통 창구 제공\n\n• 가치 창출: 사용자 맞춤형 에셋 수급 및 에셋 재생산 생태계 순환"
      },
      {
        id: "slide_3_growth",
        title: "2. 홍보 및 바이럴 성장 전략 (Growth Loop)",
        body: "• 제작 완료 피드백 알림:\n  - 이미지 제작 완료 시 이메일/알림 연동을 통해 재방문 유도\n\n• 핀터레스트(Pinterest) 연동 자동화:\n  - 제작 완료 이미지를 공식 보드에 자동 핀(Pin)하여 해외 검색 트래픽 유입\n\n• 출처 링크 서명 백링크:\n  - 외부 블로그 공유 시 자동 링크 출처 삽입을 통한 도메인 파워 강화"
      },
      {
        id: "slide_4_synergy",
        title: "3. 서비스 내 핵심 스튜디오 시너지 전략",
        body: "• 원클릭 이미지 편집기(Workspace) 연동:\n  - 라이브러리 에셋에서 클릭 한 번으로 편집 스튜디오에 원본 로드\n\n• AI 스튜디오 전환 마케팅 깔때기:\n  - 다운로드 전후 유저 흐름 내 '직접 AI 이미지 생성하기' 배너 노출\n  - 무료 회원 유입을 핵심 유료 기능(구독)으로 전환시키는 교두보"
      },
      {
        id: "slide_5_roadmap",
        title: "4. 장기 스케일업 및 로드맵",
        body: "• 인프라 확장:\n  - 수십만 장 규모 에셋 증가에 맞춰 Cloudflare R2 / Supabase Storage 마이그레이션\n\n• 커뮤니티 기여 경제 구축 (포인트 연동):\n  - 제작 요청 시 포인트 소비제 적용 (어뷰징 및 과부하 방지)\n  - 고품질 개인 에셋을 기여한 회원에게 AI 생성 크레딧 보상 제공"
      }
    ];

    const requests = [];

    // Slides API의 기본 생성 슬라이드(보통 1장 존재) 획득
    // 첫 페이지는 기본 덮어쓰고, 두 번째 페이지부터 새로 생성
    const defaultSlideId = presentation.data.slides && presentation.data.slides[0] ? presentation.data.slides[0].objectId : null;

    slidesData.forEach((slide, index) => {
      let pageId = slide.id;
      
      // 1. 표지 슬라이드는 기본 첫 슬라이드 ID를 덮어쓰거나, 없으면 새로 생성
      if (index === 0 && defaultSlideId) {
        pageId = defaultSlideId;
      } else {
        requests.push({
          createSlide: {
            objectId: pageId,
            insertionIndex: index,
            slideLayoutReference: {
              predefinedLayout: "BLANK"
            }
          }
        });
      }

      // 2. 텍스트 박스 배치용 ID 정의
      const titleId = `title_${index}`;
      const bodyId = `body_${index}`;

      if (slide.isCover) {
        // 표지 스타일 텍스트박스
        // 제목 박스
        requests.push({
          createShape: {
            objectId: titleId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              pageObjectId: pageId,
              size: {
                width: { magnitude: 650, unit: "PT" },
                height: { magnitude: 120, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 100,
                unit: "PT"
              }
            }
          }
        });
        requests.push({
          insertText: {
            objectId: titleId,
            text: slide.title
          }
        });
        // 제목 폰트 스타일 적용
        requests.push({
          updateTextStyle: {
            objectId: titleId,
            textRange: { type: "ALL" },
            style: {
              fontSize: { magnitude: 32, unit: "PT" },
              bold: true,
              foregroundColor: { opaqueColor: { rgbColor: { red: 0.1, green: 0.2, blue: 0.5 } } }
            },
            fields: "fontSize,bold,foregroundColor"
          }
        });

        // 부제목 박스
        requests.push({
          createShape: {
            objectId: bodyId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              pageObjectId: pageId,
              size: {
                width: { magnitude: 650, unit: "PT" },
                height: { magnitude: 150, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 240,
                unit: "PT"
              }
            }
          }
        });
        requests.push({
          insertText: {
            objectId: bodyId,
            text: slide.subtitle
          }
        });
        requests.push({
          updateTextStyle: {
            objectId: bodyId,
            textRange: { type: "ALL" },
            style: {
              fontSize: { magnitude: 14, unit: "PT" },
              foregroundColor: { opaqueColor: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } }
            },
            fields: "fontSize,foregroundColor"
          }
        });

      } else {
        // 일반 슬라이드 스타일
        // 제목 박스
        requests.push({
          createShape: {
            objectId: titleId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              pageObjectId: pageId,
              size: {
                width: { magnitude: 650, unit: "PT" },
                height: { magnitude: 50, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 40,
                unit: "PT"
              }
            }
          }
        });
        requests.push({
          insertText: {
            objectId: titleId,
            text: slide.title
          }
        });
        requests.push({
          updateTextStyle: {
            objectId: titleId,
            textRange: { type: "ALL" },
            style: {
              fontSize: { magnitude: 22, unit: "PT" },
              bold: true,
              foregroundColor: { opaqueColor: { rgbColor: { red: 0.1, green: 0.2, blue: 0.5 } } }
            },
            fields: "fontSize,bold,foregroundColor"
          }
        });

        // 본문 박스
        requests.push({
          createShape: {
            objectId: bodyId,
            shapeType: "TEXT_BOX",
            elementProperties: {
              pageObjectId: pageId,
              size: {
                width: { magnitude: 650, unit: "PT" },
                height: { magnitude: 280, unit: "PT" }
              },
              transform: {
                scaleX: 1, scaleY: 1,
                translateX: 50, translateY: 110,
                unit: "PT"
              }
            }
          }
        });
        requests.push({
          insertText: {
            objectId: bodyId,
            text: slide.body
          }
        });
        requests.push({
          updateTextStyle: {
            objectId: bodyId,
            textRange: { type: "ALL" },
            style: {
              fontSize: { magnitude: 13, unit: "PT" },
              foregroundColor: { opaqueColor: { rgbColor: { red: 0.2, green: 0.2, blue: 0.2 } } }
            },
            fields: "fontSize,foregroundColor"
          }
        });
      }
    });

    console.log("Applying batch update to populate slides content...");
    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: {
        requests
      }
    });

    const slidesUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    console.log("\n==================================================");
    console.log("✔ Google Slides successfully created!");
    console.log(`Slides Title: CreAibox 무료 미디어 라이브러리 홍보 및 시너지 전략`);
    console.log(`Slides ID: ${presentationId}`);
    console.log(`Direct Link: ${slidesUrl}`);
    console.log("==================================================");

  } catch (err) {
    console.error("Failed to create Google Slides:", err);
  }
}

run();
