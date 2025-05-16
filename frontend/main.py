import tkinter as tk
from tkinter import filedialog
import requests

def predict_image():
    filepath = filedialog.askopenfilename()
    if not filepath:
        return

    response = requests.post(
        "http://127.0.0.1:8000/predict/",
        files={"image": open(filepath, "rb")}
    )

    data = response.json()
    label = data["label"]
    solution = data["solution"]
    confidence = data["confidence"]

    result_label.config(text=f"Disease: {label}\nConfidence: {confidence:.2f}%\nSolution: {solution}")

# GUI
root = tk.Tk()
root.title("Plant Disease Predictor")

tk.Button(root, text="Upload Image", command=predict_image).pack(pady=10)
result_label = tk.Label(root, text="", wraplength=400, justify="left")
result_label.pack(pady=10)

root.mainloop()
