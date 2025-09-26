import api from './api';
import {
    PORTONE_CONFIG,
    PAYMENT_LIMITS,
    PAYMENT_ERROR_MESSAGES
} from '../config/paymentConfig';

/**
 * PortOne 초기화
 */
const initializePortOne = () => {
    if (window.IMP) {
        window.IMP.init(PORTONE_CONFIG.IMP_CODE);
        return true;
    }
    return false;
};

/**
 * PortOne을 이용한 결제 처리
 * @param {Object} paymentData - 결제 정보
 * @returns {Promise} 결제 결과
 */
export const processPaymentWithPortOne = async (paymentData) => {
    return new Promise((resolve, reject) => {
        if (!initializePortOne()) {
            reject(new Error(PAYMENT_ERROR_MESSAGES.INIT_FAILED));
            return;
        }

        // 결제 금액 검증
        if (paymentData.amount < PAYMENT_LIMITS.MIN_AMOUNT || paymentData.amount > PAYMENT_LIMITS.MAX_AMOUNT) {
            reject(new Error(`결제 금액은 ${PAYMENT_LIMITS.MIN_AMOUNT.toLocaleString()}원 이상 ${PAYMENT_LIMITS.MAX_AMOUNT.toLocaleString()}원 이하여야 합니다.`));
            return;
        }

        const { IMP } = window;

        // 고유한 주문번호 생성
        const merchantUid = `hotel_${new Date().getTime()}`;

        const paymentRequest = {
            pg: PORTONE_CONFIG.DEFAULT_PG,
            pay_method: getPayMethod(paymentData.paymentMethod),
            merchant_uid: merchantUid,
            name: `호텔 예약 - ${paymentData.roomType}`,
            amount: paymentData.amount,
            buyer_email: paymentData.userEmail || '',
            buyer_name: paymentData.guestName || paymentData.userName || '',
            buyer_tel: paymentData.guestPhone || '',
            buyer_addr: paymentData.billingInfo?.address || '',
            buyer_postcode: paymentData.billingInfo?.zipCode || '',
            currency: PORTONE_CONFIG.PAYMENT_ENV.CURRENCY,
            language: PORTONE_CONFIG.PAYMENT_ENV.LANGUAGE,
            // 추가 데이터
            custom_data: {
                reservationId: paymentData.reservationId,
                userId: paymentData.userId
            }
        };

        IMP.request_pay(paymentRequest, (response) => {
            if (response.success) {
                // 결제 성공 시 서버에서 검증
                verifyPayment(response.imp_uid, merchantUid)
                    .then((verificationResult) => {
                        resolve({
                            success: true,
                            impUid: response.imp_uid,
                            merchantUid: merchantUid,
                            paidAmount: response.paid_amount,
                            payMethod: response.pay_method,
                            pgProvider: response.pg_provider,
                            verificationResult
                        });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                reject(new Error(response.error_msg || PAYMENT_ERROR_MESSAGES.PAYMENT_CANCELLED));
            }
        });
    });
};

/**
 * 결제 방법 코드 변환
 * @param {string} method - 결제 방법
 * @returns {string} PortOne 결제 방법 코드
 */
const getPayMethod = (method) => {
    switch (method) {
        case 'card':
            return PORTONE_CONFIG.PAY_METHODS.CARD;
        case 'transfer':
            return PORTONE_CONFIG.PAY_METHODS.TRANSFER;
        case 'kakao':
            return PORTONE_CONFIG.PAY_METHODS.KAKAO_PAY;
        default:
            return PORTONE_CONFIG.PAY_METHODS.CARD;
    }
};

/**
 * 서버에서 결제 검증
 * @param {string} impUid - 아임포트 거래 고유번호
 * @param {string} merchantUid - 주문번호
 * @returns {Promise} 검증 결과
 */
const verifyPayment = async (impUid, merchantUid) => {
    try {
        const response = await api.post('/payments/verify', {
            imp_uid: impUid,
            merchant_uid: merchantUid
        });
        return response.data;
    } catch (error) {
        console.error('결제 검증 실패:', error);
        throw error;
    }
};

/**
 * 기존 결제 처리 API (백엔드 연동용)
 * @param {Object} paymentData - 결제 정보
 * @returns {Promise} 결제 결과
 */
export const processPayment = async (paymentData) => {
    try {
        const response = await api.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        console.error('결제 처리 실패:', error);
        throw error;
    }
};

/**
 * 결제 상태 확인
 * @param {string} paymentId - 결제 ID
 * @returns {Promise} 결제 상태
 */
export const getPaymentStatus = async (paymentId) => {
    try {
        const response = await api.get(`/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error('결제 상태 확인 실패:', error);
        throw error;
    }
};

/**
 * 결제 취소
 * @param {string} paymentId - 결제 ID
 * @returns {Promise} 취소 결과
 */
export const cancelPayment = async (paymentId) => {
    try {
        const response = await api.post(`/payments/${paymentId}/cancel`);
        return response.data;
    } catch (error) {
        console.error('결제 취소 실패:', error);
        throw error;
    }
};

/**
 * 결제 영수증 조회
 * @param {string} paymentId - 결제 ID
 * @returns {Promise} 영수증 데이터
 */
export const getPaymentReceipt = async (paymentId) => {
    try {
        const response = await api.get(`/payments/${paymentId}/receipt`);
        return response.data;
    } catch (error) {
        console.error('영수증 조회 실패:', error);
        throw error;
    }
};

/**
 * 결제 완료 후 예약 상태 업데이트
 * @param {Object} paymentResult - 결제 결과 정보
 * @returns {Promise} 업데이트 결과
 */
export const updateReservationPaymentStatus = async (paymentResult) => {
    try {
        const response = await api.post('/reservations/payment-complete', {
            reservationId: paymentResult.reservationId,
            impUid: paymentResult.impUid,
            merchantUid: paymentResult.merchantUid,
            paidAmount: paymentResult.paidAmount,
            payMethod: paymentResult.payMethod,
            pgProvider: paymentResult.pgProvider
        });
        return response.data;
    } catch (error) {
        console.error('예약 결제 상태 업데이트 실패:', error);
        throw error;
    }
};

/**
 * 결제 실패 시 예약 취소 처리
 * @param {string} reservationId - 예약 ID
 * @returns {Promise} 취소 결과
 */
export const cancelReservationOnPaymentFailure = async (reservationId) => {
    try {
        const response = await api.post(`/reservations/${reservationId}/cancel-payment-failure`);
        return response.data;
    } catch (error) {
        console.error('결제 실패로 인한 예약 취소 처리 실패:', error);
        throw error;
    }
};