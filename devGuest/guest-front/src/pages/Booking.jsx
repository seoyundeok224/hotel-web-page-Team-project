import React, { useState, useCallback, useMemo } from 'react';
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { createReservation } from '../services/reservationService';
import { useAuth } from '../contexts/AuthContext';

// 컴포넌트 외부로 상수 데이터를 이동하여 불필요한 재생성을 방지합니다.
const facilities = [
  { value: 'SINGLE', label: '싱글룸', description: '1인용 객실', price: '150,000원/박' },
  { value: 'DOUBLE', label: '더블룸', description: '2인용 객실', price: '200,000원/박' },
  { value: 'FAMILY', label: '패밀리룸', description: '가족용 객실 (4인)', price: '250,000원/박' },
  { value: 'DELUXE', label: '디럭스룸', description: '고급 객실 (2인)', price: '250,000원/박' },
  { value: 'SUITE', label: '스위트룸', description: '최고급 스위트 (2인)', price: '300,000원/박' },
  { value: 'CONFERENCE', label: '컨퍼런스룸', description: '회의실 겸용 객실', price: '400,000원/박' }
];

const Booking = () => {
  const { user } = useAuth(); // 로그인한 사용자 정보

  const [formData, setFormData] = useState({
    roomType: '',
    checkInDate: null,
    checkOutDate: null,
    checkInTime: null,
    checkOutTime: null,
    adults: 1,
    children: 0,
    guestName: '',
    guestPhone: '',
    email: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // useCallback으로 함수를 메모이제이션합니다.
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 에러 메시지 클리어
    if (errors[field]) {
      // 함수형 업데이트를 사용하여 `errors` 의존성을 제거합니다.
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, []); // `errors` 의존성 제거

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.roomType) newErrors.roomType = '객실 타입을 선택해주세요.';
    if (!formData.checkInDate) newErrors.checkInDate = '체크인 날짜를 선택해주세요.';
    if (!formData.checkOutDate) newErrors.checkOutDate = '체크아웃 날짜를 선택해주세요.';
    if (!formData.checkInTime) newErrors.checkInTime = '체크인 시간을 선택해주세요.';
    if (!formData.checkOutTime) newErrors.checkOutTime = '체크아웃 시간을 선택해주세요.';
    if (!formData.guestName.trim()) newErrors.guestName = '투숙객 이름을 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 휴대폰 번호 형식 검증
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!formData.guestPhone.trim()) {
      newErrors.guestPhone = '연락처를 입력해주세요.';
    } else if (!phoneRegex.test(formData.guestPhone)) {
      newErrors.guestPhone = '올바른 휴대폰 번호 형식(010-0000-0000)을 입력해주세요.';
    }

    // 체크인/체크아웃 날짜 검증
    if (formData.checkInDate && formData.checkOutDate) {
      if (formData.checkInDate >= formData.checkOutDate) {
        newErrors.checkOutDate = '체크아웃 날짜는 체크인 날짜보다 늦어야 합니다.';
      }
    }

    // 로그인 상태 검사
    if (!user) {
      newErrors.auth = '예약을 위해서는 로그인이 필요합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, user]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true); // 로딩 시작
      try {
        // 시간대 문제 해결을 위해 날짜를 YYYY-MM-DD 형식으로 직접 포맷하는 함수
        const formatDateToYYYYMMDD = (date) => {
          if (!date) return null;
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // 백엔드 API에 맞는 예약 데이터 구성
        const reservationData = {
          username: user.username, // 로그인한 사용자
          guestName: formData.guestName,
          guestPhone: formData.guestPhone,
          roomType: formData.roomType, // 이것은 백엔드에서 방을 찾는데 사용됩니다
          // 시간대 변환 없이 사용자가 선택한 날짜를 그대로 사용
          checkIn: formatDateToYYYYMMDD(formData.checkInDate),
          checkOut: formatDateToYYYYMMDD(formData.checkOutDate),
          people: formData.adults + formData.children,
          message: formData.specialRequests // 요청 사항을 'message' 필드로 전달
        };

        console.log('예약 요청 데이터:', reservationData);

        const response = await createReservation(reservationData);
        console.log('예약 성공:', response);

        setSubmitSuccess(true);

        // 폼 초기화
        setFormData({
          roomType: '',
          checkInDate: null,
          checkOutDate: null,
          checkInTime: null,
          checkOutTime: null,
          adults: 1,
          children: 0,
          guestName: '',
          guestPhone: '',
          email: '',
          specialRequests: ''
        });

        // 성공 메시지를 3초 후 숨김
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);

      } catch (error) {
        console.error('예약 실패:', error);
        setErrors({
          submit: '예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.'
        });
      } finally {
        setIsLoading(false); // 로딩 종료 (성공/실패 무관)
      }
    }
  }, [formData, user, validateForm]);

  // useMemo를 사용하여 예약 요약 관련 값들을 메모이제이션합니다.
  // 이 값들은 의존하는 formData 값이 변경될 때만 재계산됩니다.
  const selectedFacility = useMemo(() =>
    facilities.find(f => f.value === formData.roomType),
    [formData.roomType]
  );

  const formattedCheckIn = useMemo(() => {
    if (!formData.checkInDate) return '선택되지 않음';
    const date = formData.checkInDate.toLocaleDateString('ko-KR');
    const time = formData.checkInTime ? ` ${formData.checkInTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : '';
    return `${date}${time}`;
  }, [formData.checkInDate, formData.checkInTime]);

  const formattedCheckOut = useMemo(() => {
    if (!formData.checkOutDate) return '선택되지 않음';
    const date = formData.checkOutDate.toLocaleDateString('ko-KR');
    const time = formData.checkOutTime ? ` ${formData.checkOutTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : '';
    return `${date}${time}`;
  }, [formData.checkOutDate, formData.checkOutTime]);

  const stayDuration = useMemo(() => {
    if (formData.checkInDate && formData.checkOutDate && formData.checkOutDate > formData.checkInDate) {
      const nights = Math.ceil((formData.checkOutDate - formData.checkInDate) / (1000 * 60 * 60 * 24));
      return `${nights}박 ${nights + 1}일`;
    }
    return '선택되지 않음';
  }, [formData.checkInDate, formData.checkOutDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          호텔 예약
        </Typography>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            예약이 성공적으로 접수되었습니다. 확인 후 연락드리겠습니다.
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 객실 타입 선택 */}
                <Box>
                  <FormControl fullWidth error={!!errors.roomType}>
                    <InputLabel>객실 타입</InputLabel>
                    <Select
                      value={formData.roomType}
                      label="객실 타입"
                      onChange={(e) => handleInputChange('roomType', e.target.value)}
                    >
                      {facilities.map((facility) => (
                        <MenuItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.roomType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.roomType}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* 체크인/체크아웃 날짜 및 시간 */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    숙박 기간 및 시간
                  </Typography>

                  {/* 체크인 날짜 및 시간 */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                      체크인
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ flex: 2 }}>
                        <DatePicker
                          label="체크인 날짜"
                          value={formData.checkInDate}
                          onChange={(newValue) => handleInputChange('checkInDate', newValue)}
                          minDate={new Date()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkInDate,
                              helperText: errors.checkInDate
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TimePicker
                          label="체크인 시간"
                          value={formData.checkInTime}
                          onChange={(newValue) => handleInputChange('checkInTime', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkInTime,
                              helperText: errors.checkInTime
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* 체크아웃 날짜 및 시간 */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
                      체크아웃
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ flex: 2 }}>
                        <DatePicker
                          label="체크아웃 날짜"
                          value={formData.checkOutDate}
                          onChange={(newValue) => handleInputChange('checkOutDate', newValue)}
                          minDate={formData.checkInDate ? new Date(formData.checkInDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkOutDate,
                              helperText: errors.checkOutDate
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TimePicker
                          label="체크아웃 시간"
                          value={formData.checkOutTime}
                          onChange={(newValue) => handleInputChange('checkOutTime', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.checkOutTime,
                              helperText: errors.checkOutTime
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* 인원 */}
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    인원
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="성인"
                        value={formData.adults}
                        onChange={(e) => handleInputChange('adults', Math.max(1, parseInt(e.target.value) || 1))}
                        inputProps={{ min: 1, max: 10 }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="어린이 (13세 이하)"
                        value={formData.children}
                        onChange={(e) => handleInputChange('children', Math.max(0, parseInt(e.target.value) || 0))}
                        inputProps={{ min: 0, max: 10 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* 예약자 정보 */}
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    예약자 정보
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="예약자명"
                          value={formData.guestName}
                          onChange={(e) => handleInputChange('guestName', e.target.value)}
                          error={!!errors.guestName}
                          helperText={errors.guestName}
                          required
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="휴대폰번호"
                          placeholder="010-0000-0000"
                          value={formData.guestPhone}
                          onChange={(e) => handleInputChange('guestPhone', e.target.value)}
                          error={!!errors.guestPhone}
                          helperText={errors.guestPhone}
                          required
                        />
                      </Box>
                    </Box>

                    <Box>
                      <TextField
                        fullWidth
                        type="email"
                        label="이메일"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                      />
                    </Box>
                  </Box>
                </Box>

                {/* 요청사항 */}
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="요청사항"
                    placeholder="특별한 요청사항이 있으시면 작성해주세요."
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  />
                </Box>

                {/* 예약 요약 */}
                <Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    예약 요약
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="body2" paragraph>
                      <strong>객실 타입:</strong> {selectedFacility?.label || '선택되지 않음'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>체크인:</strong> {formattedCheckIn}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>체크아웃:</strong> {formattedCheckOut}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>숙박 기간:</strong> {stayDuration}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>인원:</strong> 성인 {formData.adults}명, 어린이 {formData.children}명
                    </Typography>
                    <Typography variant="body2">
                      <strong>예약자:</strong> {formData.guestName || '입력되지 않음'}
                    </Typography>
                  </Box>
                </Box>

                {/* 제출 버튼 */}
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                    sx={{
                      mt: 2,
                      py: 2,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(145deg, #1976d2, #1565c0)',
                      position: 'relative',
                      '&:hover': {
                        background: 'linear-gradient(145deg, #1565c0, #0d47a1)',
                      },
                    }}
                  >
                    {isLoading ? <CircularProgress size={28} color="inherit" /> : '예약 신청'}
                  </Button>
                  {errors.submit && (
                    <Alert severity="error" sx={{ mt: 2 }}>{errors.submit}</Alert>
                  )}
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default Booking;
