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

// 按键回到user input界面
document.getElementById('switchBtn').addEventListener('click', function () {
    window.location.href = '/';  // This will navigate back to index.html
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
            console.log("[!] highlight out")
           }
//          else {// Fetch the updated data from the backend
//            function fetchUpdatedData() {
//                fetch('/get-updated-values', {
//                    method: 'GET',
//                    headers: {
//                        'Content-Type': 'application/json'
//                    }
//                })
//                .then(response => response.json())
//                .then(result => {
//                    document.getElementById('result').textContent = `Updated values - Temp: ${result.a}, Tree: ${result.b}, Rain: ${result.c}`;
//                })
//                .catch(error => {
//                    console.error('Error:', error);
//                });
//            }
//
//            // Fetch data when the page loads
//            window.onload = fetchUpdatedData;
//            console.error('error passing to backend');
//        }
    } catch (error) {
        console.error('request error:', error);
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
        // 使用合并后的GeoJSON数据进行高亮
        L.geoJSON(cities, {
            style: {
                color: 'blue',
                weight: 2,
                fillColor: 'lightblue',
                fillOpacity: 0.5
            }
        }).addTo(map);
    } else {
        console.error("无效的城市数据或 GeoJSON 格式错误");
    }
}



// Fetch the updated data from the backend
function fetchUpdatedData() {
    fetch('/get-updated-values', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(result => {
          document.getElementById('result').textContent = `Cities:${result}`;
          console.log("[*] hi i am in");
          sendCityToBackend(result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Fetch data when the page loads
window.onload = fetchUpdatedData;