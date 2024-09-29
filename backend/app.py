from flask import Flask, request, jsonify,send_from_directory
import os

cur_dir = os.getcwd()
helper_dir = os.path.abspath(os.path.join(cur_dir, '..'))
print(helper_dir)

app = Flask(__name__,
            static_folder='../frontend',
            template_folder='../frontend')

# 模拟城市数据（马里兰州）
cities_data = {
    'maryland': ['Baltimore', 'Annapolis', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Salisbury', 'Laurel'],
    'baltimore': ['Baltimore', 'Baltimore City'],
    'annapolis': ['Annapolis', 'Annapolis City'],
    'frederick': ['Frederick', 'Frederick City'],
    'rockville': ['Rockville', 'Rockville City'],
    'gaithersburg': ['Gaithersburg', 'Gaithersburg City'],
    'bowie': ['Bowie', 'Bowie City'],
    'hagerstown': ['Hagerstown', 'Hagerstown City'],
    'salisbury': ['Salisbury', 'Salisbury City'],
    'laurel': ['Laurel', 'Laurel City'],
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
    data = request.get_json()
    city_name = data.get('city').lower()

    # 根据传入的城市名找到匹配的城市列表
    matched_cities = cities_data.get(city_name, [])

    return jsonify(matched_cities)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
