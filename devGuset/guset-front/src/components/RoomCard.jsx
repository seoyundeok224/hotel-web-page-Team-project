import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material';

function RoomCard({ name, image, desc, features, cardWidth, cardHeight, imageHeight }) {
  return (
    <Card
      sx={{
        height: cardHeight,
        width: cardWidth,
        minWidth: cardWidth,
        maxWidth: cardWidth,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        boxSizing: 'border-box',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6, // MUI aulla
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={name}
        sx={{
          height: imageHeight,
          width: '100%',
          objectFit: 'cover'
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" align="center" sx={{ mb: 1 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          {desc}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {features.map((feature, idx) => (
            <Chip key={idx} label={feature} size="small" color="primary" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

export default RoomCard;