import { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';

// 'export' 키워드가 const 앞에 있는지 확인하세요.
export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [sort, setSort] = useState('createdAt,desc');

    const fetchReviews = useCallback(async (currentPage, currentSort) => {
        setLoading(true);
        try {
            const res = await reviewService.getAllReviews(currentPage - 1, 10, currentSort);
            setReviews(res.data.content);
            setTotalPages(res.data.totalPages);
            setError(null);
        } catch (err) {
            setError('후기를 불러오는 데 실패했습니다.');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReviews(page, sort);
    }, [page, sort, fetchReviews]);
    
    return { reviews, setReviews, loading, error, page, totalPages, sort, setPage, setSort, fetchReviews };
};