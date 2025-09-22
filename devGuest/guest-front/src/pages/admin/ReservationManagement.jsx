import { useState, useEffect } from 'react'
import {
  Box, Container, Typography, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

import { getAllReservations, deleteReservation, createReservation, updateReservation } from '../../services/reservationService'

const Reservations = () => {
  const [reservations, setReservations] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [formData, setFormData] = useState({ username: '', roomNumber: '', checkIn: '', checkOut: '', people: 1 })

  const fetchReservations = async () => {
    const data = await getAllReservations()
    const formatted = data.map(r => ({
      id: r.id,
      reservationNumber: r.reservationNumber,
      guestName: r.guestName,
      guestPhone: r.guestPhone,
      roomNumber: r.roomNumber,
      roomType: r.roomType,
      checkIn: r.checkIn,
      checkOut: r.checkOut,
      people: r.people,
      paymentStatus: r.paymentStatus
    }))
    setReservations(formatted)
  }

  useEffect(() => { fetchReservations() }, [])

  const handleFormChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (editingReservation) await updateReservation(editingReservation.id, formData)
      else await createReservation(formData)
      fetchReservations()
      setOpenModal(false)
    } catch (e) { alert('예약 실패: ' + e.message) }
  }

  const handleOpenModal = r => {
    if (r) setEditingReservation(r) && setFormData({ username: r.guestName, roomNumber: r.roomNumber, checkIn: r.checkIn, checkOut: r.checkOut, people: r.people })
    else setEditingReservation(null) && setFormData({ username: '', roomNumber: '', checkIn: '', checkOut: '', people: 1 })
    setOpenModal(true)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>예약 관리</Typography>
      </Box>

      <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>새 예약</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>예약번호</TableCell>
              <TableCell>고객명</TableCell>
              <TableCell>객실</TableCell>
              <TableCell>체크인/체크아웃</TableCell>
              <TableCell>투숙객 수</TableCell>
              <TableCell>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map(r => (
              <TableRow key={r.id}>
                <TableCell>{r.reservationNumber}</TableCell>
                <TableCell>{r.guestName}</TableCell>
                <TableCell>{r.roomNumber} ({r.roomType})</TableCell>
                <TableCell>{r.checkIn} ~ {r.checkOut}</TableCell>
                <TableCell>{r.people}명</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenModal(r)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => deleteReservation(r.id).then(fetchReservations)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{editingReservation ? '예약 수정' : '새 예약'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField name="username" label="유저 아이디" value={formData.username} onChange={handleFormChange} />
          <TextField name="roomNumber" label="객실 번호" value={formData.roomNumber} onChange={handleFormChange} />
          <TextField name="checkIn" label="체크인" type="date" value={formData.checkIn} onChange={handleFormChange} InputLabelProps={{ shrink: true }} />
          <TextField name="checkOut" label="체크아웃" type="date" value={formData.checkOut} onChange={handleFormChange} InputLabelProps={{ shrink: true }} />
          <TextField name="people" label="투숙객 수" type="number" value={formData.people} onChange={handleFormChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>취소</Button>
          <Button variant="contained" onClick={handleSubmit}>저장</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Reservations
