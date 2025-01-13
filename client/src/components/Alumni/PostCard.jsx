import React,{useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import './swiper.css'


const PostCard = ({ user, profile_photo, createdAt, content, images, likesCount }) => {

  const [isLiked, setIsLiked] = useState(false); // Track like state
  const [currentLikes, setCurrentLikes] = useState(likesCount);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // console.log(user,images)
  return (
    <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
      <div className="flex items-center mb-2">
        <img
          src={profile_photo}
          alt={`${user}'s profile`}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        
      <h3 className="font-bold text-lg">{user}</h3>
      </div>
      
      <div className='border-blue-400'>
      {images.length > 0 && (
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
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

</div>
<p className="text-gray-700 mt-3">{content}</p>
              {/* Footer Section */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex-start">
          <button
            className={`text-lg ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
            onClick={toggleLike}
          >
            <i className={`fas fa-heart ${isLiked ? '' : 'far'}`}></i> {/* Font Awesome Icon */}
          </button>
          <span className="text-sm text-gray-600">
            <strong>{currentLikes}</strong> {currentLikes === 1 ? 'like' : 'likes'}
          </span>
        </div>
        <div className="date">
          <p className="text-sm text-gray-500">Published on {formatDate(createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
