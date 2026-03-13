from flask import Flask, request, render_template_string, send_file
import os
import zipfile
import json
import io

app = Flask(__name__)

# Загружаем mapping.json
with open("mapping.json", "r", encoding="utf-8") as f:
    mapping = json.load(f)

WORKS_DIR = "works"

PAGE_HTML = """
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Помощник компонентов</title>

<style>
body {
    font-family: Arial, sans-serif;
    background:#f9f9f9;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.container {
    background:white;
    padding:30px;
    border-radius:12px;
    box-shadow:0 0 15px rgba(0,0,0,0.1);
    width:420px;
    text-align:center;
}

input, select {
    width:95%;
    padding:10px;
    margin-bottom:15px;
    border:1px solid #ccc;
    border-radius:8px;
}

button {
    background:#007BFF;
    color:white;
    padding:10px 20px;
    border:none;
    border-radius:8px;
    cursor:pointer;
}

button:hover {
    background:#0056b3;
}
</style>

<script>
function selectWork() {
    let select = document.getElementById("workSelect");
    let input = document.getElementById("urlInput");

    let workId = select.value;

    if(workId){
        input.value = "https://megagroup.shop/addon/" + workId;
    }
}
</script>

</head>

<body>

<div class="container">

<h2>Помощник компонентов</h2>

<form method="post" action="/generate">

<input id="urlInput" type="text" name="url" placeholder="Вставьте ссылку..." required>

<select id="workSelect" onchange="selectWork()">
<option value="">Выберите работу...</option>

{% for work_id, name in mapping.items() %}
<option value="{{work_id}}">{{work_id}} — {{name}}</option>
{% endfor %}

</select>

<br>

<button type="submit">Скачать архив</button>

</form>

</div>

</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(PAGE_HTML, mapping=mapping)


@app.route("/generate", methods=["POST"])
def generate():

    url = request.form.get("url")

    if not url:
        return "Не указана ссылка", 400

    url = url.rstrip("/")

    if "/addon/" in url:
        work_id = url.split("/addon/")[-1]

    elif "/sample/" in url:
        parts = url.split("/sample/")[-1].split("/")
        work_id = "".join(parts).lstrip("0")

    else:
        return "Неизвестный формат ссылки", 400

    if work_id not in mapping:
        return f"Работа {work_id} не найдена", 404

    work_folder = os.path.join(WORKS_DIR, mapping[work_id])

    if not os.path.exists(work_folder):
        return "Файлы отсутствуют", 404

    memory_file = io.BytesIO()

    with zipfile.ZipFile(memory_file, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _, files in os.walk(work_folder):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, work_folder)
                zf.write(abs_path, arcname=rel_path)

    memory_file.seek(0)

    return send_file(
        memory_file,
        as_attachment=True,
        download_name=f"{mapping[work_id]}.zip",
        mimetype="application/zip"
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)