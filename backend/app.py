from flask import Flask, request, jsonify,send_from_directory, render_template
import os

cur_dir = os.getcwd()
helper_dir = os.path.abspath(os.path.join(cur_dir, '..'))
print(helper_dir)

app = Flask(__name__,
            static_folder='../frontend',
            template_folder='../frontend')

# 模拟城市数据（马里兰州）
cities_data = {
    'city': ['Baltimore', 'Annapolis', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie', 'Hagerstown', 'Salisbury', 'Laurel'],
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
    data = request.get_json()

    return jsonify(cities_data)


@app.route('/process', methods=['POST'])
def process():
    global updated_data
    data = request.get_json()
    temp = data.get('temperatureControl', 0) + 1
    trees = data.get('treeControl', 0) + 1
    percps = data.get('cloudControl', 0) + 1
    updated_data = {'a': temp, 'b': trees, 'c': percps}
    return jsonify(updated_data)

@app.route('/get-updated-values', methods=['GET'])
def get_updated_values():
    return jsonify(updated_data)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8001)
