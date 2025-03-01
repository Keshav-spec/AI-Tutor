import ollama

def ai_tutor():
    print("Welcome to AI Tutor! Type 'exit' to quit.")
    
    while True:
        user_input = input("\nYou: ")
        if user_input.lower() == "exit":
            print("Goodbye!")
            break

        response = ollama.chat(model="mistral", messages=[{"role": "user", "content": user_input}])
        print("\nTutor:", response["message"]["content"])

ai_tutor()
