import BookingForm from '@/components/booking-form'
import CompleteProfile from '@/components/complete-profile';
import { RootState } from '@/redux/Store'
import { useSelector } from 'react-redux'

const BookingPage = () => {
  const user = useSelector((state: RootState) => state.profile.user).user;
  if(!user?.aadharNumber || !user.aadharPhotoUrl) {
    return <><div> Please complete your profile to book a hotel </div>
    <CompleteProfile/>
    </>
  }
  
  return (
    <div>
      <BookingForm />
    </div>
  )
}

export default BookingPage
