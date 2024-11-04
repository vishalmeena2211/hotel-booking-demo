'use client'

import { useState, useRef, useEffect } from 'react'
import { CalendarIcon, PlusCircle, Trash2, Upload } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"

import axios from 'axios'
import { bookingApis, hotelApis } from '@/lib/apis'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/Store'

export default function BookingForm() {
  // State variables
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedHotel, setSelectedHotel] = useState<{ id: number; name: string; location: string }>()
  const [members, setMembers] = useState<{ name: string; aadharNumber: string }[]>([])
  const [membersImage, setMembersImage] = useState<File[]>([])
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [loading, setLoading] = useState(false)

  const [hotels, setHotels] = useState<{ id: number; name: string; location: string }[]>([])
  const token = useSelector((state: RootState) => state.auth.token);

  // Get user from Redux store
  const user = useSelector((state: RootState) => state.profile.user).user;

  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(hotelApis.getHotels)
        setHotels(response.data)
      } catch (error) {
        console.error('Error fetching hotels:', error)
        toast({
          title: "Error",
          description: "Failed to fetch hotels.",
        })
      }
    }

    fetchHotels()
  }, [])

  // Add a new member
  const addMember = () => {
    setMembers([...members, { name: '', aadharNumber: '' }])
  }

  // Update member details
  const updateMember = (index: number, field: string, value: string) => {
    const updatedMembers = [...members]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setMembers(updatedMembers)
  }

  // Remove a member
  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index)
    setMembers(updatedMembers)
    const updatedMembersImage = membersImage.filter((_, i) => i !== index)
    setMembersImage(updatedMembersImage)
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0] || null
    if (file) {
      const updatedMembersImage = [...membersImage]
      updatedMembersImage[index] = file
      setMembersImage(updatedMembersImage)
    }
  }

  // Trigger file input click
  const triggerFileInput = (index: number) => {
    fileInputRefs.current[index]?.click()
  }

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('userId', user.id)
    formData.append('hotelId', selectedHotel?.id.toString() || '0')
    formData.append('startDate', startDate?.toISOString() || '')
    formData.append('endDate', endDate?.toISOString() || '')
    formData.append('members', JSON.stringify(members))
    membersImage.forEach((file) => {
      formData.append(`membersImage`, file)
    })
    setLoading(true)
    try {
      const response = await axios.post(bookingApis.bookHotel, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log('Booking successful:', response.data);
      toast({
        title: "Success",
        description: "Booking successful.",
      })
      // You can add more actions here, like redirecting the user or showing a success message
    } catch (error) {
      console.error('Error booking hotel:', error);
      toast({
        title: "Error",
        description: "Failed to book hotel.",
      })
      // Handle the error, e.g., show an error message to the user
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-1 sm:p-6 lg:p-8">
      <CardHeader>
        <CardTitle>Book a Hotel</CardTitle>
        <CardDescription>Fill in the details to make your reservation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="hotel">Select Hotel</Label>
              <Select onValueChange={(value) => setSelectedHotel(hotels.find(hotel => hotel.id.toString() === value))}>
                <SelectTrigger id="hotel">
                  <SelectValue placeholder="Select a hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.id} value={hotel.id.toString()}>
                      {hotel.name} - {hotel.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Booking Dates</Label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Primary Guest</h3>
              <p className="text-sm text-gray-500">Name: {user.name}</p>
            </div>
            {members.map((member, index) => (
              <div key={index} className="space-y-2 border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Additional Guest {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove guest</span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`name-${index}`}>Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor={`aadhar-${index}`}>Aadhar Number</Label>
                    <Input
                      id={`aadhar-${index}`}
                      value={member.aadharNumber}
                      onChange={(e) => updateMember(index, 'aadharNumber', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor={`aadhar-photo-${index}`}>Aadhar Photo</Label>
                  <input
                    type="file"
                    id={`aadhar-photo-${index}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="hidden"
                    ref={el => fileInputRefs.current[index] = el}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => triggerFileInput(index)}
                      className="flex items-center"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {membersImage[index] ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {membersImage[index] && (
                      <span className="text-sm text-gray-500">
                        {membersImage[index].name.substring(0, 10) + "..."}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMember} className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button disabled={loading} onClick={handleSubmit} className="w-full">{loading ? "Booking..." : "Book Now"}</Button>
      </CardFooter>
    </Card>
  )
}
