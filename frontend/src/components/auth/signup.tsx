import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { authApis } from "@/lib/apis"

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && password) {
      try {
        // Simulate an API call
        await axios.post(authApis.signup, {
          name, email, password
        })

        toast({
          title: "Signup Successful",
          description: "Your account has been created. Now Login!",
        })
        // Redirect to the book donation form page or a welcome page
        navigate("/login")
      } catch {
        toast({
          title: "Signup Failed",
          description: "An error occurred during signup. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Signup Failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create an account to access the Book Donation System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/login")}>
            Already have an account? Log in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}