# UI/UX 레이아웃 안정화 및 세션 깜빡임 방지 규칙
(UI Layout Stabilization & Auth Session Flicker Prevention Rules)

이 문서는 CreAibox 서비스 개발 중 발생할 수 있는 레이아웃 흔들림(Layout Shift) 및 사용자 세션 로딩에 따른 화면 깜빡임(Flicker) 문제를 근본적으로 예방하기 위한 아키텍처 규칙과 모범 사례를 정의합니다. 향후 모든 페이지 및 헤더/푸터 등 공통 레이아웃 개발 시 이 규칙을 100% 준수해야 합니다.

---

## 1. 이미지 로고 및 미디어 자산 등록 규칙

### [문제점]
로고 이미지 자체에 여백이 존재하거나, 코드 상의 렌더링 비율이 실제 이미지 비율과 불일치할 경우 다음과 같은 문제가 발생합니다.
* CSS `padding`, `margin`, `object-fit` 속성 조절만으로는 로고의 정확한 수직/수평 가운데 정렬(Alignment)을 맞추기 어렵고, 블록 선택 시 빈 여백이 도드라져 심미성을 해침.
* Next.js `<Image>` 컴포넌트의 `width`와 `height` 설정이 실제 자산의 비율과 어긋나 이미지 찌그러짐이나 레이아웃 왜곡이 발생함.

### [해결 규칙]
1. **자산 원본의 완벽한 크롭 (Asset Margin Trimming)**:
   * 로고나 아이콘 등의 중요 이미지 자산은 반드시 배경을 투명화(Alpha Channel)하고 글자나 그래픽의 외곽선 경계까지 여백 없이 완전히 크롭(Trim)한 상태로 저장해야 합니다.
   * 필요 시 빌드 스크립트나 Node.js `sharp` 라이브러리를 활용해 자동 크롭 및 투명화 처리를 수행하십시오.
2. **고유 비율 매핑 (Aspect Ratio Mapping)**:
   * 이미지의 실제 가로세로 비율(Aspect Ratio)을 정확하게 계산하여 Next.js `<Image width={...} height={...} />` 속성에 매핑해야 합니다.
   * 예: 크롭된 로고의 실제 비율이 `5.77:1`이고 높이를 `32px`로 고정하려면, 너비는 정확히 `185px`로 설정해야 합니다 ($32 \times 5.77 = 184.64$).

---

## 2. 인증 세션 깜빡임 방지 규칙 (Flicker-Free UX)

### [문제점]
Supabase, Firebase 등 외부 인증(Auth) 서비스는 페이지 마운트 후 세션 검증을 위해 반드시 비동기 네트워크 통신을 거칩니다. 이 지연 시간 동안의 상태 전환이 사용자에게 노출되면 심각한 깜빡임이 발생합니다.
* **상태 전이 흐름 (Bad)**: 페이지 로드 즉시 비로그인 상태(회원가입/로그인 버튼) 노출 $\rightarrow$ 수십ms 후 유저 세션 감지 및 이메일 주소 노출 $\rightarrow$ 수백ms 후 DB 프로필 조회 완료 및 닉네임 노출.
* 이 과정이 페이지 이동할 때마다 눈에 보일 정도로 빠르게 반복되며 UX 품질을 저하시킵니다.

### [해결 규칙]
1. **로컬 스토리지 캐싱 (Client-Side Session Caching)**:
   * 사용자의 유저 객체 및 프로필 데이터(닉네임 등)는 로그인 완료 즉시 브라우저의 `localStorage` 또는 `sessionStorage`에 안전하게 캐싱해야 합니다.
   * 컴포넌트 마운트 시 최초 상태값(Initial State)을 캐시로부터 동기적으로 읽어와 즉시 화면에 렌더링하십시오.
   ```typescript
   // 예시 코드 (React useState 초기값 패턴)
   const [user, setUser] = useState<User | null>(() => {
     if (typeof window !== "undefined") {
       const cached = localStorage.getItem("creaibox_cached_user");
       return cached ? JSON.parse(cached) : null;
     }
     return null;
   });
   ```
2. **백그라운드 최신화 (Background Revalidation)**:
   * 캐시된 상태로 화면을 먼저 렌더링한 직후, 백그라운드에서 비동기로 Supabase 세션 및 프로필 조회를 수행하여 정보가 변경되었을 때만 자연스럽게 상태와 캐시를 갱신하십시오.

---

## 3. 레이아웃 안정성 및 흔들림(Layout Shift) 격리 규칙

### [문제점]
사용자의 로그인 상태 전환, 혹은 닉네임의 글자수 변화에 따라 영역의 너비가 동적으로 변하면 헤더나 푸터 내부의 인접 요소들이 밀려나고 당겨지는 레이아웃 쉬프트가 발생합니다.

### [해결 규칙]
1. **고정 가로폭 컨테이너 Enclosure**:
   * 로그인 세션 영역, 로그인 버튼 영역 등 상태에 따라 텍스트가 가변적인 영역은 반드시 최대/고정 너비를 적용하고 `shrink-0` 속성을 주어 가로폭 변화를 물리적으로 격리해야 합니다.
   * 예: 로그인 버튼 컨테이너와 비로그인 가입/로그인 버튼 그룹 컨테이너의 가로폭을 둘 다 동일하게 `w-[180px]`로 고정하여 상태 전환 시 단 1픽셀도 흔들리지 않게 차단합니다.
2. **넘침 방지 (Text Truncation)**:
   * 사용자의 이메일이나 닉네임이 길어질 경우를 대비해, 텍스트 출력 요소에 `truncate` 클래스를 지정하여 영역 너비를 벗어나는 텍스트가 레이아웃을 무너뜨리지 않고 말줄임표(...)로 안전하게 생략되도록 보장합니다.
3. **로딩 프레임 스켈레톤 선점 (Loading Skeleton Reservation)**:
   * 최초 진입 등으로 캐싱 정보가 없어 부득이하게 세션을 대기해야 할 때(`isAuthReady`가 false일 때), 비로그인 뷰로 성급하게 보여주지 말고 동일한 높이와 너비를 가진 **스켈레톤 플레이스홀더(Skeleton Placeholder)**를 렌더링하여 레이아웃 전체 구조를 견고히 유지하십시오.
   ```tsx
   {!isAuthReady ? (
     // 안정적인 크기의 로딩 스켈레톤
     <div className="h-14 w-[180px] rounded-2xl bg-slate-100 animate-pulse shrink-0" />
   ) : user ? (
     // 로그인 프로필 뷰 (w-[180px])
     <button className="w-[180px] shrink-0 ...">...</button>
   ) : (
     // 비로그인 뷰 (w-[180px])
     <div className="w-[180px] shrink-0 ...">...</div>
   )}
   ```
