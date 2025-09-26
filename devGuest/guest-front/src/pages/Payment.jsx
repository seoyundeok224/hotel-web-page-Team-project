import React, { useState, useEffect } from 'react';
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
    Grid,
    Divider,
    Alert,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { processPaymentWithPortOne, updateReservationPaymentStatus, cancelReservationOnPaymentFailure } from '../services/paymentService';

// 객실 타입 정보
const facilities = {
    'SINGLE': { label: '싱글룸', price: 150000 },
    'DOUBLE': { label: '더블룸', price: 200000 },
    'FAMILY': { label: '패밀리룸', price: 250000 },
    'DELUXE': { label: '디럭스룸', price: 250000 },
    'SUITE': { label: '스위트룸', price: 300000 },
    'CONFERENCE': { label: '컨퍼런스룸', price: 400000 }
};

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    // URL에서 예약 정보를 받아옴 (Booking 페이지에서 전달)
    const bookingData = location.state?.bookingData;

    console.log('Payment 페이지 로드됨');
    console.log('location.state:', location.state);
    console.log('bookingData:', bookingData);

    const [paymentData, setPaymentData] = useState({
        paymentMethod: 'card',
        billingAddress: '',
        billingCity: '',
        billingZipCode: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    // 예약 정보가 없으면 예약 페이지로 리다이렉트
    useEffect(() => {
        console.log('Payment useEffect 실행, bookingData 확인:', bookingData);
        if (!bookingData) {
            console.log('bookingData가 없어서 예약 페이지로 리다이렉트');
            navigate('/booking');
        } else {
            console.log('bookingData 존재, Payment 페이지 계속 진행');
        }
    }, [bookingData, navigate]);

    // 입력값 변경 핸들러
    const handleInputChange = (field) => (event) => {
        const value = event.target.value;

        // 카드번호는 숫자만 허용하고 16자리로 제한
        if (field === 'cardNumber') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 16) {
                setPaymentData(prev => ({
                    ...prev,
                    [field]: numericValue.replace(/(\d{4})(?=\d)/g, '$1-')
                }));
            }
            return;
        }

        // CVV는 숫자만 허용하고 3자리로 제한
        if (field === 'cvv') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 3) {
                setPaymentData(prev => ({ ...prev, [field]: numericValue }));
            }
            return;
        }

        setPaymentData(prev => ({ ...prev, [field]: value }));

        // 에러 메시지 제거
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // 폼 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        // PortOne을 사용하므로 카드 정보 검증은 제거하고 기본 정보만 검증
        if (!paymentData.billingAddress.trim()) {
            newErrors.billingAddress = '청구지 주소를 입력해주세요.';
        }

        if (!paymentData.agreeToTerms) {
            newErrors.agreeToTerms = '결제 약관에 동의해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 결제 처리
    const handlePayment = async () => {
        if (!validateForm()) return;

        setIsProcessing(true);

        try {
            // PortOne 결제 데이터 구성
            const paymentRequestData = {
                reservationId: bookingData.reservationId,
                amount: totalAmount,
                paymentMethod: paymentData.paymentMethod,
                roomType: facilities[bookingData.roomType]?.label || bookingData.roomType,
                guestName: bookingData.guestName,
                guestPhone: bookingData.guestPhone,
                userEmail: user?.email,
                userName: user?.name,
                billingInfo: {
                    address: paymentData.billingAddress,
                    city: paymentData.billingCity,
                    zipCode: paymentData.billingZipCode
                },
                userId: user?.id
            };

            // PortOne을 통한 결제 처리
            const result = await processPaymentWithPortOne(paymentRequestData);

            console.log('결제 성공:', result);

            // 결제 성공 후 예약 상태 업데이트
            try {
                await updateReservationPaymentStatus({
                    reservationId: bookingData.reservationId,
                    impUid: result.impUid,
                    merchantUid: result.merchantUid,
                    paidAmount: result.paidAmount,
                    payMethod: result.payMethod,
                    pgProvider: result.pgProvider
                });
            } catch (updateError) {
                console.error('예약 상태 업데이트 실패:', updateError);
                // 업데이트 실패해도 결제는 성공했으므로 성공 다이얼로그 표시
            }

            // 결제 결과 저장
            setPaymentResult(result);

            // 성공 시 다이얼로그 표시
            setShowSuccessDialog(true);
        } catch (error) {
            console.error('결제 실패:', error);

            // 결제 실패 시 예약 취소 처리
            if (bookingData.reservationId) {
                try {
                    await cancelReservationOnPaymentFailure(bookingData.reservationId);
                } catch (cancelError) {
                    console.error('예약 취소 처리 실패:', cancelError);
                }
            }

            let errorMessage = '결제 처리 중 오류가 발생했습니다.';

            if (error.message.includes('취소')) {
                errorMessage = '결제가 취소되었습니다.';
            } else if (error.message.includes('SDK')) {
                errorMessage = '결제 시스템 초기화에 실패했습니다. 페이지를 새로고침해주세요.';
            }

            setErrors({ submit: errorMessage });
        } finally {
            setIsProcessing(false);
        }
    };    // 성공 다이얼로그 확인
    const handleSuccessConfirm = () => {
        setShowSuccessDialog(false);
        navigate('/mypage'); // 마이페이지로 이동
    };

    // 총 금액 계산
    const calculateTotal = () => {
        if (!bookingData) return 0;

        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const roomPrice = facilities[bookingData.roomType]?.price || 0;

        return roomPrice * nights;
    };

    // 결제 방법명 변환 헬퍼 함수
    const getPayMethodName = (payMethod) => {
        switch (payMethod) {
            case 'card':
                return '신용카드';
            case 'trans':
                return '계좌이체';
            case 'kakaopay':
                return '카카오페이';
            default:
                return payMethod;
        }
    }; if (!bookingData) {
        return null; // 리다이렉트 처리 중
    }

    const totalAmount = calculateTotal();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                결제하기
            </Typography>

            <Grid container spacing={4}>
                {/* 예약 정보 요약 */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                예약 요약
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">객실 타입</Typography>
                                <Typography variant="body1">
                                    {facilities[bookingData.roomType]?.label || bookingData.roomType}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">체크인</Typography>
                                <Typography variant="body1">
                                    {new Date(bookingData.checkInDate).toLocaleDateString('ko-KR')}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">체크아웃</Typography>
                                <Typography variant="body1">
                                    {new Date(bookingData.checkOutDate).toLocaleDateString('ko-KR')}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">투숙객</Typography>
                                <Typography variant="body1">
                                    성인 {bookingData.adults}명, 어린이 {bookingData.children}명
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6">총 금액</Typography>
                                <Typography variant="h6" color="primary">
                                    {totalAmount.toLocaleString()}원
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 결제 정보 입력 */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                결제 정보
                            </Typography>

                            {errors.submit && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errors.submit}
                                </Alert>
                            )}

                            {/* 결제 방법 선택 */}
                            <FormControl component="fieldset" sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>결제 방법</Typography>
                                <RadioGroup
                                    value={paymentData.paymentMethod}
                                    onChange={handleInputChange('paymentMethod')}
                                    row
                                >
                                    <FormControlLabel
                                        value="card"
                                        control={<Radio />}
                                        label="신용카드"
                                    />
                                    <FormControlLabel
                                        value="transfer"
                                        control={<Radio />}
                                        label="계좌이체"
                                    />
                                    <FormControlLabel
                                        value="kakao"
                                        control={<Radio />}
                                        label="카카오페이"
                                    />
                                </RadioGroup>
                            </FormControl>

                            {/* 결제 방법별 안내 메시지 */}
                            <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                {paymentData.paymentMethod === 'card' && (
                                    <Typography variant="body2" color="text.secondary">
                                        💳 신용카드 결제 시 안전한 PG사 결제창에서 카드 정보를 입력하게 됩니다.
                                    </Typography>
                                )}
                                {paymentData.paymentMethod === 'transfer' && (
                                    <Typography variant="body2" color="text.secondary">
                                        🏦 계좌이체는 실시간 이체로 처리되며, 은행 사이트로 이동됩니다.
                                    </Typography>
                                )}
                                {paymentData.paymentMethod === 'kakao' && (
                                    <Typography variant="body2" color="text.secondary">
                                        💰 카카오페이로 간편하고 안전하게 결제할 수 있습니다.
                                    </Typography>
                                )}
                            </Box>

                            {/* 청구지 정보 */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" gutterBottom>청구지 정보</Typography>

                                <TextField
                                    fullWidth
                                    label="주소"
                                    value={paymentData.billingAddress}
                                    onChange={handleInputChange('billingAddress')}
                                    error={!!errors.billingAddress}
                                    helperText={errors.billingAddress}
                                    sx={{ mb: 2 }}
                                />

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="도시"
                                            value={paymentData.billingCity}
                                            onChange={handleInputChange('billingCity')}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            label="우편번호"
                                            value={paymentData.billingZipCode}
                                            onChange={handleInputChange('billingZipCode')}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* 약관 동의 */}
                            <FormControlLabel
                                control={
                                    <input
                                        type="checkbox"
                                        checked={paymentData.agreeToTerms}
                                        onChange={(e) => setPaymentData(prev => ({
                                            ...prev,
                                            agreeToTerms: e.target.checked
                                        }))}
                                    />
                                }
                                label="결제 약관 및 개인정보 처리방침에 동의합니다."
                                sx={{ mb: 2 }}
                            />
                            {errors.agreeToTerms && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {errors.agreeToTerms}
                                </Alert>
                            )}

                            {/* 결제 버튼 */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handlePayment}
                                disabled={isProcessing}
                                sx={{ mt: 2 }}
                            >
                                {isProcessing ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    `${totalAmount.toLocaleString()}원 결제하기`
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 결제 성공 다이얼로그 */}
            <Dialog open={showSuccessDialog} onClose={handleSuccessConfirm} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
                    ✅ 결제 완료
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            결제가 성공적으로 완료되었습니다!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            예약 확인서가 이메일로 발송됩니다.
                        </Typography>

                        {paymentResult && (
                            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    결제 정보
                                </Typography>
                                <Typography variant="body2">
                                    결제 금액: {paymentResult.paidAmount?.toLocaleString()}원
                                </Typography>
                                <Typography variant="body2">
                                    결제 방법: {getPayMethodName(paymentResult.payMethod)}
                                </Typography>
                                <Typography variant="body2">
                                    거래번호: {paymentResult.merchantUid}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button
                        onClick={handleSuccessConfirm}
                        color="primary"
                        variant="contained"
                        size="large"
                    >
                        예약 확인하기
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Payment;
