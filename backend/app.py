from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# ✅ NVIDIA client
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="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"
)

# ✅ AI function (NO streaming)
def get_ai_response(user_input):
    try:
        completion = client.chat.completions.create(
            model="minimaxai/minimax-m2.7",
            messages=[
                {
                    "role": "user",
                    "content": f"""
A user describes symptoms: {user_input}

Give:
1. Possible condition
2. Risk level (Low/Medium/High)
3. Advice

Keep it short.
"""
                }
            ],
            temperature=0.7,
            top_p=0.9,
            max_tokens=300,
            stream=False  # ❗ IMPORTANT
        )

        return completion.choices[0].message.content

    except Exception as e:
        print("AI Error:", e)
        return "Possible Condition: Unknown\nRisk: Medium\nAdvice: Consult a doctor."


@app.route("/analyze-the-symptons", methods=['POST'])
def first_page():
    data = request.get_json()
    user_input = data["message"]

    result = get_ai_response(user_input)
    print(result)

    return jsonify({
        "response": result
    }), 200


if __name__ == "__main__":
    app.run(debug=True)