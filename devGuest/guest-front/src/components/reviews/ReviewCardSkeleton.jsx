import React from 'react';
import { Card, CardHeader, CardContent, Skeleton } from '@mui/material';

const ReviewCardSkeleton = () => {
    return (
        <Card variant="outlined">
            <CardHeader
                avatar={
                    <Skeleton animation="wave" variant="circular" width={40} height={40} />
                }
                title={
                    <Skeleton animation="wave" height={10} width="40%" style={{ marginBottom: 6 }} />
                }
                subheader={<Skeleton animation="wave" height={10} width="20%" />}
            />
            <CardContent sx={{ pt: 0 }}>
                <Skeleton animation="wave" variant="rectangular" height={20} sx={{ mb: 1 }} />
                <Skeleton animation="wave" variant="rectangular" height={60} />
            </CardContent>
        </Card>
    );
};

export default ReviewCardSkeleton;