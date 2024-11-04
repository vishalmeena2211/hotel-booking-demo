'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Check, X, ChevronDown, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Booking } from './user-bookings'
import axios from 'axios'
import { bookingApis } from '@/lib/apis'
import { toast } from '@/hooks/use-toast'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/Store'

export default function BookingApprovalUI() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const token = useSelector((state: RootState) => state.auth.token)


  const fetchBookings = async () => {
    try {
      const response = await axios.get(bookingApis.getBookingsByStatus + "/PENDING",{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setBookings(response.data)
      toast({
        title: 'Bookings fetched successfully',
        description: 'Pending bookings have been loaded.',
      })
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error fetching bookings',
        description: 'There was an error fetching the bookings. Please try again later.',
      })
    }
  }

  const handleApproval = async (bookingId: number, approved: boolean) => {
    const status = approved ? "APPROVED" : "REJECTED";
    try {
      const response = await axios.post(bookingApis.updateBookingStatus + "/" + bookingId.toString(), { status },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (bookings) {
        setBookings(bookings?.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: approved ? "APPROVED" : "REJECTED" }
            : booking
        ))
        toast({
          title: `Booking ${approved ? 'approved' : 'rejected'} successfully`,
          description: `Booking #${bookingId} has been ${approved ? 'approved' : 'rejected'}.`,
        })
      } else {
        console.error('Error approving/rejecting booking:', response.statusText)
        toast({
          title: 'Error updating booking status',
          description: 'There was an error updating the booking status. Please try again later.',
        })
      }
    } catch (error) {
      console.error('Error approving/rejecting booking:', error)
      toast({
        title: 'Error updating booking status',
        description: 'There was an error updating the booking status. Please try again later.',
      })
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Approvals</h1>
      <div className="space-y-4">
        {bookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <CardTitle>Booking #{booking.id}</CardTitle>
                <Badge variant={booking.status === "PENDING" ? "outline" : (booking.status === "APPROVED" ? "default" : "destructive")}>
                  {booking.status}
                </Badge>
              </div>
              <CardDescription>
                {format(new Date(booking.startDate), 'PPP')} - {format(new Date(booking.endDate), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{booking?.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{booking?.user?.name}</p>
                      <p className="text-sm text-muted-foreground">Primary Guest</p>
                      <p className="text-sm text-muted-foreground">Aadhar: {booking?.user?.aadharNumber}</p>
                    </div>
                  </div>
                  <div className="relative aspect-[3/2] w-full max-w-md overflow-hidden rounded-lg">
                    <img
                      src={booking?.user?.aadharPhotoUrl}
                      alt={`Aadhar card of ${booking?.user?.name}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Hotel</p>
                  <p className="text-sm text-muted-foreground">{booking?.hotel?.name}</p>
                </div>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-between w-full">
                      <span>View Additional Members ({booking?.members?.length})</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-4">
                    {booking?.members?.map((member, index) => (
                      <div key={index} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                        <div className="flex items-center space-x-4">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{member?.name}</p>
                            <p className="text-sm text-muted-foreground">Aadhar: {member?.aadharNumber}</p>
                          </div>
                        </div>
                        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                          <img
                            src={member?.aadharPhotoUrl}
                            alt={`Aadhar card of ${member?.name}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    ))}

                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
              <Button
                variant="outline"
                onClick={() => handleApproval(booking.id, false)}
                disabled={booking.status !== "PENDING"}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button
                onClick={() => handleApproval(booking.id, true)}
                disabled={booking.status !== "PENDING"}
              >
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            </CardFooter>
          </Card>
        ))}
        {bookings?.length === 0 && (
          <div>
            <p className="text-lg text-center text-muted-foreground">No bookings to approve</p>
          </div>
        )}
      </div>
    </div>
  )
}