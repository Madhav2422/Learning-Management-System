import { Menu, School } from 'lucide-react'
import React, { useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DarkMode from '@/DarkMode';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from '@radix-ui/react-dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '@/features/apis/authApi';
import { toast } from 'sonner';


const Navbar = () => {

  const user = true;
 const [logoutUser,{data,isSuccess} ]=useLogoutUserMutation()
 const navigate =useNavigate();


 const logoutHandler=async ()=>{
  await logoutUser()
 }

 useEffect(()=>{
  if(isSuccess){
    toast.success(data.message || " User Log out ")
    navigate("/login")
  }

 },[isSuccess])

  return (

    <div className='h-16 relative  dark:bg-[#0A0A0A] bg-white border-b  dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-0'>
      {/* Desktop */}
      <div className='max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full'>
        <div className='flex items-center gap-2'>
          <School size={"30"} />
          <h1 className='hidden md:block font-extrabold text-2xl '>Aspiration Institute</h1>
        </div>

        {/* //User icons and dark mode icons */}
        <div className='flex items-center gap-4'>
          {
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem><Link to='my-learning'>My learning</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link to="profile">Edit Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    Dashboard
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center gap-2'>
                <Button variant="outline">Login</Button>
                <Button>Sign Up</Button>
              </div>
            )
          }
          <DarkMode />
        </div>
      </div>


      {/* Mobile Device */}
      <div className='flex md:hidden items-center justify-between px-4 h-full'>
        <h1 className='font-extrabold text-2xl'>Aspiration Institute</h1>
        <MobileNavbar />
      </div>
    </div>
  )
}

export default Navbar


const MobileNavbar = () => {
  const role="instructor"
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className='rounded-full bg-gray-200 hover:bg-gray-200' variant="outline"><Menu /></Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='flex flex-row items-center justify-between mt-2'>
          <SheetTitle>Aspiration Institute</SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className='mr-2'/>
         <nav className='flex flex-col space-y-4'>
          <span>My learning</span>
          <span>Edit Profile</span>
          <span>Log Out</span>
         </nav>

         {
          role==="instructor" && (
            <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Dashboard</Button>
            </SheetClose>
          </SheetFooter>
          )
         }
        
      </SheetContent>
    </Sheet>

  )
}