// PortOne 결제 설정
export const PORTONE_CONFIG = {
    // 테스트 환경 설정 (실제 운영시에는 실제 가맹점 코드로 변경 필요)
    IMP_CODE: 'imp10391932', // PortOne 가맹점 식별코드

    // PG사 설정
    PG_PROVIDERS: {
        INICIS: 'html5_inicis',      // 이니시스
        KCP: 'kcp',                  // KCP
        TOSS_PAYMENTS: 'tosspay',    // 토스페이먼츠
        PAYPAL: 'paypal',            // 페이팔
        KAKAO: 'kakaopay'            // 카카오페이
    },

    // 기본 PG사
    DEFAULT_PG: 'html5_inicis',

    // 결제 방법 코드 매핑
    PAY_METHODS: {
        CARD: 'card',              // 신용카드
        TRANSFER: 'trans',         // 실시간 계좌이체  
        VIRTUAL_BANK: 'vbank',     // 가상계좌
        PHONE: 'phone',            // 휴대폰 소액결제
        KAKAO_PAY: 'kakaopay',     // 카카오페이
        NAVER_PAY: 'naverpay',     // 네이버페이
        PAYCO: 'payco',            // 페이코
        TOSS: 'tosspay'            // 토스페이
    },

    // 결제 환경 설정
    PAYMENT_ENV: {
        CURRENCY: 'KRW',           // 통화
        LANGUAGE: 'ko',            // 언어
        DISPLAY: {
            CARD_QUOTA: [0, 2, 3, 6, 12], // 할부 개월수 옵션
        }
    },

    // 콜백 URL 설정 (실제 운영시에는 실제 도메인으로 변경 필요)
    CALLBACK_URLS: {
        RETURN_URL: `${window.location.origin}/payment/complete`,
        NOTICE_URL: `${window.location.origin}/api/payments/webhook`
    }
};

// 개발 환경 여부 확인
export const isDevelopment = process.env.NODE_ENV === 'development';

// 결제 금액 최소/최대 한도
export const PAYMENT_LIMITS = {
    MIN_AMOUNT: 100,           // 최소 결제 금액 (원)
    MAX_AMOUNT: 10000000      // 최대 결제 금액 (원)
};

// 에러 메시지
export const PAYMENT_ERROR_MESSAGES = {
    INIT_FAILED: 'PortOne SDK 초기화에 실패했습니다. 페이지를 새로고침해주세요.',
    PAYMENT_CANCELLED: '결제가 취소되었습니다.',
    PAYMENT_FAILED: '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
    VERIFICATION_FAILED: '결제 검증에 실패했습니다. 고객센터에 문의해주세요.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
};