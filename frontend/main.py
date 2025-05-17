import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk
import requests
import io

API_URL = "http://127.0.0.1:8000/api/predict/"  # Change to your actual API endpoint

class DiseasePredictorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Crop Doctor")
        self.attributes('-fullscreen', True)
        self.bind("<Escape>", lambda e: self.attributes("-fullscreen", False))  # Press ESC to exit fullscreen

        self.resizable(False, False)
        self.configure(bg="#f5f7fa")

        self.selected_image_path = None
        self.selected_image_tk = None

        self.create_widgets()

    def create_widgets(self):
        # Title label
        title_label = ttk.Label(self, text="Plant Disease Prediction", font=("Helvetica", 20, "bold"))
        title_label.pack(pady=20)

        # Frame for image selection and preview
        img_frame = ttk.Frame(self)
        img_frame.pack(pady=10)

        self.img_label = ttk.Label(img_frame, text="No image selected", relief="solid", width=40, anchor="center")
        self.img_label.pack()

        select_btn = ttk.Button(self, text="Select Image", command=self.select_image)
        select_btn.pack(pady=10)

        # Predict button
        predict_btn = ttk.Button(self, text="Predict Disease", command=self.predict_disease)
        predict_btn.pack(pady=10)

        # Separator
        sep = ttk.Separator(self, orient='horizontal')
        sep.pack(fill='x', pady=15)

        # Result Frame
        self.result_frame = ttk.Frame(self)
        self.result_frame.pack(fill='both', expand=True, padx=20)

        # Result labels
        self.plant_label = ttk.Label(self.result_frame, text="", font=("Helvetica", 14, "bold"), foreground="#2c3e50")
        self.plant_label.pack(anchor="w", pady=5)

        self.disease_label = ttk.Label(self.result_frame, text="", font=("Helvetica", 14, "bold"), foreground="#c0392b")
        self.disease_label.pack(anchor="w", pady=5)

        self.confidence_label = ttk.Label(self.result_frame, text="", font=("Helvetica", 12))
        self.confidence_label.pack(anchor="w", pady=5)

        # Solutions Label + Scrollable Text
        sol_label = ttk.Label(self.result_frame, text="Treatment Solutions:", font=("Helvetica", 14, "underline"))
        sol_label.pack(anchor="w", pady=(20, 5))

        # Create a frame for Text + Scrollbar
        text_scroll_frame = ttk.Frame(self.result_frame)
        text_scroll_frame.pack(fill='both', expand=True)

        self.sol_text = tk.Text(text_scroll_frame, height=15, wrap="word", font=("Helvetica", 11), background="#fdfdfd")
        self.sol_text.pack(side='left', fill='both', expand=True, padx=(0, 0))
        self.sol_text.config(state="disabled")

        sol_scroll = ttk.Scrollbar(text_scroll_frame, orient="vertical", command=self.sol_text.yview)
        sol_scroll.pack(side='right', fill='y')

        self.sol_text.config(yscrollcommand=sol_scroll.set)
        self.sol_text.configure(padx=10, pady=5)  # for inner spacing



    def select_image(self):
        file_path = filedialog.askopenfilename(
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp"), ("All files", "*.*")]
        )
        if not file_path:
            return

        self.selected_image_path = file_path
        img = Image.open(file_path)
        img.thumbnail((300, 300))
        self.selected_image_tk = ImageTk.PhotoImage(img)

        self.img_label.config(image=self.selected_image_tk, text="")

        # Clear previous results
        self.clear_results()

    def predict_disease(self):
        if not self.selected_image_path:
            messagebox.showwarning("No Image", "Please select an image first.")
            return

        try:
            with open(self.selected_image_path, 'rb') as f:
                files = {'image': f}
                response = requests.post(API_URL, files=files)
                response.raise_for_status()
        except requests.exceptions.RequestException as e:
            messagebox.showerror("API Error", f"Failed to connect to the API:\n{str(e)}")
            return

        data = response.json()
        self.display_results(data)

    def display_results(self, data):
        self.plant_label.config(text=f"Plant: {data.get('plant_name', 'N/A')}")
        self.disease_label.config(text=f"Disease: {data.get('disease_name', 'N/A')}")
        self.confidence_label.config(text=f"Confidence: {data.get('confidence', 0):.2f}%")

        solutions = data.get("solutions", [])
        self.sol_text.config(state="normal")
        self.sol_text.delete(1.0, tk.END)
        if not solutions:
            self.sol_text.insert(tk.END, "No treatment solutions available.\n")
        else:
            for i, sol in enumerate(solutions, 1):
                self.sol_text.insert(tk.END, f"Solution {i}:\n")
                self.sol_text.insert(tk.END, f"Type: {sol.get('treatment_type', 'N/A').capitalize()}\n")
                self.sol_text.insert(tk.END, f"Details: {sol.get('solution_text', '')}\n")
                if sol.get('product_name'):
                    self.sol_text.insert(tk.END, f"Product: {sol['product_name']}\n")
                if sol.get('application_instructions'):
                    self.sol_text.insert(tk.END, f"Instructions: {sol['application_instructions']}\n")
                if sol.get('video_url'):
                    self.sol_text.insert(tk.END, f"Video: {sol['video_url']}\n")
                self.sol_text.insert(tk.END, "\n" + "-"*40 + "\n\n")
        self.sol_text.config(state="disabled")

    def clear_results(self):
        self.plant_label.config(text="")
        self.disease_label.config(text="")
        self.confidence_label.config(text="")
        self.sol_text.config(state="normal")
        self.sol_text.delete(1.0, tk.END)
        self.sol_text.config(state="disabled")


if __name__ == "__main__":
    app = DiseasePredictorApp()
    app.mainloop()
