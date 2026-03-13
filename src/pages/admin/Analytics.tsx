import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { listingAPI, bookingAPI, userAPI } from "@/services/api";

export default function Analytics() {

  const [users,setUsers] = useState(0);
  const [listings,setListings] = useState(0);
  const [bookings,setBookings] = useState(0);

  useEffect(()=>{

    const fetchData = async ()=>{

      try{

        const usersRes = await userAPI.getAll();
        const listingsRes = await listingAPI.getAll();
        const bookingsRes = await bookingAPI.getAllBookings();

        setUsers(usersRes.data?.data?.length || 0);
        setListings(listingsRes.data?.data?.length || 0);
        setBookings(bookingsRes.data?.data?.length || 0);

      }catch(err){
        console.error("Analytics error:", err);
      }

    };

    fetchData();

  },[]);

  return(

    <DashboardLayout>

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-semibold mb-6">
          Analytics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">
              Total Users
            </p>
            <h2 className="text-3xl font-bold">
              {users}
            </h2>
          </div>

          <div className="border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">
              Total Listings
            </p>
            <h2 className="text-3xl font-bold">
              {listings}
            </h2>
          </div>

          <div className="border rounded-xl p-6">
            <p className="text-muted-foreground text-sm">
              Total Bookings
            </p>
            <h2 className="text-3xl font-bold">
              {bookings}
            </h2>
          </div>

        </div>

      </div>

    </DashboardLayout>

  )

}