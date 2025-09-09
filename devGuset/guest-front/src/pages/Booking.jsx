import React from 'react';
import { Typography, Container } from '@mui/material';

const Booking = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        예약
      </Typography>
      <Typography variant="body1">
        예약 페이지입니다.
      </Typography>
    </Container>
  );
};

export default Booking;
