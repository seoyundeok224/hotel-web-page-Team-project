# 호텔 PMS (Property Management System)

현대적인 호텔 관리 시스템의 프론트엔드 애플리케이션입니다. React와 Vite를 사용하여 구축되었습니다.

## 🏨 주요 기능

### 📊 대시보드
- 실시간 호텔 운영 현황 모니터링
- 객실 점유율, 매출, 투숙객 수 등 핵심 지표 표시
- 최근 예약 현황 및 객실 상태 요약

### 📅 예약 관리
- 예약 생성, 수정, 삭제
- 예약 상태 관리 (대기, 확정, 체크인, 체크아웃, 취소)
- 고객 정보 및 예약 내역 검색
- 예약 통계 및 분석

### 🏠 객실 관리
- 객실 정보 및 상태 관리
- 객실 타입별, 층별 현황 조회
- 객실 점유율 및 이용 가능 현황
- 청소 및 정비 상태 관리

### 👥 고객 관리
- 고객 정보 등록 및 관리
- VIP 등급별 고객 분류
- 고객 예약 히스토리 및 선호도 관리
- 고객 통계 및 분석

### 📈 리포트
- 매출 분석 및 추이
- 객실 점유율 분석
- 고객 분석 (VIP 등급별, 국적별)
- 성과 지표 (ADR, RevPAR, 고객 만족도 등)

## 🛠 기술 스택

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Utilities**: Date-fns
- **Styling**: CSS Modules

## 📁 프로젝트 구조

```
src/
├── components/         # 재사용 가능한 컴포넌트
│   ├── Header.jsx     # 상단 헤더 컴포넌트
│   └── Sidebar.jsx    # 사이드바 네비게이션
├── pages/             # 페이지 컴포넌트
│   ├── Dashboard.jsx  # 대시보드 페이지
│   ├── Reservations.jsx # 예약 관리 페이지
│   ├── Rooms.jsx      # 객실 관리 페이지
│   ├── Guests.jsx     # 고객 관리 페이지
│   └── Reports.jsx    # 리포트 페이지
├── services/          # API 서비스
│   ├── api.js         # Axios 인스턴스 및 인터셉터
│   └── hotelService.js # 호텔 관련 API 함수들
├── utils/             # 유틸리티 함수
│   └── helpers.js     # 공통 헬퍼 함수들
├── App.jsx            # 메인 앱 컴포넌트
├── App.css            # 메인 스타일시트
├── index.css          # 글로벌 스타일
└── main.jsx           # 앱 진입점
```

## 🚀 시작하기

### 필요 조건
- Node.js 16.0 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 빌드
```bash
npm run build
```

4. 프로덕션 미리보기
```bash
npm run preview
```

## 🔧 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

## 🎯 백엔드 API

이 프론트엔드는 Spring Boot로 구축된 백엔드 API와 연동됩니다:

### 주요 API 엔드포인트
- `GET /api/dashboard/stats` - 대시보드 통계
- `GET /api/reservations` - 예약 목록
- `POST /api/reservations` - 예약 생성
- `GET /api/rooms` - 객실 목록
- `GET /api/guests` - 고객 목록
- `GET /api/reports/*` - 각종 리포트

## 📱 반응형 디자인

모든 페이지는 데스크톱, 태블릿, 모바일 기기에서 최적화되어 작동합니다.

## 🎨 UI/UX 특징

- 직관적이고 현대적인 디자인
- 일관된 색상 체계 및 타이포그래피
- 상태별 색상 코딩 (예약 상태, 객실 상태 등)
- 반응형 레이아웃
- 접근성 고려한 UI 컴포넌트

## 📊 데이터 관리

- 실시간 데이터 동기화
- 로컬 스토리지를 통한 사용자 설정 저장
- 에러 처리 및 로딩 상태 관리
- API 응답 캐싱 최적화

## 🔐 보안

- JWT 토큰 기반 인증
- API 요청 인터셉터를 통한 자동 토큰 처리
- XSS 및 CSRF 보호
- 민감한 정보 마스킹

## 🧪 향후 개발 계획

- [ ] 실시간 알림 시스템
- [ ] 다국어 지원 (i18n)
- [ ] 고급 차트 및 분석 기능
- [ ] PWA (Progressive Web App) 지원
- [ ] 다크 모드 지원
- [ ] 프린트 최적화
- [ ] 엑셀 파일 import/export

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트에 대한 문의사항이 있으시면 언제든 연락해 주세요.

---

**호텔 PMS** - 효율적인 호텔 운영을 위한 통합 관리 시스템+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
