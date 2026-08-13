# Video Studio Large File Rendering & Streaming Solutions

## 1. 배경 및 문제 정의 (Problem Definition)

현재 크리에이박스 비디오 스튜디오(Video Studio)는 웹브라우저 클라이언트 사이드 기반 렌더링 엔진을 사용하고 있습니다. 

* **현재 인프라 상태**: `direct-mp4` 및 `fast-webcodecs` 엔진 등에서 렌더링된 인코딩 데이터 프레임들을 브라우저 메모리(RAM) 내부의 `BufferTarget`에 쌓아 둔 후, 완료 시 `Blob URL` 형태로 브라우저 다운로드를 실행합니다.
* **한계 (OOM 리스크)**: 10분 이내의 짧은 숏폼이나 요약 영상은 문제없이 처리되지만, **1시간~3시간이 넘어가는 대용량/고화질 장편 영상**의 경우 렌더링 과정에서 기가바이트(GB) 단위의 데이터가 브라우저 RAM에 누적됩니다. 브라우저 탭 하나당 할당된 메모리 제한(보통 2GB~4GB)을 초과하는 즉시 **OOM(Out-Of-Memory)으로 인해 브라우저 탭이 강제 종료(크래시)**됩니다.

이 문제를 해결하기 위해, 메모리를 거의 사용하지 않으면서 **인코딩되는 즉시 사용자 PC의 하드디스크(SSD)로 데이터를 실시간 스트리밍 기록하는 3가지 아키텍처 대안**을 정리합니다.

---

## 2. 대용량 렌더링을 위한 3가지 실시간 스트리밍 기록 대안

### 대안 A: FileSystem Access API (Direct Disk Writing)

사용자의 로컬 파일 시스템에 직접 쓰기 스트림을 열어 청크 단위로 파일에 데이터를 기록하는 가장 표준적이고 직관적인 해법입니다.

#### 1) 동작 메커니즘
1. 사용자가 렌더링(수출) 버튼을 클릭하면, 브라우저가 보안상 시스템 다이얼로그인 파일 저장 창(`window.showSaveFilePicker()`)을 실행합니다.
2. 사용자가 저장 경로와 파일명을 입력하여 승인하면, 스크립트가 해당 파일 핸들을 획득하고 **쓰기 스트림(`FileSystemWritableFileStream`)**을 엽니다.
3. 비디오/오디오 인코더가 미디어 청크(예: `Uint8Array`)를 생성할 때마다 `writer.write(chunk)`를 호출하여 **메모리에 들고 있지 않고 실시간으로 사용자 로컬 디스크에 기록**합니다.
4. 모든 프레임 렌더링이 완료되면 `writer.close()`를 통해 스트림을 안전하게 닫습니다.

#### 2) 장점
* **극도로 낮은 메모리 오버헤드**: 버퍼로 쓰이는 소량의 메모리(수 MB 이내)만 소모하므로 수십 GB 크기의 3시간짜리 4K 영상도 메모리 부족 없이 무결하게 렌더링할 수 있습니다.
* **네트워크 독립성**: 서버 요금이 들지 않으며 순수 로컬 자원만 사용하여 연산 비용이 들지 않습니다.
* **임시 파일 불필요**: 인코딩과 동시에 실제 최종 다운로드 폴더에 실제 파일로 즉시 기록됩니다.

#### 3) 단점
* **브라우저 호환성**: Chromium 계열(Chrome, Edge, Opera 등)은 완벽히 지원하나, Firefox나 일부 구형 Safari 브라우저에서는 해당 API가 미지원되어 Fallback(인메모리 방식) 처리가 필요합니다.
* **사용자 개입 필요**: 렌더링을 시작하기 전에 사용자가 반드시 파일 저장 위치를 지정하는 모달창을 직접 수락해야 합니다.

---

### 대안 B: OPFS (Origin Private File System)

브라우저가 웹 사이트 도메인별로 할당해 준 고성능 비공개 가상 파일 시스템 내에 백그라운드 스레드로 임시 파일을 생성하여 기록하는 방식입니다.

#### 1) 동작 메커니즘
1. 렌더링 연산을 백그라운드 웹 워커(Web Worker)에서 실행시킵니다.
2. 웹 워커 내부에서 비공개 격리 스토리지인 OPFS에 비동기로 접근하여 렌더링 전용 임시 파일을 생성합니다.
3. 워커 스레드는 고성능 동기식 쓰기 API인 `FileSystemSyncAccessHandle`을 획득하고, 인코딩되는 청크를 이 임시 파일에 실시간으로 작성합니다.
4. 렌더링이 완료되면 OPFS 내의 임시 파일 바이너리를 standard download 스트림으로 변환하여 사용자의 다운로드 폴더로 내보냅니다.

#### 2) 장점
* **사용자 액션 최소화**: 렌더링 시작 시 `showSaveFilePicker()`와 같은 대화상자 팝업 없이 백그라운드에서 조용히 렌더링을 실행할 수 있습니다.
* **높은 입출력 성능**: 동기식 엑세스 핸들을 사용하므로 디스크 쓰기 오버헤드가 극도로 적으며 렌더링 속도 저하가 거의 없습니다.
* **뛰어난 격리성**: 도메인별로 완전히 격리된 내부 영역을 쓰기 때문에 보안상 안전합니다.

#### 3) 단점
* **디스크 이중 전송**: OPFS라는 임시 브라우저 디렉토리에 전송 후 최종 완료 시 유저의 실제 다운로드 폴더로 다시 한번 복사하는 과정(Disk Read -> Disk Write)이 발생하여 파일이 완성된 시점에 복사 딜레이가 있을 수 있습니다.

---

### 대안 C: StreamSaver.js (Service Worker Redirect)

서비스 워커(Service Worker) 네트워크 가로채기 트릭을 사용하여 브라우저 다운로드 관리자 단에서 실시간 파일 쓰기를 수행하도록 가공하는 방식입니다.

#### 1) 동작 메커니즘
1. 백그라운드에 서비스 워커를 활성화합니다.
2. 렌더링 엔진은 인코딩되는 청크 데이터를 서비스 워커로 지속적으로 파이핑(Piping)하여 전송합니다.
3. 서비스 워커는 해당 데이터 스트림을 HTTP Content-Disposition 헤더가 달린 "서버로부터 다운로드 중인 응답 패킷(ReadableStream Response)"인 것처럼 가짜로 라우팅을 우회합니다.
4. 브라우저는 마치 네트워크를 통해 대용량 파일을 다운로드받는 것처럼 판단하여 브라우저 자체의 "다운로드 엔진"을 작동시키고, 조각들을 실시간으로 로컬 디스크 파일에 적재합니다.

#### 2) 장점
* **넓은 브라우저 호환성**: 서비스 워커를 지원하는 대부분의 브라우저(Safari, Firefox 포함)에서 동작합니다.
* **사용자 개입 없음**: 시작 단계에서 팝업창을 띄우지 않고 자연스러운 웹 다운로드 UX를 제공합니다.

#### 3) 단점
* **안정성 위험**: 인코딩 연산 속도가 아주 느려지거나 중간에 렌더링이 지연되면 브라우저 다운로드 엔진이 네트워크 타임아웃(Timeout) 혹은 다운로드 실패로 오인하여 기록 중인 파일을 파괴하거나 끊어버릴 수 있습니다.
* **복잡한 구현**: 서비스 워커 스크립트 배포 및 탭과의 포스트 메시지 통신 생태계를 관리해야 하므로 디버깅이 까다롭습니다.

---

## 3. 구현 추천 가이드 (CreAibox Architecture Proposal)

크리에이박스는 업무용(비즈니스) AI 콘텐츠 제작 스튜디오이며 주로 크롬/에지 환경에서 프로 크리에이터들이 사용하므로, **안정성이 가장 높고 구조가 직관적인 [대안 A (FileSystem Access API)] 방식을 강력 추천**합니다.

### FileSystem Access API 간이 구현 설계 코드 예시 (MP4 Exporter)

```typescript
import { Output, Mp4OutputFormat } from "mediabunny";

export async function exportStreamingMp4({ canvas, totalDuration, fps, renderFrame }) {
  try {
    // 1. 유저에게 저장할 파일 위치 선택 받기
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: "rendered-video.mp4",
      types: [{
        description: "MP4 Video File",
        accept: { "video/mp4": [".mp4"] }
      }]
    });
    
    // 2. 디스크 직접 쓰기용 스트림 열기
    const writableStream = await fileHandle.createWritable();
    
    // 3. 디바이스의 하드디스크 라이터 어댑터 정의
    const diskTarget = {
      // mediabunny 혹은 비디오 인코더가 조각 데이터를 뱉어낼 때마다 호출
      async write(chunk: Uint8Array) {
        await writableStream.write(chunk);
      },
      async close() {
        await writableStream.close();
      }
    };

    // 4. 인코더 및 Output 빌더 정의
    const output = new Output({
      format: new Mp4OutputFormat({ fastStart: "in-memory" }),
      target: diskTarget // 인메모리 버퍼가 아닌 하드디스크 라이터 연결!
    });
    
    // 5. 프레임 순회 렌더링 루프 실행
    const totalFrames = totalDuration * fps;
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      const time = frameIndex / fps;
      await renderFrame(time); // Canvas에 드로잉
      
      // 인코더에 캔버스 소스를 주입하고 데이터를 디스크로 스트리밍
      // (인코더 내부적으로 diskTarget.write를 자동 호출)
    }
    
    // 6. 스트림 및 파일 닫기
    await diskTarget.close();
    console.log("대용량 비디오가 OOM 없이 성공적으로 디스크에 직접 기록되었습니다.");
    
  } catch (error) {
    console.error("스트리밍 렌더링 중 오류 발생:", error);
  }
}
```

이 문서는 크리에이박스 비디오 스튜디오의 기가바이트(GB)급 장편 비디오 내보내기 성능 최적화를 위한 아키텍처 가이드라인으로 활용됩니다.
