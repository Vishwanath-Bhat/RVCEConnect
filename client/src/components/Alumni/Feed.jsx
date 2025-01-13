// import React, { useRef, useState } from 'react';
// // Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// import './swiper.css';

// // import required modules
// import { Pagination, Navigation } from 'swiper/modules';

// export default function App() {
//   const [imagePreviews, setImagePreviews] = useState(['https://swiperjs.com/demos/images/nature-1.jpg','https://swiperjs.com/demos/images/nature-1.jpg']);

//   return (
//     <>
//       <Swiper
//         style={{
//           '--swiper-navigation-color': '#fff',
//           '--swiper-pagination-color': '#fff',
//         }}
//         lazy={true}
//         pagination={{
//           clickable: true,
//         }}
//         navigation={true}
//         modules={[Pagination, Navigation]}
//         className="mySwiper"
//       >
//         {imagePreviews.map((preview, index) => (
//   <SwiperSlide key={index}>
//     <img src={preview} alt={`Preview ${index + 1}`} loading="lazy" />
//   </SwiperSlide>
// ))}
//       </Swiper>
//     </>
//   );
// }










import React, { useState, useRef, useEffect} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PostCard from './PostCard';
import { Pagination, Navigation } from 'swiper/modules';
import './swiper.css'

import { useGetRandomPostsQuery } from '../../redux/api/apiSlice';
import useAuth from '../../redux/hooks/useAuth';

const Feed = () => {
  const [posts, setPosts] = useState([])
  const {user, currentUserId} = useAuth()
  // console.log(currentUserId)
  const {data , isLoading, isError} = useGetRandomPostsQuery(currentUserId)

  const fileInputRef = useRef(null); 

  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (data) {
      setPosts(data.posts || []);
    }
  }, [data]);

  if(isLoading){
    return <p>Loading.....</p>
  }
  // console.log(posts)
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    // console.log(files)
    // Clear previews to avoid infinite re-renders
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    // console.log(newPreviews)
    setImages(files);
    setImagePreviews((prevPreviews) => [...newPreviews]);
    
  };

  const handlePost = async () => {
    if (!description && images.length === 0) {
      alert('Please add a description or images.');
      return;
    }
    

    const formData = new FormData();
    formData.append('username', user)
    formData.append('description', description);
    images.forEach((image) => {
      formData.append('post', image);
    });

    try {
      const response = await fetch('http://localhost:3000/api/v1/post/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newPost = await response.json();
        // console.log(newPost.post)
        setPosts([newPost.post, ...posts]);
        setDescription('');
        setImages([]);
        setImagePreviews([]);

        //To clear the chosen file after adding post
        if (fileInputRef.current) {
          fileInputRef.current.value = '';  
        }
      } else {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';  
        }
        setImagePreviews([])
        alert('Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      
      alert('An error occurred.');
    }
  };

  return (
    <>
      <div className="flex-1 bg-white p-4">
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 rounded-md border border-gray-300"
          ></textarea>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />

{imagePreviews.length > 0 && (
          <Swiper
            style={{
              '--swiper-navigation-color': '#fff',
              '--swiper-pagination-color': '#fff',
            }}
            pagination={{
              clickable: true,
            }}
            navigation
            modules={[Pagination, Navigation]}
            className="mySwiper"
            spaceBetween={10}
            slidesPerView={1}
            loop={true} // Enable looping for smooth navigation
          >
            {imagePreviews.map((preview, index) => (
              <SwiperSlide key={index}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

          <button
            onClick={handlePost}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Post
          </button>
        </div>

        {posts.map((post) => (
          <PostCard key={post.id} user={post.username} content={post.description} images={post.post} profile_photo={post.profile_photo} createdAt={post.created_at} likesCount={post.likes_count ? post.likes_count: 0}/>
        ))}
      </div>
    </>
  );
};

export default Feed;
