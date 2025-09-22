import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Paper, CircularProgress, Alert, 
  Card, CardHeader, CardContent, Avatar, Pagination, 
  Snackbar, Skeleton 
} from '@mui/material';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useAuth } from '../contexts/AuthContext';
import reviewService from '../services/reviewService';

// --- 상수 정의 ---
const ITEMS_PER_PAGE = 10; // 페이지 당 보여줄 후기 수
const MAX_PAGES = 5;       // 최대 페이지 수
const MAX_REVIEWS = ITEMS_PER_PAGE * MAX_PAGES; // 화면에 유지할 최대 후기 수 (50개)

/**
 * 문자열을 입력받아 고유한 색상 코드를 반환하는 함수.
 * 사용자 이름(username)에 따라 아바타 색상을 다르게 지정하기 위해 사용.
 * @param {string} string - 색상을 생성할 기반이 되는 문자열
 * @returns {string} - Hex 색상 코드 (e.g., '#1a2b3c')
 */
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

// --- 고객 후기 컴포넌트 ---
const Reviews = () => {
  // --- React Hooks 및 컨텍스트 ---
  const { isAuthenticated } = useAuth(); // AuthContext에서 로그인 상태 가져오기
  const token = localStorage.getItem('token'); // API 요청에 필요한 인증 토큰

  // --- 상태(State) 관리 ---
  const [reviews, setReviews] = useState([]);         // 전체 후기 목록
  const [content, setContent] = useState('');         // 후기 작성 폼의 입력 내용
  const [loading, setLoading] = useState(true);       // 데이터 로딩 상태
  const [error, setError] = useState(null);           // 에러 메시지
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지 번호 (페이지네이션)

  // --- UI/UX를 위한 상태들 ---
  const [isSubmitting, setIsSubmitting] = useState(false); // 후기 등록 버튼 로딩 상태
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // 알림 메시지 (스낵바)
  const [newReviewId, setNewReviewId] = useState(null);     // 새로 등록된 후기 ID (애니메이션 효과용)

  /**
   * 서버에서 모든 후기를 비동기적으로 가져오는 함수.
   * 컴포넌트가 처음 마운트될 때 호출됨.
   */
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviews();
      // 최신순으로 정렬 후, 최대 개수(50개)만큼 잘라서 상태에 저장
      const sortedReviews = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sortedReviews.slice(0, MAX_REVIEWS));
      setError(null); // 이전 에러 상태 초기화
    } catch (err) {
      console.error("후기 목록 로딩 실패:", err);
      setError('후기를 불러오는 데 실패했습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 한 번만 fetchReviews 함수를 실행
  useEffect(() => {
    fetchReviews();
  }, []);

  // newReviewId 상태가 변경될 때 실행되는 부수 효과(Effect).
  // 새 후기가 등록되면 1초 뒤에 ID를 초기화하여 애니메이션 클래스를 제거함.
  useEffect(() => {
    if (newReviewId) {
      const timer = setTimeout(() => setNewReviewId(null), 1000);
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
    }
  }, [newReviewId]);

  /**
   * '후기 등록' 폼 제출 시 실행되는 이벤트 핸들러.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지
    if (!content.trim()) return; // 내용이 없으면 실행 중단
    
    setIsSubmitting(true); // 버튼 로딩 상태 시작

    try {
      // 1. 서버에 새로운 후기 생성 요청
      const createRes = await reviewService.createReview(content, token);
      const newReview = createRes.data;
      setNewReviewId(newReview.id); // 애니메이션을 위해 새 후기 ID 저장

      // 2. 현재 상태에 새 후기를 맨 앞에 추가
      let updatedReviews = [newReview, ...reviews];

      // 3. 후기 목록이 최대 개수를 초과하면, 가장 오래된 후기 자동 삭제
      if (updatedReviews.length > MAX_REVIEWS) {
        const oldestReview = updatedReviews[updatedReviews.length - 1]; // 배열의 마지막 요소가 가장 오래된 후기
        try {
          await reviewService.deleteReview(oldestReview.id, token); // 서버에서 삭제
          updatedReviews = updatedReviews.slice(0, MAX_REVIEWS);      // 상태 배열에서도 제거
        } catch (deleteErr) {
          console.error("가장 오래된 후기 삭제 실패:", deleteErr);
        }
      }
      
      // 4. 최종적으로 업데이트된 후기 목록으로 상태 변경
      setReviews(updatedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setContent('');       // 입력 폼 비우기
      setCurrentPage(1);  // 첫 페이지로 이동
      setSnackbar({ open: true, message: '소중한 후기가 등록되었습니다!', severity: 'success' });
    } catch (err) {
      console.error("후기 작성 실패:", err);
      setSnackbar({ open: true, message: '후기 작성에 실패했습니다. 다시 시도해주세요.', severity: 'error' });
    } finally {
      setIsSubmitting(false); // 버튼 로딩 상태 종료
    }
  };
  
  // 현재 페이지에 보여줄 후기들만 잘라내기 (페이지네이션 로직)
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * 스낵바가 닫힐 때 호출되는 이벤트 핸들러.
   */
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return; // 스낵바 바깥 클릭 시에는 닫히지 않도록 함
    setSnackbar({ ...snackbar, open: false });
  };

  // --- JSX 렌더링 ---
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', p: 3, position: 'relative' }}>
      <Typography variant="h4" gutterBottom>고객 후기</Typography>

      {/* 로그인 상태일 때만 후기 작성 폼을 보여줌 */}
      {isAuthenticated && (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            label="소중한 후기를 남겨주세요."
            disabled={isSubmitting}
            inputProps={{ maxLength: 500 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            {/* 글자 수 카운터 */}
            <Typography variant="caption" color="text.secondary">
              {content.length} / 500
            </Typography>
            {/* 후기 등록 버튼 (제출 중에는 로딩 아이콘 표시) */}
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 1 }}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '후기 등록'}
            </Button>
          </Box>
        </Paper>
      )}

      {/* 로딩, 에러, 후기 유무에 따라 다른 UI를 조건부 렌더링 */}
      {loading ? (
        // 로딩 중: 스켈레톤 UI 표시
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Card key={index} variant="outlined">
              <CardHeader
                avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
                title={<Skeleton animation="wave" height={20} width="30%" sx={{ mb: 0.5 }} />}
                subheader={<Skeleton animation="wave" height={15} width="50%" />}
              />
              <CardContent><Skeleton animation="wave" variant="rectangular" height={40} /></CardContent>
            </Card>
          ))}
        </Box>
      ) : error ? (
        // 에러 발생 시: 에러 메시지 표시
        <Alert severity="error">{error}</Alert>
      ) : reviews.length === 0 ? (
        // 후기가 없을 때: 안내 메시지 표시
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <RateReviewOutlinedIcon sx={{ fontSize: 48, color: 'grey.500' }} />
          <Typography variant="h6">아직 작성된 후기가 없습니다.</Typography>
          <Typography color="text.secondary">첫 후기를 남겨주세요!</Typography>
        </Paper>
      ) : (
        // 후기가 있을 때: 후기 목록과 페이지네이션 표시
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {paginatedReviews.map((review) => (
              <Card 
                key={review.id} 
                variant="outlined"
                // 새로 등록된 후기일 경우 애니메이션 클래스 적용
                className={review.id === newReviewId ? 'new-review-animation' : ''}
                sx={{
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': { transform: 'scale(1.015)', boxShadow: 4 }, // 마우스 호버 효과
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: stringToColor(review.username || 'default') }}>
                      {review.username ? review.username.charAt(0) : 'U'}
                    </Avatar>
                  }
                  title={<Typography component="strong">{review.username}</Typography>}
                  subheader={new Date(review.createdAt).toLocaleString('ko-KR')}
                />
                <CardContent>
                  {/* 줄바꿈(\n)을 HTML에 적용하기 위해 whiteSpace 속성 사용 */}
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {review.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* 후기가 한 페이지 분량보다 많을 때만 페이지네이션을 보여줌 */}
          {reviews.length > ITEMS_PER_PAGE && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(reviews.length / ITEMS_PER_PAGE)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* 스낵바 알림 컴포넌트 */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reviews;
