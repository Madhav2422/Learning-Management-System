import { createBrowserRouter, BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/ui/Navbar'
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'
import MainLayout from './Layout/MainLayout'
import { RouterProvider } from 'react-router'
import Courses from './pages/student/Courses'

function App() {

 const appRouter=createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:
        <>
          <HeroSection/>
          <Courses/>
        </>

      },
      {
        path:"login",
        element:<Login/>
      }
    ]
  }
 ])

  return (
    <>
   <RouterProvider router={appRouter}/>
    
    </>
  )
}

export default App
