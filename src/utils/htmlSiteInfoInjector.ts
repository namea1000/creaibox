/**
 * ⚡ 스마트 HTML 기본 정보 실시간 동기화 유틸리티
 * 이관 사이트의 커스텀 footer_html 및 header_html 내에
 * 사용자가 변경한 최신 회사명, 연락처, 주소, 이메일, 대표자명, 사업자번호를 100% 안전하게 주입/치환합니다.
 */

export interface SiteInfo {
  companyName?: string;
  phone?: string;
  address?: string;
  email?: string;
  fax?: string;
  repName?: string;
  bizNumber?: string;
}

export function syncSiteInfoIntoHtml(html: string, info: SiteInfo): string {
  if (!html || typeof html !== "string") return html;

  let updated = html;

  // 1. Email 동기화
  if (info.email) {
    updated = updated.replace(/(Email|이메일)\s*:\s*([^\s|<"']+)/gi, `$1: ${info.email}`);
    updated = updated.replace(/mailto:([^\s"'>]+)/gi, `mailto:${info.email}`);
  }

  // 2. Phone / Tel 동기화
  if (info.phone) {
    updated = updated.replace(/(Tel|전화|대표전화|고객센터|Phone)\s*:\s*([^\s|<"']+)/gi, `$1: ${info.phone}`);
    updated = updated.replace(/tel:([^\s"'>]+)/gi, `tel:${info.phone.replace(/[^0-9+]/g, "")}`);
  }

  // 3. Fax 동기화
  if (info.fax) {
    updated = updated.replace(/(Fax|팩스|대표팩스)\s*:\s*([^\s|<"']+)/gi, `$1: ${info.fax}`);
  }

  // 4. 대표자명 동기화
  if (info.repName) {
    updated = updated.replace(/(대표이사|대표자|대표|CEO|President)\s*:\s*([^|<]+)/gi, `$1: ${info.repName}`);
  }

  // 5. 사업자등록번호 동기화
  if (info.bizNumber && info.bizNumber !== "0" && info.bizNumber.trim() !== "") {
    updated = updated.replace(/(사업자등록번호|사업자번호|등록번호)\s*:\s*([0-9-\s]+)/gi, `$1: ${info.bizNumber}`);
  }

  // 6. Address / 본사 / 주소 동기화
  if (info.address) {
    updated = updated.replace(
      /(본사|주소|사업장소재지|소재지|위치|Address)\s*:\s*([^|<]+)/gi,
      `$1: ${info.address}`
    );
    updated = updated.replace(
      /(<h[1-6][^>]*>(?:Address|주소|위치)<\/h[1-6]>\s*<p[^>]*>)([\s\S]*?)(<\/p>)/gi,
      `$1${info.address}$3`
    );
  }

  // 7. 상호명 & Copyright 동기화
  if (info.companyName) {
    const currentYear = new Date().getFullYear();
    updated = updated.replace(
      /(&copy;|©)\s*\d{4}\s+[^.<]+(\.\s*All rights reserved\.?)/gi,
      `$1 ${currentYear} ${info.companyName}$2`
    );
    updated = updated.replace(
      /(Copyright\s+(?:&copy;|©)?\s*\d{4}\s+)([^.<]+)(\.\s*All rights reserved\.?)/gi,
      `$1${info.companyName}$3`
    );
    // 첫 줄 회사 상호: <p>(주)더블유에셋 | -> <p>PHICOT |
    updated = updated.replace(
      /(<p[^>]*>)\s*(?:\(주\)|주식회사)?[가-힣A-Za-z0-9\s.-]+?\s*(\s*\|\s*(?:대표이사|대표자|대표))/gi,
      `$1${info.companyName}$2`
    );
  }

  return updated;
}
