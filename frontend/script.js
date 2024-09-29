const map = L.map('map', {
    center: [39.9042, -76.4074],
    zoom: 6,                       // 初始缩放级别
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

    // 检查 cities 数据是否为有效的 GeoJSON
    if (cities && cities.type === "Feature" && cities.geometry) {
        const { geometry } = cities;

        // 处理 Polygon 或 MultiPolygon
        if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
            let coordinatesList = [];

            if (geometry.type === "Polygon") {
                // 如果是 Polygon，获取单个多边形的坐标
                coordinatesList = [geometry.coordinates[0]];
            } else if (geometry.type === "MultiPolygon") {
                // 如果是 MultiPolygon，遍历所有多边形
                coordinatesList = geometry.coordinates.map(polygon => polygon[0]);
            }

            // 遍历每个坐标集合，计算中心并绘制圆
            coordinatesList.forEach(coordinates => {
                // 将坐标转换为 LatLng 格式
                const latLng = coordinates.map(coord => L.latLng(coord[1], coord[0]));

                // 获取多边形的边界框
                const bounds = L.latLngBounds(latLng);

                // 获取多边形的中心点
                const center = bounds.getCenter();

                // 仅绘制圆，不绘制多边形
                L.circle(center, {
                    color: 'blue',
                    fillColor: 'lightblue',
                    fillOpacity: 0.5,
                    radius: 80000  // 半径为80公里（80000米）
                }).addTo(map);
            });
        } else {
            console.error("未识别的城市几何数据类型:", geometry.type);
        }
    } else {
        console.error("无效的城市数据或 GeoJSON 格式错误");
    }
}


