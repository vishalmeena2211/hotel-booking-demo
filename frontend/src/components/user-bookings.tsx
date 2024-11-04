'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar, ChevronDown, Hotel } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import axios from 'axios'
import { bookingApis } from '@/lib/apis'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/Store'

interface User {
  name: string;
  email: string;
  aadharNumber: string;
  aadharPhotoUrl: string;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
}

interface Member {
  id: number;
  name: string;
  aadharNumber: string;
  aadharPhotoUrl: string;
}

export interface Booking {
  id: number;
  userId: number;
  hotelId: number;
  startDate: string;
  endDate: string;
  status: string;
  user: User;
  hotel: Hotel;
  members: Member[];
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>([])
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await axios.get(bookingApis.getBookings, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        setBookings(response.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <div className="space-y-4">
        {bookings?.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  <Hotel className="inline-block mr-2 h-5 w-5" />
                  {booking.hotel.name}
                </CardTitle>
                <Badge variant={booking.status === "PENDING" ? "outline" : (booking.status === "APPROVED" ? "default" : "destructive")}>
                  {booking.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center mt-2">
                <Calendar className="mr-2 h-4 w-4" />
                {format(new Date(booking.startDate), 'PPP')} - {format(new Date(booking.endDate), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Total Guests: {booking.members.length}</p>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex items-center justify-between w-full">
                    <span>View Guest Details</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-4">
                  {booking.members.map((member, index) => (
                    <div key={index} className="flex flex-col space-y-2 border-t pt-2 first:border-t-0 first:pt-0">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">Aadhar: {member.aadharNumber}</p>
                        </div>
                      </div>
                      <div className="relative aspect-[3/2] w-full max-w-md overflow-hidden rounded-lg">
                        <img
                          src={member.aadharPhotoUrl}
                          alt={`Aadhar card of ${member.name}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                {"View Details"}
              </Button>
            </CardFooter>
          </Card>
        ))}
        {
          !bookings?.length && (
            <div className="text-center">
              <p className="text-lg font-medium">No bookings found</p>
            </div>
          )
        }
      </div>
    </div>
  )
}