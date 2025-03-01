from flask import Flask, request, jsonify, render_template
import ollama

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"response": "Please provide a message."})

    response = ollama.chat(model="mistral", messages=[{"role": "user", "content": user_input}])

    tutor_response = response["message"]["content"] if "message" in response else "Sorry, I couldn't process that."

    return jsonify({"response": tutor_response})

if __name__ == "__main__":
    app.run(debug=True)
