import React from 'react';
import { Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const Timestamp = ({ date }) => {
    if (!date) return null;

    const formattedDate = formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });

    return (
        <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ ml: 1 }}
            title={new Date(date).toLocaleString('ko-KR')}
        >
            {formattedDate}
        </Typography>
    );
};

export default Timestamp;