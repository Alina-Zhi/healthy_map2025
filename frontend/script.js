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
    highlightCity(cityName);
});

// 监听回车键事件
document.getElementById('cityInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const cityName = document.getElementById('cityInput').value;
        highlightCity(cityName);
    }
});

// 将城市名称发送到后端并接收城市列表
async function sendCityToBackend(cityName) {
    try {
        const response = await fetch('/api/cities', {  // 假设后端的路由是 /api/cities
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: cityName })
        });

        if (response.ok) {
            const cities = await response.json(); // 接收返回的城市列表
            highlightCities(cities); // 高亮显示城市
        } else {
            console.error('发送到后端时发生错误');
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

// 高亮多个城市
function highlightCities(cities) {
    // 清除之前的高亮
    map.eachLayer(layer => {
        if (layer instanceof L.GeoJSON) {
            map.removeLayer(layer);
        }
    });

    cities.forEach(city => {
        const cityGeoJson = city.geojson;

        // 高亮城市边界
        L.geoJSON(cityGeoJson, {
            style: {
                color: 'blue',
                weight: 2,
                fillColor: 'lightblue',
                fillOpacity: 0.5
            }
        }).addTo(map);
    });
}
