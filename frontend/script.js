const map = L.map('map', {
    center: [39.9042, -76.4074],  // 北京的坐标
    zoom: 5,                       // 初始缩放级别
    minZoom: 5,                   // 最小缩放级别
    maxZoom: 18,                  // 最大缩放级别
    worldCopyJump: true           // 启用世界复制跳跃，防止地图重复
});

// 使用 CartoDB Positron 地图样式
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

// 处理城市输入并高亮显示
document.getElementById('highlightBtn').addEventListener('click', () => {
    const cityName = document.getElementById('cityInput').value;
    sendCityToBackend(cityName);
});

// 监听回车键事件
document.getElementById('cityInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = document.getElementById('cityInput').value;
        sendCityToBackend(cityName);
    }
});

// 将城市名称发送到后端并接收城市列表
async function sendCityToBackend(cityName) {
    console.log("[!] get into function");
    try {
        const response = await fetch('/api/cities', {  // 假设后端的路由是 /api/cities
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: cityName })
        });

        if (response.ok) {
            console.log("[!] response ok");
            const cities = await response.json(); // 接收返回的城市列表
            await highlightCities(cities); // 高亮显示城市
            console.log("[!] out")
        } else {
            console.error('发送到后端时发生错误');
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function highlightCities(cities) {
    // 清除之前的高亮
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON || layer instanceof L.Circle || layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });

    // 使用后端返回的GeoJSON数据进行高亮
    L.geoJSON(cities, {
        style: {
            color: 'blue',
            weight: 2,
            fillColor: 'lightblue',
            fillOpacity: 0.5
        }
    }).addTo(map);
}



//async function highlightCities(cities) {
//    const cityList = cities.city;  // 从返回对象中提取 'city' 数组
//    const points = [];  // 存储城市中心点
//
//    // 清除之前的高亮
//    map.eachLayer(layer => {
//        if (layer instanceof L.GeoJSON || layer instanceof L.Circle || layer instanceof L.Polygon) {
//            map.removeLayer(layer);
//        }
//    });
//
//    // 并行处理所有请求
//    const promises = cityList.map(async (city) => {
//        try {
//            const city_response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
//            const data = await city_response.json();
//
//            if (data && data[0]) {
//                const lat = parseFloat(data[0].lat); // 确保获取的是数字
//                const lon = parseFloat(data[0].lon); // 确保获取的是数字
//
//                // 确保lat和lon是有效数字
//                if (!isNaN(lat) && !isNaN(lon)) {
//                    points.push([lon, lat]);  // 将城市中心点添加到数组中
//                } else {
//                    console.error(`无效的坐标: ${lat}, ${lon}`);
//                }
//            }
//        } catch (error) {
//            console.error(`获取城市 ${city} 的数据时发生错误`, error);
//        }
//    });
//
//    // 等待所有请求完成
//    await Promise.all(promises);
//
//    // 如果有点，则创建一个多边形
//    if (points.length > 0) {
//        const radiusInKm = 80;
//
//        // 创建缓冲区
//        const bufferedPolygons = points.map(point =>
//            turf.buffer(turf.point(point), radiusInKm, { units: 'kilometers' })
//        );
//
//        // 合并所有的缓冲区
//        const merged = turf.union(...bufferedPolygons);
//
//        // 将合并后的多边形添加到地图
//        L.geoJSON(merged.geometry, {
//            style: {
//                color: 'blue',
//                weight: 2,
//                fillColor: 'lightblue',
//                fillOpacity: 0.5
//            }
//        }).addTo(map);
//    }
//}






