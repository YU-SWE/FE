import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import KakaoMap from "../common/KakaoMap";
import "./MorePage.css";

function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const initialCategory = params.get("category") || "일식";
    const initialLocation = params.get("location") || "영대 정문";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [activeTab, setActiveTab] = useState(initialLocation);
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const locationMapping = {
        "영대 정문": "정문",
        "영대 후문": "후문",
        "미대 뒷길": "미뒷",
    };

    useEffect(() => {
        fetchRestaurants(page);
        navigate(`/more?category=${encodeURIComponent(activeCategory)}&location=${encodeURIComponent(activeTab)}`);
    }, [activeCategory, activeTab, page]);

    const fetchRestaurants = async (currentPage = 0) => {
        setIsLoading(true);
        setError(null);

        try {
            const mappedLocation = locationMapping[activeTab] || activeTab;

            const url = `http://localhost:8080/api/yufood/paged/category/${encodeURIComponent(activeCategory)}/location/${encodeURIComponent(mappedLocation)}?page=${currentPage}&size=10`;

            const response = await axios.get(url);

            let data;

            // response.data가 문자열일 경우 처리
            if (typeof response.data === "string") {
                // JSON 문자열을 안전하게 처리하도록 불필요한 문자를 제거
                const cleanedData = response.data.split('}{')[0] + "}"; // 첫 번째 JSON만 추출

                console.log("Cleaned Response Data:", cleanedData);  // 정리된 데이터 확인

                try {
                    data = JSON.parse(cleanedData);  // 문자열을 JSON으로 파싱
                } catch (error) {
                    console.error("Error parsing cleaned response:", error);
                    throw new Error("JSON parsing failed after cleaning.");
                }
            } else {
                // 이미 객체인 경우 바로 사용
                data = response.data;
            }

            // 파싱된 데이터에서 content를 추출
            if (data && data.content) {
                const rawData = data.content;  // content 배열을 가져옵니다.
                const parsedEntries = rawData.map((entry) => ({
                    rid: entry.rid,
                    rname: entry.rname,
                    rstar: entry.rstar || 0,
                    addr: entry.addr,
                    image1: entry.image1 || "https://via.placeholder.com/150",  // 기본 이미지
                }));

                setRestaurants(parsedEntries);
                setTotalPages(data.totalPages || 1);  // totalPages 값을 그대로 설정
            } else {
                console.error("Unexpected response format:", data);
                setRestaurants([]);
            }
        } catch (err) {
            console.error("Error fetching restaurants:", err.message);
            setError("식당 데이터를 불러오지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleTabChange = (location) => {
        setActiveTab(location);
        setPage(0); // 지역 변경 시 첫 페이지로 이동
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setPage(0); // 카테고리 변경 시 첫 페이지로 이동
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="search-page-container">
            <h1>더 보기 페이지</h1>

            <p className="selected-info">
                <strong>지역:</strong> {activeTab} | <strong>카테고리:</strong> {activeCategory}
            </p>

            {/* 지역 버튼 */}
            <div className="tabs">
                {["정문", "후문", "미뒷"].map((location) => (
                    <button
                        key={location}
                        className={`tab-button ${activeTab === location ? "active" : ""}`}
                        onClick={() => handleTabChange(location)}
                    >
                        {location}
                    </button>
                ))}
            </div>

            {/* 카테고리 버튼 */}
            <div className="category-buttons">
                {["일식", "양식", "중식", "카페"].map((category) => (
                    <button
                        key={category}
                        className={`category-button ${activeCategory === category ? "active" : ""}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 지도와 리스트 */}
            <KakaoMap restaurants={restaurants} />

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={index === page ? "active" : ""}
                        onClick={() => handlePageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {isLoading && <p>로딩 중...</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default SearchPage;
