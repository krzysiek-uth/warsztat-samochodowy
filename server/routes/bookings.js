

const express = require('express')
const router = express.Router()
const bookingController = require('../controllers/bookingController')
const { requireAuth, requireAdmin } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/', requireAuth, bookingController.createBooking)

router.get('/', requireAdmin, bookingController.getAllBookings)

router.get('/my', requireAuth, bookingController.getMyBookings)

router.get('/:id', requireAuth, bookingController.getBookingById)

router.put('/:id', requireAuth, bookingController.updateBooking)

router.delete('/:id', requireAuth, bookingController.deleteBooking)

router.patch('/:id/status', requireAdmin, bookingController.updateStatus)

router.post('/:id/images', requireAuth, upload.array('images', 5), bookingController.uploadImages)

router.get('/:id/images', requireAuth, bookingController.getImages)

module.exports = router
