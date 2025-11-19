import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

// 가짜 데이터용 껍데기 import
import { db } from '../../services/firebase'; 

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null); 
  const [users, setUsers] = useState([]);         
  const [loading, setLoading] = useState(true);

  // ▼ [핵심 기능] 내 위치(lat, lon)를 기준으로 주변에 랜덤 유저 생성
  const generateNearbyUsers = (lat, lon) => {
    const styles = ['스트릿', '미니멀', '아메카지', '빈티지', '스포티'];
    const names = ['패션왕', '홍대피플', '성수동힙스터', '판교개발자', '강남언니'];

    return Array.from({ length: 5 }).map((_, i) => ({
      id: `user_${i}`,
      nickname: names[i % names.length],
      style: styles[i % styles.length],
      // 내 위치에서 아주 약간 떨어진 곳(-0.002 ~ +0.002)에 배치
      latitude: lat + (Math.random() - 0.5) * 0.005,
      longitude: lon + (Math.random() - 0.5) * 0.005,
    }));
  };

  useEffect(() => {
    (async () => {
      try {
        // 1. 위치 권한 요청
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('알림', '위치 권한이 없어 서울 시청을 보여줍니다.');
          // 권한 없으면 서울 시청 기준
          const defaultLat = 37.5665;
          const defaultLon = 126.9780;
          setLocation({ latitude: defaultLat, longitude: defaultLon });
          setUsers(generateNearbyUsers(defaultLat, defaultLon));
          setLoading(false);
          return;
        }

        // 2. 현재 내 위치 가져오기
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        console.log(`내 위치: ${latitude}, ${longitude}`);
        
        // 3. 상태 업데이트 및 주변 유저 생성
        setLocation({ latitude, longitude });
        setUsers(generateNearbyUsers(latitude, longitude));
        setLoading(false);

      } catch (error) {
        console.log("위치 에러:", error);
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 상태바 */}
      <View style={styles.headerOverlay}>
        <Text style={styles.headerText}>
          {loading ? "위치 찾는 중..." : `내 주변 ${users.length}명의 패션 피플 발견! 👀`}
        </Text>
      </View>

      <MapView
        style={styles.map}
        // 초기 로딩 지역 (내 위치가 있으면 거기로, 없으면 서울)
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01, // 숫자가 작을수록 확대됨
          longitudeDelta: 0.01,
        } : {
          latitude: 37.5665,
          longitude: 126.9780,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true} // 파란 점(내 위치) 표시
      >
        {/* 유저 마커 표시 */}
        {users.map((user) => (
          <Marker
            key={user.id}
            coordinate={{
              latitude: user.latitude,
              longitude: user.longitude,
            }}
            title={user.nickname}
            description={user.style}
          >
            {/* 마커 디자인 (이모지) */}
            <View style={styles.markerContainer}>
               <Text style={styles.markerText}>👕</Text>
            </View>
            
            {/* 마커 클릭 시 나오는 말풍선 */}
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.nickname}>{user.nickname}</Text>
                <Text style={styles.styleInfo}>스타일: {user.style}</Text>
                <Text style={styles.btnText}>클릭해서 보기</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  // 지도 위에 떠있는 헤더 스타일
  headerOverlay: {
    position: 'absolute',
    top: 50, // 상태바 아래쪽
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 1, // 지도보다 위에 뜨게 함
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#333',
  },
  markerText: {
    fontSize: 24,
  },
  callout: {
    padding: 5,
    alignItems: 'center',
    width: 120,
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  styleInfo: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  btnText: {
    color: 'blue',
    fontSize: 11,
  },
});