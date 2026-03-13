import { useEffect, useState } from "react";

import DashboardLayout from "@/layouts/DashboardLayout";

import { Settings, Eye, EyeOff } from "lucide-react";

import { userAPI } from "@/services/api";

import { toast } from "sonner";

import Skeleton from "@/components/Skeleton";
import DeleteAccountModal from "@/components/DeleteAccountModal";

export default function UserSettings(){

const [loading,setLoading]=useState(true)

const [profile,setProfile]=useState({
name:"",
email:""
})

const [password,setPassword]=useState({
currentPassword:"",
newPassword:""
})

const [showPassword,setShowPassword]=useState(false)
const [showModal,setShowModal]=useState(false)
const [avatar,setAvatar]=useState<File|null>(null)

useEffect(()=>{

const loadProfile=async()=>{

try{

const res=await userAPI.getProfile()

const user=res.data.data

setProfile({
name:user.name,
email:user.email
})

}catch{
toast.error("Failed to load profile")
}finally{
setLoading(false)
}

}

loadProfile()

},[])

const handleProfile=(e:any)=>{
setProfile({...profile,[e.target.name]:e.target.value})
}

const handlePassword=(e:any)=>{
setPassword({...password,[e.target.name]:e.target.value})
}

const handleAvatar=(e:any)=>{
if(e.target.files?.length){
setAvatar(e.target.files[0])
}
}

const updateProfile=async(e:any)=>{
e.preventDefault()

try{

const formData=new FormData()

formData.append("name",profile.name)
formData.append("email",profile.email)

if(avatar){
formData.append("avatar",avatar)
}

await userAPI.updateProfile(formData)

toast.success("Profile updated")

}catch(err:any){
toast.error(err.response?.data?.message)
}

}

const updatePassword=async(e:any)=>{
e.preventDefault()

try{

await userAPI.updatePassword(password)

toast.success("Password updated")

setPassword({
currentPassword:"",
newPassword:""
})

}catch(err:any){
toast.error(err.response?.data?.message)
}

}

const deleteAccount=async()=>{

try{

await userAPI.deleteAccount()

toast.success("Account deleted")

localStorage.clear()

window.location.href="/"

}catch{
toast.error("Delete failed")
}

}

if(loading){
return(

<DashboardLayout>

<div className="p-6 space-y-4 max-w-xl">

<Skeleton className="h-8 w-40"/>

<Skeleton className="h-40 w-full"/>

<Skeleton className="h-40 w-full"/>

</div>

</DashboardLayout>

)
}

return(

<DashboardLayout>

<div className="max-w-xl p-6 space-y-8">

<h1 className="text-2xl font-bold flex items-center gap-2">
<Settings size={22}/>
Account Settings
</h1>

{/* PROFILE */}

<form
onSubmit={updateProfile}
className="bg-white shadow rounded-lg p-6 space-y-4"
>

<h2 className="font-semibold">Profile</h2>

<input
name="name"
value={profile.name}
onChange={handleProfile}
placeholder="Name"
className="w-full border p-2 rounded"
/>

<input
name="email"
value={profile.email}
onChange={handleProfile}
placeholder="Email"
className="w-full border p-2 rounded"
/>

<input
type="file"
accept="image/*"
onChange={handleAvatar}
/>

<button
className="bg-green-600 text-white px-4 py-2 rounded"
>
Update Profile
</button>

</form>

{/* PASSWORD */}

<form
onSubmit={updatePassword}
className="bg-white shadow rounded-lg p-6 space-y-4"
>

<h2 className="font-semibold">Change Password</h2>

<div className="relative">

<input
type={showPassword ? "text":"password"}
name="currentPassword"
value={password.currentPassword}
onChange={handlePassword}
placeholder="Current Password"
className="w-full border p-2 rounded"
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-2"
>

{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

</button>

</div>

<input
type="password"
name="newPassword"
value={password.newPassword}
onChange={handlePassword}
placeholder="New Password"
className="w-full border p-2 rounded"
/>

<button
className="bg-blue-600 text-white px-4 py-2 rounded"
>
Update Password
</button>

</form>

{/* DANGER */}

<div className="bg-white shadow rounded-lg p-6">

<h2 className="text-red-600 font-semibold">
Danger Zone
</h2>

<button
onClick={()=>setShowModal(true)}
className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
>
Delete Account
</button>

</div>

<DeleteAccountModal
open={showModal}
onClose={()=>setShowModal(false)}
onConfirm={deleteAccount}
/>

</div>

</DashboardLayout>

)
}