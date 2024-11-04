// const baseUrl = process.env.BASE_URL ?? 'https://books-donation-assessment.onrender.com';
const baseUrl = "http://localhost:5000";

export const authApis = {
    login: `${baseUrl}/api/v1/login`,
    signup: `${baseUrl}/api/v1/signup`,
};


export const bookingApis = {
    bookHotel: `${baseUrl}/api/v1/booking`,
    getBookings: `${baseUrl}/api/v1/bookings`,
    getBookingsByStatus: `${baseUrl}/api/v1/get-bookings-by-status`,
    updateBookingStatus: `${baseUrl}/api/v1/update-booking-status`,

};

export const hotelApis = {
    getHotels: `${baseUrl}/api/v1/hotels`,
    getHotelById: (id: string) => `${baseUrl}/api/v1/hotels/${id}`,
    createHotel: `${baseUrl}/api/v1/hotels`,
    updateHotel: (id: string) => `${baseUrl}/api/v1/hotels/${id}`,
    deleteHotel: (id: string) => `${baseUrl}/api/v1/hotels/${id}`,
};

export const profileApis = {
    completeProfile: `${baseUrl}/api/v1/profile/complete`,
};