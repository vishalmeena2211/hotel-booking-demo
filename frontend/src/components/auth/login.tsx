import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux";
import { login } from "@/redux/Slices/authSlice"
import { setUser } from "@/redux/Slices/profileSlice"
import axios from "axios"
import { authApis } from "@/lib/apis"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(authApis.login, {
        email, password
      });
      const userData = res?.data?.data;
      const userToken = userData.token;
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(login(userToken));
      dispatch(setUser(userData));
      setLoading(false);
      if (res.status === 200) {
        if (userData.user.role === "USER") {
          navigate('/hotel-booking')
        } else {
          navigate('/hotel-manager-booking-approval');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md h-screen flex items-center justify-center">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access the Book Donation System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              {loading ? "Signing In ..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}