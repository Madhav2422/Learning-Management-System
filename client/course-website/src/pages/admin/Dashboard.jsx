import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import React from 'react'
import { useGetPurchasedCoursesQuery } from '@/features/apis/purchaseApi';

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) return <h1>Loading...</h1>
  if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>
  if (!data?.purchasedCourses?.length) return <h1>No purchased courses found</h1>

  // Prepare chart data
  const courseData = data.purchasedCourses.map((purchase) => ({
    name: purchase.courseId.courseTitle,
    price: purchase.courseId.coursePrice
  }))

  // Calculate total sales and revenue
  const totalSales = data.purchasedCourses.length;
  const totalRevenue = data.purchasedCourses.reduce(
    (sum, purchase) => sum + purchase.courseId.coursePrice, 
    0
  );

  return (
    <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>

      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60} // Added height to accommodate rotated labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                formatter={(value) => [`₹${value}`]} 
                labelFormatter={(name) => `Course: ${name}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
export default Dashboard;