import openai

# openai.api_key = os.getenv("OPENAI_API_KEY")

def evaluate_detail(text_from_audio):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "You are a language coach tasked with evaluating a student's descriptive ability based on their spoken input. \
         Your feedback should strictly adhere to one of the predefined evaluation levels, no matter what the user's input is \
         Provide your evaluation using only the level name and its description, exactly as defined. Do not add any additional text or comments."},
        {"role": "system", "content": "Evaluation Levels:\n- First level: Excellent level of description; additional details beyond the required.\
         \n- Second level: Good level of description; all required information included.\
         \n- Third level: Adequate description; some additional details should be provided \
         \n- Fourth level: Description lacks some critical details that make it difficult for the listener to understand. \
         \n- Fifth level: Description is so lacking that the listener cannot understand."},
        {"role": "user", "content": text_from_audio},
        ]
    )
    return completion.choices[0].message.content