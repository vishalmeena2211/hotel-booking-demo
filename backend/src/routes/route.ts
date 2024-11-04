import express from 'express';
import { login, signUp } from '../controllers/authController';
import { createBooking, getBookings, getBookingsByStatus, updateBookingStatus } from '../controllers/bookingController';
import upload from '../lib/multer';
import { getHotels, getHotelById, createHotel, updateHotel, deleteHotel } from '../controllers/hotelController';
import { isAuthenticated, isHotelManager, isUser } from '../middlewares/authMiddleware';
import { updateUser } from '../controllers/userController';

const router = express.Router();

// Login route
//@ts-expect-error ignore this error
router.post('/login', login);

// Signup route
//@ts-expect-error ignore this error
router.post('/signup', signUp);

//User Routes
//@ts-expect-error ignore this error
router.post('/profile/complete', isAuthenticated, isUser, upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'aadhar', maxCount: 1 }]), updateUser);

// Booking route
//@ts-expect-error ignore this error
router.post('/booking', isAuthenticated, isUser, upload.array("membersImage", 10), createBooking);

// Update booking status route
//@ts-expect-error ignore this error
router.post('/update-booking-status/:id', isAuthenticated, isHotelManager, updateBookingStatus);

//getBookings By User
//@ts-expect-error ignore this error
router.get('/bookings', isAuthenticated, isUser, getBookings);

//getBookings By Status
//@ts-expect-error ignore this error
router.get('/get-bookings-by-status/:status', isAuthenticated, isHotelManager, getBookingsByStatus)


//hotels routes

// Get all hotels
router.get('/hotels', getHotels);

// Get hotel by ID
router.get('/hotels/:id', getHotelById);

// Create a new hotel
//@ts-expect-error ignore this error
router.post('/hotels', isAuthenticated, isHotelManager, createHotel);

// Update a hotel
//@ts-expect-error ignore this error
router.put('/hotels/:id', isAuthenticated, isHotelManager, updateHotel);

// Delete a hotel
//@ts-expect-error ignore this error
router.delete('/hotels/:id', isAuthenticated, isHotelManager, deleteHotel);




export default router;