import React from 'react'
import useAuth from '../../redux/hooks/useAuth';
import { useGetProfileQuery } from '../../redux/api/apiSlice';
import { useSearchParams } from 'react-router-dom';


const ViewProfile = () => {
  const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
  const {data, isLoading} = useGetProfileQuery(id)

if(isLoading){
  return <p>Loading....</p>
}
// console.log(data);
  return (
    <div className="p-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <img
          src={data.data.profile_photo || "https://via.placeholder.com/100"}
          alt="Profile"
          className="rounded-full w-24 mx-auto mb-4"
        />
        <h2 className="text-center text-xl font-bold">{data.data.name}</h2>
        <p className="text-center text-gray-500">{data.data.address || "Profession not specified"}</p>
        <div className="mt-4">
          <p><strong>Company:</strong> {data.data.company_name}</p>
          <p><strong>Location:</strong> {data.data.company_location}</p>
          <p><strong>Graduation Year:</strong> {data.data.graduationYear}</p>
          {/* <p><strong>Address:</strong> {data.data.address}</p> */}
          <p><strong>Email:</strong> {data.data.email}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold">Posts</h3>
        <p>No posts available yet.</p> {/* Replace with posts logic */}
      </div>
    </div>
  );
}

export default ViewProfile
