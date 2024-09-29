from flask import Flask, request, jsonify, send_from_directory
import os
import json
from shapely.geometry import Polygon, MultiPolygon
from shapely.ops import unary_union

cur_dir = os.getcwd()
helper_dir = os.path.abspath(os.path.join(cur_dir, '..'))
print(helper_dir)

app = Flask(__name__,
            static_folder='../frontend',
            template_folder='../frontend')

# 模拟城市数据（马里兰州）
cities_data = {
    'city': [
        'New York',       # 纽约
        'Philadelphia',   # 费城
        'Boston',         # 波士顿
        'Baltimore',      # 巴尔的摩
        'Washington DC',  # 华盛顿特区
        'Newark',         # 纽瓦克
        'Jersey City',    # 泽西市
        'Providence',     # 普罗维登斯
        'Hartford',       # 哈特福德
        'Stamford',       # 斯坦福
        'Wilmington',     # 威尔明顿
        'Trenton',        # 特伦顿
        'Alexandria',     # 亚历山德里亚
        'Richmond',       # 里士满
        'Virginia Beach'  # 弗吉尼亚海滩
    ]
}



@app.route('/')
def serve_index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/script.js')
def serve_script():
    return send_from_directory('../frontend', 'script.js')

@app.route('/style.css')
def serve_style():
    return send_from_directory('../frontend', 'style.css')

@app.route('/api/cities', methods=['POST'])
def get_cities():
    # 假设 city_names 是从前端发送过来的
    city_names = cities_data['city']

    # 读取 output.json 文件
    try:
        with open('output.json') as f:
            data = json.load(f)
            print("成功读取 output.json")
    except Exception as e:
        print(f"读取 output.json 时发生错误: {e}")
        return jsonify({"error": "无法读取数据文件"}), 500

    # 收集所有城市的多边形
    polygons = []
    for feature in data:
        if feature["NAME"] in city_names:
            coordinates = feature["coordinates"]
            print(f"城市 {feature['NAME']} 的坐标: {coordinates}")

            # 创建城市的多边形
            polygon = Polygon(coordinates)
            polygons.append(polygon)

    # 合并所有城市的多边形成一个 MultiPolygon
    if polygons:
        merged_polygons = unary_union(polygons)  # 合并多边形

        # 返回合并后的多边形 GeoJSON
        return jsonify({
            "type": "Feature",
            "geometry": merged_polygons.__geo_interface__  # 转换为GeoJSON格式
        })
    else:
        return jsonify({"error": "No valid polygons found."}), 404



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8001)
