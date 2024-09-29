from flask import Flask, request, jsonify, send_from_directory,render_template
import os
import json
from shapely.geometry import Polygon, Point
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
        'New York', 'Philadelphia', 'Boston', 'Baltimore', 'Washington DC',
        'Newark', 'Jersey City', 'Providence', 'Hartford', 'Stamford',
        'Wilmington', 'Trenton', 'Alexandria', 'Richmond', 'Virginia Beach'
    ]
}


@app.route('/')
def serve_index():
    return render_template('index_copy.html')

@app.route('/switchpage')
def switch_page():
    return render_template('index.html')

@app.route('/script.js')
def serve_script():
    return send_from_directory('../frontend', 'script.js')

@app.route('/style.css')
def serve_style():
    return send_from_directory('../frontend', 'style.css')

@app.route('/api/cities', methods=['POST'])
def get_cities():
    # 假设 city_names 是从前端发送过来的
    # city_names = cities_data['city']
    data = request.get_json()
    print(data)
    city_names = data.get('city')
    # 读取 output.json 文件
    try:
        with open('counties.json') as f:
            data = json.load(f)
    except Exception as e:
        return jsonify({"error": "无法读取数据文件"}), 500

    # 收集所有城市的圆形（以城市中心为基础，半径为80公里）
    city_circles = []
    radius_in_degrees = 80 / 111  # 80公里转换为地理坐标中的度数，1度约为111公里

    for feature in data:
        if feature["NAME"] in city_names:
            coordinates = feature["coordinates"]

            # 如果坐标是多边形，使用Polygon计算质心
            polygon = Polygon(coordinates)
            city_center = polygon.centroid  # 计算多边形的质心

            # 使用质心创建圆形
            city_circle = city_center.buffer(radius_in_degrees)  # 创建半径为80公里的圆
            city_circles.append(city_circle)

    # 合并所有圆形
    if city_circles:
        merged_area = unary_union(city_circles)

        # 返回合并后的区域为 GeoJSON 格式
        return jsonify({
            "type": "Feature",
            "geometry": merged_area.__geo_interface__  # 转换为GeoJSON格式
        })
    else:
        return jsonify({"error": "没有找到有效的城市"}), 404



@app.route('/process', methods=['POST'])
def process():
    global updated_data
    data = request.get_json()
    temp = data.get('temperatureControl', 0) + 1
    trees = data.get('treeControl', 0) + 1
    percps = data.get('cloudControl', 0) + 1
    city_name = ['Philadelphia']
    updated_data = city_name #{'a': temp, 'b': trees, 'c': percps}
    print(updated_data)
    return city_name

@app.route('/get-updated-values', methods=['GET'])
def get_updated_values():
    return updated_data

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8001)
