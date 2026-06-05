https://creaibox.com/sitemap.xml
https://creaibox.com/robots.txt

✅ Search Console 도메인 인증 완료
✅ robots.txt 완료
✅ sitemap.xml 완료
✅ dynamic sitemap 완료 (published 글 자동 추가)
✅ www → non-www 리다이렉트 완료
✅ 블로그 글 발행 가능
✅ Search Console 사이트맵 성공 처리
✅ 첫 글 sitemap 노출 확인



현재 우선순위

내가 CreAIbox라면 순서 이렇게 함.

오늘
1. Search Console 완료 ✅
2. Sitemap 완료 ✅
3. Revalidate 추가 완료 ✅

4. JSON-LD 스키마 자동 출력 완료 ✅
이건 강력 추천. Google은 Article 구조화 데이터를 추가하면 Google이 페이지 내용을 더 잘 이해하고, 검색 결과에서 제목·이미지·날짜 정보 표시 품질을 높이는 데 도움이 된다고 안내하고 있어.
app/blog/[slug]/page.tsx 수정 완료 

5. Google Indexing API 자동화 : 이건 일반 블로그 글에는 하지 않는 게 맞아.
Google 공식 문서상 Indexing API는 일반 블로그용이 아니라 채용공고(JobPosting) 또는 라이브 방송 페이지(BroadcastEvent + VideoObject) 용도야

현재 CreAIbox SEO 상태를 점수로 보면

도메인 인증         100%
robots.txt         100%
sitemap.xml        100%
동적 사이트맵      100%
블로그 URL 구조    100%
Search Console     100%


이제 SEO 기준으로 남은 중요한 작업은 사실 3개뿐이야.

1. 자동 Revalidate (추천) : 완료 

지금은 글 발행 후에도 캐시 때문에
/blog
목록 페이지가 바로 안 바뀔 수 있음.

발행 버튼 누르면

revalidatePath("/blog");
revalidatePath(`/blog/${slug}`);

자동 실행되게.

효과:

✅ 블로그 목록 즉시 갱신
✅ 새 글 즉시 노출


list/[id]/page.tsx
맞아. 이 파일이 발행 처리 파일이야.

handlePublish 수정했음. 

다만 page.tsx는 "use client"라서 여기서 직접 revalidatePath()를 못 써.
그래서 서버 API 하나 만들고, 발행 성공 후 그 API를 호출하면 돼.

새 파일 생성
app/api/revalidate-blog/route.ts

효과 : 
이제 발행 버튼 누르면:

DB status = published
↓
/blog 목록 갱신
↓
/blog/[slug] 글 상세 갱신
↓
/sitemap.xml 갱신

즉, 새 글 발행 후 sitemap에 바로 반영되는 구조가 됨.

Google Indexing API는 일반 블로그에는 공식 권장 용도가 아니라서, 지금은 sitemap 자동 갱신 + Search Console 제출 방식이 정석이야.

좋아. 오늘 SEO 기본 세팅은 끝났어. 🎉

완료된 것:

Search Console 인증
robots.txt
sitemap.xml
동적 sitemap
발행글 자동 sitemap 반영
www → non-www 통일
URL 색인 요청
JSON-LD 스키마 자동 출력

이제부터는 글 발행만 하면 Google이 인지할 수 있는 구조야.



1. 지금 당장 사이트맵에 넣어야 하는 페이지
예시:

/
 /blog
 /about
 /pricing
 /features
 /contact

그리고
/blog/[slug]
발행된 블로그 글들 완료 ✅

2. 나중에 SEO용으로 넣을 페이지
예시:

/ai-writing
/image-studio
/music-studio
/video-studio
/youtube-tools

서비스 소개 페이지

3. 사이트맵에 넣지 말아야 할 페이지
이건 매우 중요

/studio
/dashboard
/admin
/login
/signup
/account
/profile
/settings

회원 전용 페이지


4. CreAIbox 기준 추천
현재라면

/
/blog
/blog/[slug]

이 3개만 있어도 충분
Google 입장에서는
creaibox.com/blog
아래 글들만 잘 수집해도 됨.

5. 나중에 확장
SEO 허브를 만들 예정이라면

/blog
/news
/tools
/downloads
/tutorials

각각 별도 sitemap으로 분리 가능

/sitemap.xml 완료 ✅
/blog-sitemap.xml
/news-sitemap.xml
/tools-sitemap.xml

대형 사이트들이 쓰는 방식.


그리고 CreAIbox SEO 쪽은 사실상 끝났어.
현재 상태:
✅ 도메인 인증
✅ Search Console 등록
✅ sitemap.xml 자동 생성
✅ published 글 자동 sitemap 등록
✅ canonical URL
✅ JSON-LD Article Schema
✅ Open Graph
✅ robots.txt
✅ www → non-www 통일

이 정도면 일반 블로그 기준으로는 이미 상위권 SEO 구조야.
이제 남은 건:

Google Workspace 인증 완료
support@creaibox.com
contact@creaibox.com
admin@creaibox.com

이메일 생성
그리고
글 20~30개 발행
Search Console 색인 수집 대기