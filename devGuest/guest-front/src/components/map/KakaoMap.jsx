import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    const kakaoMapScript = document.createElement('script');
    kakaoMapScript.async = true;
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
    document.head.appendChild(kakaoMapScript);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.506502, 127.053617), // 호텔 위치 (임의 지정)
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const markerPosition  = new window.kakao.maps.LatLng(37.506502, 127.053617);
        const marker = new window.kakao.maps.Marker({
            position: markerPosition
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
      });
    }

    kakaoMapScript.addEventListener('load', onLoadKakaoAPI);

    return () => {
        kakaoMapScript.removeEventListener('load', onLoadKakaoAPI);
        document.head.removeChild(kakaoMapScript);
    }
  }, []);

  return (
    <div id="map" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
  );
};

export default KakaoMap;
