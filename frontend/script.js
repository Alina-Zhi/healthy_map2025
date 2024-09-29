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

// 高亮城市
async function highlightCity(city) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json&polygon_geojson=1`);
    const data = await response.json();
    
    if (data.length > 0) {
        const cityGeoJson = data[0].geojson;

        // 清除之前的高亮
        map.eachLayer(layer => {
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        // 添加城市边界
        L.geoJSON(cityGeoJson, {
            style: {
                color: 'blue',
                weight: 2,
                fillColor: 'lightblue',
                fillOpacity: 0.5
            }
        }).addTo(map);
        
        // 使地图聚焦于该城市
        const bounds = L.geoJSON(cityGeoJson).getBounds();
        map.panTo(bounds.getCenter()); 
    } else {
        alert('Error!');
    }
}
