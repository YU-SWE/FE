import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosConfig';

function RestaurantDetail() {

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);  // 빈 객체 대신 null로 초기화
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const YOUR_KAKAO_API_KEY = "YOUR_API_KEY";
  const [newReview, setNewReview] = useState({
    reviewstar: '',
    content: '',
    rid: restaurantId,
    userid: '익명',
    image: null
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReview, setEditReview] = useState({
    reviewstar: '',
    content: '',
    image: null
  });
  const handleEditReview = (review) => {
    setEditingReviewId(review.reviewid);
    setEditReview({
      reviewstar: review.reviewstar,
      content: review.content,
      image: null
    });
    setRating(review.reviewstar);
  };
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || !role) {
        setIsAdmin(false);
        return;
      }

      setIsAdmin(role === 'ADMIN');
    };

    checkAdmin();
  }, []);
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');

    try {
      const response = await axios.put(
          `http://localhost:8080/api/review_info/${editingReviewId}`,
          {
            reviewstar: rating,
            content: editReview.content
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`
            }
          }
      );

      if (response.status === 200) {
        // 리뷰 목록 새로고침
        const reviewsResponse = await axios.get(
            `http://localhost:8080/api/review_info/restaurant/${restaurantId}`
        );

        // 받아온 데이터 처리
        const parsedReviewsData = typeof reviewsResponse.data === 'string'
            ? JSON.parse(reviewsResponse.data.split('][')[0] + ']')
            : reviewsResponse.data;

        setReviews(Array.isArray(parsedReviewsData) ? parsedReviewsData : []);

        // 수정 모드 종료 및 상태 초기화
        setEditingReviewId(null);
        setEditReview({
          reviewstar: '',
          content: '',
          image: null
        });
        setRating(0);
        setHover(0);

        alert('리뷰가 성공적으로 수정되었습니다.');
      }
    } catch (error) {
      console.error('Update Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        alert('로그인이 필요합니다.');
        navigate('/login');
      } else {
        alert('리뷰 수정에 실패했습니다.');
      }
    }
  };

  function base64UrlDecode(str) {
    try {
      // Base64 URL -> Base64 변환
      str = str.replace(/-/g, '+').replace(/_/g, '/');

      // Base64 디코딩
      const decodedStr = atob(str);

      // UTF-8 디코딩
      const bytes = new Uint8Array(decodedStr.split('').map(char => char.charCodeAt(0)));
      const decodedText = new TextDecoder('utf-8').decode(bytes);

      return JSON.parse(decodedText);
    } catch (e) {
      console.error("Failed to decode base64 string:", e);
      return null;
    }
  }

// JWT 토큰 디코딩
  function customJwtDecode(token) {
    const base64Url = token.split('.')[1]; // payload 부분만 가져오기
    return base64UrlDecode(base64Url);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const decoded = customJwtDecode(token);
      setUserId(decoded.username);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/yufood/${restaurantId}`),
          axios.get(`http://localhost:8080/api/review_info/restaurant/${restaurantId}`)
        ]);

        const parsedRestaurantData = typeof restaurantResponse.data === 'string'
            ? JSON.parse(restaurantResponse.data.split('}{')[0] + '}')
            : restaurantResponse.data;

        // reviews 데이터 처리 수정
        let parsedReviewsData;
        if (typeof reviewsResponse.data === 'string') {
          parsedReviewsData = JSON.parse(reviewsResponse.data.split('][')[0] + ']');
        } else {
          parsedReviewsData = reviewsResponse.data;
        }

        setRestaurant(parsedRestaurantData);
        setReviews(Array.isArray(parsedReviewsData) ? parsedReviewsData : []);

      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  useEffect(() => {
    const loadKakaoMap = () => {
      if (!restaurant) return;
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${YOUR_KAKAO_API_KEY}&libraries=services`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(initializeMap);
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container || !restaurant) return;
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(restaurant.addr, function(result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          const options = { center: coords, level: 3 };
          const newMap = new window.kakao.maps.Map(container, options);
          const marker = new window.kakao.maps.Marker({
            map: newMap,
            position: coords
          });
        }
      });
    };

    if (showMap && restaurant) {
      loadKakaoMap();
    }
  }, [showMap, restaurant]);

  const showKakaoMap = () => {
    setShowMap(true);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const calculateAverageRating = (reviews) => {
    const currentToken = localStorage.getItem("token");
    // reviews가 배열인지 확인
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => {
      // reviewstar가 숫자인지 확인
      const rating = Number(review.reviewstar);
      return acc + (isNaN(rating) ? 0 : rating);
    }, 0);
    const num = sum / reviews.length;
    console.log(restaurantId);
    axios.post(
      'http://localhost:8080/api/review_info/updatestar', // 백엔드 API 호출
      null,
      {
        params: { 
          star: num,
          rid: restaurantId
        }, // 평균 별점을 파라미터로 전달
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return num;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReview(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) {
      setNewReview(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        const currentToken = localStorage.getItem('token');

        await axios.delete(`http://localhost:8080/api/review_info/${reviewId}`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json'
          }
        });

        // 삭제 후 리뷰 목록 새로고침
        const reviewsResponse = await axios.get(
            `http://localhost:8080/api/review_info/restaurant/${restaurantId}`
        );

        const parsedReviewsData = typeof reviewsResponse.data === 'string'
            ? JSON.parse(reviewsResponse.data.split('][')[0] + ']')
            : reviewsResponse.data;

        setReviews(Array.isArray(parsedReviewsData) ? parsedReviewsData : []);
        alert('리뷰가 성공적으로 삭제되었습니다.');
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
        } else {
          console.error('리뷰 삭제 실패:', error);
          alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token');

    if (!currentToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('reviewstar', rating);
      formData.append('content', newReview.content);
      formData.append('rid', restaurantId);

      if (newReview.image) {
        formData.append('image', newReview.image);
      }

      const response = await axios.post(
          'http://localhost:8080/api/review_info',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${currentToken}`
            }
          }
      );

      if (response.status === 200 || response.status === 201) {
        // 폼 초기화
        setNewReview({
          reviewstar: '',
          content: '',
          rid: restaurantId,
          image: null
        });
        setPreviewImage(null);
        setRating(0);

        // 리뷰 목록 즉시 새로고침
        const reviewsResponse = await axios.get(
            `http://localhost:8080/api/review_info/restaurant/${restaurantId}`
        );

        // 받아온 데이터 처리 로직 추가
        const parsedReviewsData = typeof reviewsResponse.data === 'string'
            ? JSON.parse(reviewsResponse.data.split('][')[0] + ']')
            : reviewsResponse.data;

        setReviews(Array.isArray(parsedReviewsData) ? parsedReviewsData : []);
        alert('리뷰가 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('Submit Error:', error);
        alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };




  if (loading) return <div className={darkMode ? 'dark' : ''}>로딩 중...</div>;
  if (error) return <div className={darkMode ? 'dark' : ''}>에러: {error}</div>;
  if (!restaurant) return <div className={darkMode ? 'dark' : ''}>식당 정보를 불러오는 중...</div>;
  return (
      <div className={`Detail_cmp ${darkMode ? 'dark' : ''}`}>

        <main className={darkMode ? 'dark' : ''}>
          <div className="cmp">

            <div className='restaurant_photo'>
              {restaurant.image1 && <img src={restaurant.image1} alt="식당 사진 1" />}
              {restaurant.image2 && <img src={restaurant.image2} alt="식당 사진 2" />}
            </div>
            <div className='restaurant_info'>
              <h1>{restaurant.rname}</h1>
              <div className="rating">
              <span className="stars">
              {'★'.repeat(Math.floor(calculateAverageRating(reviews)))}
                {'☆'.repeat(5 - Math.floor(calculateAverageRating(reviews)))}
              </span>
                <span className="score">
              {calculateAverageRating(reviews).toFixed(1)}
              </span>
              </div>
              <div className="address">
                <p>{restaurant.addr}</p>
                <button className="map-button" onClick={showKakaoMap}>지도보기</button>
                {showMap && (
                    <div className="map-container">
                      <div id="map" style={{ width: '100%', height: '400px' }}></div>
                      <button className="close-map" onClick={() => setShowMap(false)}>
                        닫기
                      </button>
                    </div>
                )}
              </div>
              <div className="contact">
                <p>{restaurant.phone}</p>
              </div>
              <div className="business-hours">
                <h3>영업시간</h3>
                <ul>
                  <li>월: {restaurant.mon}</li>
                  <li>화: {restaurant.tue}</li>
                  <li>수: {restaurant.wed}</li>
                  <li>목: {restaurant.thr}</li>
                  <li>금: {restaurant.fri}</li>
                  <li>토: {restaurant.sat}</li>
                  <li>일: {restaurant.sun}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cmp">
            <div className='menu_info'>
              <h2>메뉴정보</h2>
              <ul>
                {restaurant.menus && restaurant.menus.map((menu) => (
                    <li key={menu.mid}>
                      <span className="menu-name">{menu.mname}</span>
                      <span className="menu-price">{menu.mprice}원</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cmp">
            <div className='review_info'>
              <h2>리뷰</h2>
              <div className="review-form">
                <h3>리뷰 작성</h3>
                {isLoggedIn ? (
                    <form onSubmit={handleSubmitReview}>
                      <div className="form-group">
                        <label>평점:</label>
                        <div className="star-rating">
                          {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <label key={index}>
                                  <input
                                      type="radio"
                                      name="reviewstar"
                                      value={ratingValue}
                                      onClick={() => {
                                        setRating(ratingValue);
                                        setNewReview(prev => ({
                                          ...prev,
                                          reviewstar: ratingValue
                                        }));
                                      }}
                                  />
                                  <span
                                      className="star"
                                      style={{
                                        color: ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                                      }}
                                      onMouseEnter={() => setHover(ratingValue)}
                                      onMouseLeave={() => setHover(rating)}
                                  >★</span>
                                </label>
                            );
                          })}
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="content">리뷰 내용:</label>
                        <textarea
                            id="content"
                            name="content"
                            rows="4"
                            value={newReview.content}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                      </div>
                      <div
                          className="form-group image-upload-area"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current.click()}
                      >
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px'}} />
                        ) : (
                            <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
                        )}
                      </div>
                      <button type="submit" className="submit-review">리뷰 등록</button>
                    </form>
                ) : (
                    <p>리뷰를 작성하려면 로그인이 필요합니다.</p>
                )}
              </div>
              <div className="review-list">
                {Array.isArray(reviews) && reviews.map((review) => (
                    <div key={review.reviewid} className="review">

                      {editingReviewId === review.reviewid ? (
                          <form onSubmit={handleUpdateReview}>
                            <div className="form-group">
                              <div className="star-rating">
                                {[...Array(5)].map((star, index) => {
                                  const ratingValue = index + 1;
                                  return (
                                      <label key={index}>
                                        <input
                                            type="radio"
                                            name="reviewstar"
                                            value={ratingValue}
                                            onClick={() => {
                                              setRating(ratingValue);
                                              setEditReview(prev => ({...prev, reviewstar: ratingValue}));
                                            }}
                                        />
                                        <span className="star"
                                              style={{
                                                color: ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                                              }}
                                              onMouseEnter={() => setHover(ratingValue)}
                                              onMouseLeave={() => setHover(rating)}
                                        >★</span>
                                      </label>
                                  );
                                })}
                              </div>
                            </div>
                            <textarea
                                value={editReview.content}
                                onChange={(e) => setEditReview(prev => ({...prev, content: e.target.value}))}
                            />
                            <div className="button-group">
                              <button type="submit">저장</button>
                              <button type="button" onClick={() => setEditingReviewId(null)}>취소</button>
                            </div>
                          </form>
                      ) : (
                          <>
                            <div className="review-header">
                              <span className="reviewer-name">{review.username}</span>
                              <div className="review-actions">
                                <span className="review-rating">{'★'.repeat(review.reviewstar)}</span>
                                {userId === review.username && (
                                    <button onClick={() => handleEditReview(review)} className="edit-review-btn">
                                      수정
                                    </button>
                                )}
                                {(userId === review.username || isAdmin) && (
                                    <button onClick={() => handleDeleteReview(review.reviewid)} className="delete-review-btn">
                                      삭제
                                    </button>
                                )}
                              </div>
                            </div>
                            <p className="review-content">{review.content}</p>
                            {review.imageUrl && (
                                <div className="review-image">
                                  <img src={`http://localhost:8080${review.imageUrl}`} alt="Review" className="review-img" />
                                </div>
                            )}
                          </>
                      )}
                    </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}

export default RestaurantDetail;