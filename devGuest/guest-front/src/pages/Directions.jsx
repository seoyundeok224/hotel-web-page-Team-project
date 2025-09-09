import React from 'react';
import KakaoMap from '../components/map/KakaoMap';

const Directions = () => {
    return (
        <div>
            <h1>오시는길</h1>
            <p>호텔로 오시는 길을 안내하는 페이지입니다.</p>
            <KakaoMap />
        </div>
    );
};

export default Directions;
