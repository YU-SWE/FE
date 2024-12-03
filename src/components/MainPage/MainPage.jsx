import React, { Component } from 'react';
import { useState } from 'react';
import axios from 'axios';
import './MainPage.css';

// 음식 카테고리와 상태 키 매핑
const foodTags = {
    "일식": "restaurantsJapanese",
    "중식": "restaurantsChinese",
    "양식": "restaurantsWestern",
    "카페": "restaurantsCafeBakery",
};

class MainPage extends Component {
    state = {
        restaurantsJapanese: [],
        restaurantsChinese: [],
        restaurantsWestern: [],
        restaurantsCafeBakery: [],
        pageIndex: {
            restaurantsJapanese: 0,
            restaurantsChinese: 0,
            restaurantsWestern: 0,
            restaurantsCafeBakery: 0,
        },
        isModalOpen: false,
        selectedLocation: "영대 정문",
        isFetching: false,
        error: null,
        isDarkMode: false, // 다크 모드 상태 추가
    };

    componentDidMount() {
        const savedLocation = localStorage.getItem("selectedLocation") || "영대 정문";
        const savedDarkMode = localStorage.getItem("darkMode") === "true"; // 로컬 스토리지에서 다크 모드 불러오기
        this.setState({ 
            selectedLocation: savedLocation,
            isDarkMode: savedDarkMode,
        }, this.fetchRestaurantsByLocation);
        document.body.classList.toggle("dark", savedDarkMode); // 다크 모드 초기화
    }

    handleLocationChange = (location) => {
        localStorage.setItem('selectedLocation', location);
        this.setState({ selectedLocation: location }, () => {
            this.fetchRestaurantsByLocation();
            this.closeModal();
        });
    };
    toggleDarkMode = () => {
        this.setState((prevState) => {
            const newMode = !prevState.isDarkMode;
            localStorage.setItem("darkMode", newMode); // 다크 모드 상태 저장
            document.body.classList.toggle("dark", newMode); // body 클래스 변경
            return { isDarkMode: newMode };
        });
    };

    parseRequiredData = (rawString) => {
        const keyRegex = /"(\w+)":\s*("[^"]*"|\d+(\.\d+)?)/g;
        const keysToExtract = ["rid", "rname", "rstar", "addr", "image1"];
        const parsedData = {};
        let match;

        while ((match = keyRegex.exec(rawString)) !== null) {
            const key = match[1];
            let value = match[2].replace(/"/g, ""); // 값에서 따옴표 제거

            // 숫자 또는 소수인 경우 변환
            if (!isNaN(value)) value = Number(value);

            if (keysToExtract.includes(key)) {
                parsedData[key] = value;
            }
        }
        return parsedData;
    };

    fetchRestaurantsByLocation = () => {
        if (this.state.isFetching) return;

        this.setState({ isFetching: true, error: null });
        const { selectedLocation } = this.state;

        const promises = Object.entries(foodTags).map(([tag, stateKey]) => {
            const encodedTag = encodeURIComponent(tag);
            const encodedLocation = encodeURIComponent(selectedLocation);

            const apiUrl = `http://localhost:8080/api/yufood/category/${encodedTag}/location/${encodedLocation}`;

            return axios
                .get(apiUrl)
                .then((response) => {
                    const rawData = response.data;
                    console.log(response.data);
                    if (Array.isArray(rawData)) {
                        // JSON 배열 처리
                        const parsedEntries = rawData.map((entry) => ({
                            rid: entry.rid,
                            rname: entry.rname,
                            rstar: entry.rstar || 0,
                            addr: entry.addr,
                            image1: entry.image1 || "https://via.placeholder.com/150",
                        }));
                        this.setState({ [stateKey]: parsedEntries });
                    } else if (typeof rawData === "string") {
                        // JSON 문자열 처리
                        const rawEntries = rawData.match(/\{.*?\}/g);
                        console.log("sex : " + rawEntries);
                        if (rawEntries) {
                            const parsedEntries = rawEntries.map((entry) =>
                                this.parseRequiredData(entry)
                            );
                            console.log(`${tag} 데이터:`, parsedEntries);
                            this.setState({ [stateKey]: parsedEntries });
                        } else {
                            console.error(`JSON 데이터 추출 실패: ${rawData}`);
                            this.setState({ [stateKey]: [] });
                        }
                    } else {
                        console.error("예상하지 못한 API 응답 형식:", rawData);
                        this.setState({ [stateKey]: [] });
                    }
                })
                .catch((error) => {
                    console.error(`API 요청 실패: ${apiUrl}`, error);
                    this.setState({ [stateKey]: [] });
                });
        });

        Promise.all(promises)
            .catch(() => {
                this.setState({ error: "데이터를 가져오는 중 오류가 발생했습니다." });
            })
            .finally(() => {
                this.setState({ isFetching: false });
            });
    };


    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleMoreButtonClick = (category, location) => {
        const encodedCategory = encodeURIComponent(category);
        const encodedLocation = encodeURIComponent(location);
        window.location.href = `/more?category=${encodedCategory}&location=${encodedLocation}`;
    };

    renderCategorySection = (categoryName, restaurants, stateKey) => {
        const { pageIndex, isFetching } = this.state;
        const itemsPerPage = 5;
        const currentPage = pageIndex[stateKey];
        const startIndex = currentPage * itemsPerPage;

        const visibleRestaurants = restaurants
            .slice(startIndex, startIndex + itemsPerPage)
            .filter((restaurant) => restaurant.rname && restaurant.addr); // rname과 addr이 있는 항목만 렌더링

        return (
            <section className="Section">
                <button
                    className="Section_Button"
                    onClick={() =>
                        this.setState((prevState) => ({
                            pageIndex: {
                                ...prevState.pageIndex,
                                [stateKey]: Math.max(prevState.pageIndex[stateKey] - 1, 0),
                            },
                        }))
                    }
                    disabled={currentPage === 0}
                >
                    ◀️
                </button>
                <div className="Section_Wrap">
                    <div className="Section_Title">
                        <h2 className="Title_Name">#{categoryName}</h2>
                        <button
                            className="More_button"
                            onClick={() => this.handleMoreButtonClick(categoryName, this.state.selectedLocation)}
                        >
                            더 보기
                        </button>
                    </div>
                    <span className="Line"></span>
                    <div className="Section_Slide">
                        <ul className="Restaurant_Card_List">
                            {isFetching ? (
                                <p>데이터를 불러오는 중...</p>
                            ) : visibleRestaurants.length > 0 ? (
                                visibleRestaurants.map((restaurant, index) => (
                                    <li className="Restaurant_Card" key={index}>
                                        <a
                                            href={`http://localhost:3000/restaurant/${restaurant.rid}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={restaurant.image1 || "https://via.placeholder.com/150"}
                                                alt={restaurant.rname || "이미지 없음"}
                                                className="Restaurant_Image"
                                            />
                                            <div className="Restaurant_Info">
                                                <h3 className="Restaurant_Name">{restaurant.rname || "이름 없음"}</h3>
                                                <p className="Restaurant_Address">{restaurant.addr || "주소 없음"}</p>
                                                <p className="Restaurant_Rating">⭐ {restaurant.rstar ? restaurant.rstar.toFixed(1) : "0.0"}</p>
                                            </div>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p>식당 정보를 불러올 수 없습니다.</p>
                            )}
                        </ul>
                    </div>
                </div>
                <button
                    className="Section_Button"
                    onClick={() =>
                        this.setState((prevState) => ({
                            pageIndex: {
                                ...prevState.pageIndex,
                                [stateKey]: prevState.pageIndex[stateKey] + 1,
                            },
                        }))
                    }
                    disabled={startIndex + itemsPerPage >= restaurants.length}
                >
                    ▶️
                </button>
            </section>
        );
    };

    render() {
        const {
            restaurantsJapanese,
            restaurantsChinese,
            restaurantsWestern,
            restaurantsCafeBakery,
            isModalOpen,
            isDarkMode,
        } = this.state;
        return (
            <div className="Container">
                <div className="Choice_Location">
                    <div className="Location_text">
                        <div className="text1">당신을 위한</div>
                        <span className="weight_font">영남대 </span>
                        <span>맛집 추천</span>
                    </div>
                    <div className="Location_button">
                        <button className="button1" onClick={this.openModal}>
                            위치 선택
                        </button>
                    </div>
                </div>
                <main className="Content">
                    <div className="BodyBox">
                        {this.renderCategorySection("일식", restaurantsJapanese, "restaurantsJapanese")}
                        {this.renderCategorySection("중식", restaurantsChinese, "restaurantsChinese")}
                        {this.renderCategorySection("양식", restaurantsWestern, "restaurantsWestern")}
                        {this.renderCategorySection("카페", restaurantsCafeBakery, "restaurantsCafeBakery")}
                    </div>
                </main>
                {isModalOpen && (
                    <div className="modal" onClick={this.closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={this.closeModal}>
                                &times;
                            </span>
                            <h3>위치를 선택하세요:</h3>
                            <button className="LocationChoiceButton" onClick={() => this.handleLocationChange("정문")}>
                                영대 정문
                            </button>
                            <button className="LocationChoiceButton" onClick={() => this.handleLocationChange("후문")}>
                                영대 후문
                            </button>
                            <button className="LocationChoiceButton" onClick={() => this.handleLocationChange("미뒷")}>
                                미대 뒷길
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default MainPage;
