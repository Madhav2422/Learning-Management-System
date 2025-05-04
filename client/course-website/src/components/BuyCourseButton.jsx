// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import axios from "axios";
// import { useGetCourseByIDQuery } from "@/features/apis/courseApi";
// import { useSelector } from "react-redux";

// const BuyCourseButton = ({ courseId, userId }) => {
//   const { user } = useSelector((state) => state.auth);
//   const { data: courseData, isLoading } = useGetCourseByIDQuery(courseId);
//   const [loading, setLoading] = useState(false);

//   const handlePurchase = async () => {
//     if (isLoading) return;
//     if (!courseData || !courseData.course) {
//       alert("Course data missing!");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Step 1: Create order on backend
//       const response = await axios.post(
//         "http://localhost:8080/api/v1/purchase/purchaseCourse",
//         { courseId: courseData.course._id, userId: user._id },
//         { withCredentials: true }
//       );

//       if (!response.data.success) {
//         alert("Failed to create order!");
//         return;
//       }

//       const order = response.data.order;

//       // Step 2: Initialize Razorpay
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: order.currency,
//         name: "Course Payment",
//         description: courseData.course.courseTitle,
//         order_id: order.id,
//         handler: async (response) => {
//           try {
//             const { data } = await axios.post(
//               "http://localhost:8080/api/v1/purchase/verifyPayment",
//               response,
//               { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
//             );
//             if (data.success) {
//               alert("Payment successful! 🎉");
//               window.location.href = data.redirectUrl;
//              }
            
//           } catch (error) {
//             alert("Verification failed!");
//           }
//         },
//         theme: { color: "#3399cc" }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (response) => alert("Payment failed! ❌"));
//       rzp.open();
//     } catch (error) {
//       console.error("Purchase Error:", error.response?.data || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Button className="w-full" onClick={handlePurchase} disabled={loading}>
//       {loading ? "Processing..." : "Purchase Course"}
//     </Button>
//   );
// };

// export default BuyCourseButton;


import React, { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useGetCourseByIDQuery } from "@/features/apis/courseApi";
import { useSelector } from "react-redux";

const BuyCourseButton = ({ courseId, userId, onPurchaseSuccess }) => {
  const { user } = useSelector((state) => state.auth);
  const { data: courseData, isLoading } = useGetCourseByIDQuery(courseId);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (isLoading) return;
    if (!courseData || !courseData.course) {
      alert("Course data missing!");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create order on backend
      const response = await axios.post(
        "http://localhost:8080/api/v1/purchase/purchaseCourse",
        { courseId: courseData.course._id, userId: user._id },
        { withCredentials: true }
      );

      if (!response.data.success) {
        alert("Failed to create order!");
        return;
      }

      const order = response.data.order;

      // Step 2: Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Course Payment",
        description: courseData.course.courseTitle,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              "http://localhost:8080/api/v1/purchase/verifyPayment",
              response,
              {
                headers: { Authorization: `Bearer ${user.token}` },
                withCredentials: true
              }
            );

            if (verifyRes.data.success) {
              alert("Payment successful! 🎉");
              // ✅ Call success callback or refetch logic
              if (onPurchaseSuccess) {
                onPurchaseSuccess();
              }
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            alert("Payment verification failed!");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment cancelled.");
            // ❌ Do nothing else. No redirect, no state change.
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => alert("Payment failed! ❌"));
      rzp.open();
    } catch (error) {
      console.error("Purchase Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="w-full" onClick={handlePurchase} disabled={loading}>
      {loading ? "Processing..." : "Purchase Course"}
    </Button>
  );
};

export default BuyCourseButton;
