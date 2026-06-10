Google Workspace 메일 설정이야.
Vercel DNS에 MX 레코드를 추가해야 한다.
Google Workspace용 MX 레코드:

Priority 1
ASPMX.L.GOOGLE.COM

Priority 5
ALT1.ASPMX.L.GOOGLE.COM

Priority 5
ALT2.ASPMX.L.GOOGLE.COM

Priority 10
ALT3.ASPMX.L.GOOGLE.COM

Priority 10
ALT4.ASPMX.L.GOOGLE.COM

Vercel에서는 매우 쉽게 가능.

현재 화면에서:

Add DNS Preset
↓
Google Workspace
선택
↓
자동으로 MX 레코드 5개 생성
↓
저장

그 다음 약 5분~1시간 정도 지나면
예를 들어

admin@creaibox.com
support@creaibox.com
contact@creaibox.com

같은 메일을 사용할 수 있게 된다.


google-site-verification=DByGWT9fw53BLzgf3mAQWHMC7h4s47mbbiUaGySP1bc


터미널애 아래 2개(1개씩) 쳐봐서 TXT, CNAME 값 나오면 DNS 100% 정상. 상적으로 등록 된 것임. 
dig TXT creaibox.com
dig CNAME otvazsfaim4s.creaibox.com
