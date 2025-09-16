import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import hotelService from '../services/hotelService'; // hotelService 임포트

const Booking = () => {
  const [formData, setFormData] = useState({
    facility: '',
    date: null,
    startTime: null,
    endTime: null,
    adults: 1,
    children: 0,
    reservationName: '',
    phone: '',
    email: '',
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // 이용 시설 옵션들
  const facilities = [
    { value: 'deluxe-room', label: '디럭스룸' },
    { value: 'suite-room', label: '스위트룸' },
    { value: 'family-room', label: '패밀리룸' },
    { value: 'conference-room', label: '컨퍼런스룸' },
    { value: 'restaurant', label: '레스토랑' },
    { value: 'spa', label: '스파' },
    { value: 'fitness', label: '피트니스센터' },
    { value: 'pool', label: '수영장' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // 에러 메시지 클리어
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.facility) newErrors.facility = '이용시설을 선택해주세요.';
    if (!formData.date) newErrors.date = '이용일자를 선택해주세요.';
    if (!formData.startTime) newErrors.startTime = '시작 시간을 선택해주세요.';
    if (!formData.endTime) newErrors.endTime = '종료 시간을 선택해주세요.';
    if (!formData.reservationName.trim()) newErrors.reservationName = '예약자명을 입력해주세요.';
    if (!formData.phone.trim()) newErrors.phone = '휴대폰번호를 입력해주세요.';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요.';

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    // 휴대폰번호 형식 검증
    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = '휴대폰번호는 000-0000-0000 형식으로 입력해주세요.';
    }

    // 시간 검증
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = '종료 시간은 시작 시간보다 늦어야 합니다.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // 백엔드 DTO에 맞게 데이터 매핑
      // checkOutDate는 현재 폼에 없으므로, checkInDate와 동일하게 설정합니다.
      // 필요에 따라 UI에 check-out 날짜 필드를 추가해야 할 수 있습니다.
      const bookingData = {
        guestName: formData.reservationName,
        roomType: formData.facility,
        checkInDate: formData.date,
        checkOutDate: formData.date, 
        numberOfGuests: formData.adults + formData.children,
      };

      try {
        await hotelService.reservation.createBooking(bookingData);
        setSubmitSuccess(true);
        setErrors({}); // 이전 에러 초기화

        // 성공 시 폼 초기화
        setFormData({
          facility: '',
          date: null,
          startTime: null,
          endTime: null,
          adults: 1,
          children: 0,
          reservationName: '',
          phone: '',
          email: '',
          specialRequests: ''
        });

        // 3초 후 성공 메시지 숨김
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

      } catch (error) {
        console.error('Booking failed:', error);
        setSubmitSuccess(false);
        // API 호출 실패 시 에러 메시지 설정
        setErrors({ submit: '예약에 실패했습니다. 잠시 후 다시 시도해주세요.' });
      }
    }
  };

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
                {/* 이용시설 선택 */}
                <Box>
                  <FormControl fullWidth error={!!errors.facility}>
                    <InputLabel>이용시설</InputLabel>
                    <Select
                      value={formData.facility}
                      label="이용시설"
                      onChange={(e) => handleInputChange('facility', e.target.value)}
                    >
                      {facilities.map((facility) => (
                        <MenuItem key={facility.value} value={facility.value}>
                          {facility.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.facility && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {errors.facility}
                      </Typography>
                    )}
                  </FormControl>
                </Box>

                {/* 이용일자 및 시간 */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: 2 }}>
                    <DatePicker
                      label="이용일자"
                      value={formData.date}
                      onChange={(newValue) => handleInputChange('date', newValue)}
                      minDate={new Date()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TimePicker
                      label="시작 시간"
                      value={formData.startTime}
                      onChange={(newValue) => handleInputChange('startTime', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                          helperText: errors.startTime
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <TimePicker
                      label="종료 시간"
                      value={formData.endTime}
                      onChange={(newValue) => handleInputChange('endTime', newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                          helperText: errors.endTime
                        }
                      }}
                    />
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
                          value={formData.reservationName}
                          onChange={(e) => handleInputChange('reservationName', e.target.value)}
                          error={!!errors.reservationName}
                          helperText={errors.reservationName}
                          required
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          label="휴대폰번호"
                          placeholder="010-0000-0000"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          error={!!errors.phone}
                          helperText={errors.phone}
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
                      <strong>이용시설:</strong> {formData.facility ? facilities.find(f => f.value === formData.facility)?.label : '선택되지 않음'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>이용일자:</strong> {formData.date ? formData.date.toLocaleDateString('ko-KR') : '선택되지 않음'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>이용시간:</strong> {formData.startTime && formData.endTime
                        ? `${formData.startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} - ${formData.endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`
                        : '선택되지 않음'}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>인원:</strong> 성인 {formData.adults}명, 어린이 {formData.children}명
                    </Typography>
                    <Typography variant="body2">
                      <strong>예약자:</strong> {formData.reservationName || '입력되지 않음'}
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
                    sx={{
                      mt: 2,
                      py: 2,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(145deg, #1976d2, #1565c0)',
                      '&:hover': {
                        background: 'linear-gradient(145deg, #1565c0, #0d47a1)',
                      },
                    }}
                  >
                    예약 신청
                  </Button>
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
