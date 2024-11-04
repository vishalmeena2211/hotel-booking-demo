import { RootState } from '@/redux/Store';
import axios from 'axios';
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { profileApis } from '@/lib/apis';
import { setUser } from '@/redux/Slices/profileSlice';

const CompleteProfile = () => {

    const userAllData = useSelector((state: RootState) => state.profile.user);
    const user = userAllData?.user;
    const [aadharNumber, setAadharNumber] = useState(user?.aadharNumber || '');
    const [aadharPhotoUrl, setAadharPhotoUrl] = useState(user?.aadharPhotoUrl || '');
    const [imageUrl, setImageUrl] = useState(user?.imageUrl || '');
    const [aadharPhotoFile, setAadharPhotoFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const aadharInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const handleSave = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('aadharNumber', aadharNumber);
        if (aadharPhotoFile) {
            formData.append('aadhar', aadharPhotoFile);
        }
        if (imageFile) {
            formData.append('profile', imageFile);
        }

        try {
            const response = await axios.post(profileApis.completeProfile, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userAllData.token}`,
                },
            });
            const { data } = response;
            const newUserData = {
                ...userAllData, user: {
                    ...userAllData.user, aadharNumber: data.aadharNumber
                    , aadharPhotoUrl: data.aadharPhotoUrl, imageUrl: data.imageUrl
                }
            };
            localStorage.setItem('user', JSON.stringify(newUserData));
            dispatch(setUser(newUserData));
        } catch (error) {
            console.error('Error updating profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAadharPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAadharPhotoFile(e.target.files[0]);
            setAadharPhotoUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">Complete Your Profile</h2>
            <div className="mb-4">
                <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-2">Aadhar Number</label>
                <Input
                    id="aadharNumber"
                    autoFocus
                    placeholder="Aadhar Number"
                    type="text"
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="mb-4"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Aadhar Photo</label>
                <div className="flex flex-col items-center justify-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                    <Button
                        onClick={() => aadharInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload from device
                    </Button>
                </div>
                <Input
                    id="aadharPhoto"
                    type="file"
                    accept="image/*"
                    onChange={handleAadharPhotoChange}
                    disabled={isLoading}
                    className="hidden"
                    ref={aadharInputRef}
                />
                {aadharPhotoUrl && <img src={aadharPhotoUrl} alt="Aadhar" className="w-full mt-4 rounded-lg" />}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex flex-col items-center justify-center sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                    <Button
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload from device
                    </Button>
                </div>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="hidden"
                    ref={imageInputRef}
                />
                {imageUrl && <img src={imageUrl} alt="Profile" className="w-full mt-4 rounded-lg" />}
            </div>
            <div>
                <Button onClick={handleSave} color="primary" disabled={isLoading}>
                    {isLoading ? "Saving" : "Save"}
                </Button>
            </div>
        </div>
    );
}

export default CompleteProfile;
