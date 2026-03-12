from flask import Flask, request, render_template_string, send_file, abort
import os, zipfile, uuid, json

app = Flask(__name__)

# Загружаем mapping.json
with open("mapping.json", "r", encoding="utf-8") as f:
    mapping = json.load(f)

WORKS_DIR = "works"

# Шаблон HTML страницы
PAGE_HTML = """
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Помощник компонентов</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f9f9f9; display:flex; justify-content:center; align-items:center; height:100vh; }
    .container { background:white; padding:30px; border-radius:12px; box-shadow:0 0 15px rgba(0,0,0,0.1); width:400px; text-align:center; }
    input { width:90%; padding:10px; margin-bottom:15px; border:1px solid #ccc; border-radius:8px; }
    button { background:#007BFF; color:white; padding:10px 20px; border:none; border-radius:8px; cursor:pointer; }
    button:hover { background:#0056b3; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Помощник компонентов</h2>
    <form method="post" action="/generate">
      <input type="text" name="url" placeholder="Вставьте ссылку..." required>
      <br>
      <button type="submit">Скачать архив</button>
    </form>
  </div>
</body>
</html>
"""

@app.route("/", methods=["GET"])
def index():
    return render_template_string(PAGE_HTML)

@app.route("/generate", methods=["POST"])
def generate():
    url = request.form.get("url")
    if not url:
        return "Не указана ссылка", 400

    url = url.rstrip("/")

    # ----- 1) Ссылка вида https://megagroup.shop/addon/535 -----
    if "/addon/" in url:
        work_id = url.split("/addon/")[-1]

    # ----- 2) Ссылка вида https://demo.megagroup.shop/sample/05/35 -----
    elif "/sample/" in url:
        parts = url.split("/sample/")[-1].split("/")
        # Склеиваем части: 05 + 35 = 0535, потом убираем ведущий ноль
        work_id = "".join(parts).lstrip("0")

    else:
        return "Неизвестный формат ссылки", 400

    # Проверяем ID
    if work_id not in mapping:
        return f"Работа с ID {work_id} не найдена в базе", 404

    work_folder = os.path.join(WORKS_DIR, mapping[work_id])
    if not os.path.exists(work_folder):
        return "Файлы работы отсутствуют", 404

    # Создаём временный архив
    uid = str(uuid.uuid4())
    zip_path = f"temp_{uid}.zip"
    with zipfile.ZipFile(zip_path, "w") as zf:
        for root, _, files in os.walk(work_folder):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, work_folder)
                zf.write(abs_path, arcname=rel_path)

    return send_file(zip_path, as_attachment=True, download_name=f"{mapping[work_id]}.zip")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
