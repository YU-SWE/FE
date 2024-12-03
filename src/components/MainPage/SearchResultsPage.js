import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchResultsPage.css";
const { kakao } = window;

const SearchResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const initialQuery = params.get("query") || "";

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [sortedResults, setSortedResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [sortType, setSortType] = useState("rating");
    const [currentPosition, setCurrentPosition] = useState(null);
    const itemsPerPage = 20; // 한 페이지에 표시할 데이터 수

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newQuery = params.get("query") || "";
        const newPage = Number(params.get("page")) || 0;

        if (query !== newQuery) {
            setQuery(newQuery);
            setPage(0); // 새 검색어 입력 시 페이지 번호 초기화
        } else {
            setPage(newPage);
        }
    }, [location.search]);

    useEffect(() => {
        fetchSearchResults(page);
        navigate(`/search?query=${encodeURIComponent(query)}&page=${page}`);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.error("Error fetching location:", error)
        );
    }, [query, page]);

    const fetchSearchResults = async (currentPage = 0) => {
        setIsLoading(true);
        setError(null);

        try {
            const url = `http://localhost:8080/api/yufood/search?query=${encodeURIComponent(query)}&page=${currentPage}&size=${itemsPerPage}`;
            const response = await axios.get(url);

            let data;

            if (typeof response.data === "string") {
                const cleanedData = response.data.split("}{")[0] + "}";
                try {
                    data = JSON.parse(cleanedData);
                } catch (error) {
                    console.error("Error parsing cleaned response:", error);
                    throw new Error("JSON parsing failed after cleaning.");
                }
            } else {
                data = response.data;
            }

            if (data && data.content) {
                const rawData = data.content;
                const parsedEntries = rawData.map((entry) => ({
                    rid: entry.rid,
                    rname: entry.rname,
                    rstar: entry.rstar || 0,
                    addr: entry.addr,
                    image1: entry.image1 || "https://via.placeholder.com/150",
                }));

                setResults(parsedEntries);
                setSortedResults(parsedEntries);
                setTotalPages(data.totalPages || 1);
            } else {
                console.error("Unexpected response format:", data);
                setResults([]);
            }
        } catch (err) {
            console.error("Error fetching search results:", err.message);
            setError("검색 결과를 불러오지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const sortByRating = () => {
        const sorted = [...results].sort((a, b) => b.rstar - a.rstar);
        setSortedResults(sorted);
        setSortType("rating");
    };

    const sortByDistance = async () => {
        if (!currentPosition) {
            alert("현재 위치를 가져올 수 없습니다.");
            return;
        }

        try {
            const sorted = await Promise.all(
                results.map(async (result) => {
                    const coordinates = await getCoordinates(result.addr);
                    if (!coordinates) {
                        return { ...result, distance: Infinity }; // 좌표를 가져오지 못한 경우
                    }
                    const distance = calculateDistance(currentPosition, coordinates);
                    return { ...result, distance };
                })
            );

            sorted.sort((a, b) => a.distance - b.distance); // 거리순으로 정렬
            setSortedResults(sorted);
            setSortType("distance");
        } catch (error) {
            console.error("Error sorting by distance:", error);
        }
    };

    const getCoordinates = (address) => {
        return new Promise((resolve, reject) => {
            const geocoder = new kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    resolve({
                        latitude: parseFloat(result[0].y),
                        longitude: parseFloat(result[0].x),
                    });
                } else {
                    console.warn(`Failed to get coordinates for address: ${address}`);
                    resolve(null);
                }
            });
        });
    };

    const calculateDistance = (pos1, pos2) => {
        const R = 6371; // 지구 반지름 (km)
        const dLat = (pos2.latitude - pos1.latitude) * (Math.PI / 180);
        const dLon = (pos2.longitude - pos1.longitude) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(pos1.latitude * (Math.PI / 180)) *
            Math.cos(pos2.latitude * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // 거리(km)
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="search-results-container">
            <h1>"{query}" 검색결과</h1>

            <div className="sort-buttons">
                <button
                    className={`sort-button ${sortType === "rating" ? "active" : ""}`}
                    onClick={sortByRating}
                >
                    별점순
                </button>
                <button
                    className={`sort-button ${sortType === "distance" ? "active" : ""}`}
                    onClick={sortByDistance}
                >
                    거리순
                </button>
            </div>

            {isLoading ? (
                <p>로딩 중...</p>
            ) : sortedResults.length > 0 ? (
                <>
                    <div className="results-grid">
                        {sortedResults.map((result, index) => (
                            <div className="result-card" key={`${result.rid}-${index}`}>
                                <a href={`http://localhost:3000/restaurant/${result.rid}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                        src={result.image1 || "/default-image.jpg"}
                                        alt={result.rname}
                                        className="result-image"
                                    />
                                    <div className="result-info">
                                        <h3 className="result-name">{result.rname}</h3>
                                        <p className="result-address">{result.addr}</p>
                                        <p className="result-rating">⭐ {result.rstar.toFixed(1)}</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            이전
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={index === page ? "active" : ""}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            다음
                        </button>
                    </div>
                </>
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}

            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default SearchResultsPage;
