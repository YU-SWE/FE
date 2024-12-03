/* global kakao */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./KakaoMap.css";

const KakaoMap = ({ restaurants }) => {
    const navigate = useNavigate();
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오 지도 API가 로드되지 않았습니다.");
            return;
        }

        const mapContainer = mapRef.current;
        const mapOption = {
            center: new kakao.maps.LatLng(35.836, 128.754),
            level: 4,
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        const geocoder = new kakao.maps.services.Geocoder();
        const bounds = new kakao.maps.LatLngBounds();

        const tempMarkers = [];

        restaurants.forEach((restaurant) => {
            if (!restaurant.addr) return;

            geocoder.addressSearch(restaurant.addr, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const latitude = parseFloat(result[0].y);
                    const longitude = parseFloat(result[0].x);

                    const markerPosition = new kakao.maps.LatLng(latitude, longitude);

                    const defaultMarkerImage = new kakao.maps.MarkerImage(
                        "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                        new kakao.maps.Size(24, 35)
                    );

                    const highlightedMarkerImage = new kakao.maps.MarkerImage(
                        "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                        new kakao.maps.Size(36, 52)
                    );

                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                        image: defaultMarkerImage,
                        map,
                    });

                    // 마커 클릭 이벤트 추가
                    kakao.maps.event.addListener(marker, 'click', () => {
                        navigate(`/restaurant/${restaurant.rid}`);
                    });

                    bounds.extend(markerPosition);

                    tempMarkers.push({
                        marker,
                        id: restaurant.rid,
                        defaultMarkerImage,
                        highlightedMarkerImage,
                    });
                }
            });
        });

        Promise.all(
            restaurants.map(
                (restaurant) =>
                    new Promise((resolve) =>
                        geocoder.addressSearch(restaurant.addr, (result, status) => {
                            if (status === kakao.maps.services.Status.OK) {
                                const position = new kakao.maps.LatLng(result[0].y, result[0].x);
                                bounds.extend(position);
                                resolve(position);
                            } else {
                                resolve(null);
                            }
                        })
                    )
            )
        ).then(() => {
            setMarkers(tempMarkers);
            if (bounds.isEmpty()) {
                map.setCenter(new kakao.maps.LatLng(35.836, 128.754));
            } else {
                map.setBounds(bounds);
            }
        });

        return () => {
            if (mapContainer) {
                mapContainer.innerHTML = "";
            }
        };
    }, [restaurants, navigate]);

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`);
    };

    const handleMouseOver = (restaurantId) => {
        const targetMarker = markers.find((m) => m.id === restaurantId);
        if (targetMarker) {
            targetMarker.marker.setImage(targetMarker.highlightedMarkerImage);
        }
    };

    const handleMouseOut = (restaurantId) => {
        const targetMarker = markers.find((m) => m.id === restaurantId);
        if (targetMarker) {
            targetMarker.marker.setImage(targetMarker.defaultMarkerImage);
        }
    };

    return (
        <div>
            <div 
                ref={mapRef} 
                id="map" 
                style={{ width: "100%", height: "400px", margin: "20px 0" }} 
            />

            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.rid}
                        className="restaurant-item"
                        onMouseOver={() => handleMouseOver(restaurant.rid)}
                        onMouseOut={() => handleMouseOut(restaurant.rid)}
                        onClick={() => handleRestaurantClick(restaurant.rid)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={restaurant.image1} 
                            alt={restaurant.rname} 
                            className="restaurant-image" 
                        />
                        <h3>{restaurant.rname}</h3>
                        <p>{restaurant.addr}</p>
                        <p>⭐ {restaurant.rstar.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KakaoMap;