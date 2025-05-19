import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from PIL import Image, ImageTk, ImageGrab
from tkinter import messagebox, filedialog
import requests
import os
from fpdf import FPDF
import tempfile


# ---------- App Setup ----------
root = TkinterDnD.Tk()
root.attributes('-fullscreen', True)
root.title("Plant Disease Predictor")
root.geometry("600x600")
root.configure(bg="#f9f9f9")

def exit_fullscreen(event=None):
    root.attributes("-fullscreen", False)

root.bind("<Escape>", exit_fullscreen)

displayed_image = None
current_image_path = None

# ---------- Prediction Function ----------
def predict_image():
    global current_image_path
    result = ""
    if not current_image_path:
        result_label.config(text="⚠️ No image uploaded or pasted.")
        return

    try:
        response = requests.post(
            "http://127.0.0.1:8000/api/predict/",
            files={"image": open(current_image_path, "rb")}
        )
        data = response.json()

        label = data.get("label", "Unknown")
        confidence = data.get("confidence", 0.0)
        plant = data.get("plant_name", "Unknown")
        disease = data.get("disease_name", "Unknown")
        solutions = data.get("solutions") or []

        if disease.lower() == "healthy":
            sol_text = solutions[0].get("solution_text", "Keep monitoring and maintain good care.") if solutions else "Keep monitoring and maintain good care."
            result = f"""Prediction Result:

Plant: {plant}
Status: Healthy
Confidence: {confidence:.2f}%
Note: {sol_text}
"""
        else:
            result = f""" Prediction Result:

Plant: {plant}
Disease: {disease}
Confidence: {confidence:.2f}%

Treatment Suggestions:
"""
            for i, sol in enumerate(solutions, 1):
                treatment_type = (sol.get("treatment_type") or "N/A").capitalize()
                solution_text = sol.get("solution_text") or "No solution text provided."
                product = sol.get("product_name") or "N/A"
                instructions = sol.get("application_instructions") or "N/A"
                video = sol.get("video_url") or "No video available"

                result += f"""
{i}. Type: {treatment_type}
Product: {product}
Instructions: {instructions}
Video: {video}
{solution_text}
"""

    except Exception as e:
        result = f""" Error during prediction:
{e}

Displaying fallback result for UI testing.

Dummy Prediction Result:
Plant: Tomato
Disease: Blight
Confidence: 89.34%

Treatment:
1.  Type: Organic
Product: Neem Oil
Instructions: Spray every 3 days
Video: https://youtube.com/example
Keep affected leaves trimmed.
"""

    # Popup
    popup = tk.Toplevel(root)
    popup.title("📋 Prediction Result")
    popup.configure(bg="#f9f9f9")
    popup.geometry("800x800")
    popup.resizable(True, True)

    text_widget = tk.Text(popup, wrap="word", font=("Segoe UI", 11), bg="#f9f9f9", fg="#333")
    text_widget.insert("1.0", result)
    text_widget.config(state="disabled")
    text_widget.pack(expand=True, fill="both", padx=10, pady=10)

    def save_pdf():
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.set_font("Arial", size=12)
            for line in result.split('\n'):
                pdf.cell(0, 10, txt=line, ln=True)
            file_path = filedialog.asksaveasfilename(defaultextension=".pdf", filetypes=[("PDF files", "*.pdf")])
            if file_path:
                pdf.output(file_path)
                messagebox.showinfo("Saved", f"💾 Saved as PDF:\n{file_path}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    # --- Buttons Frame ---
    btn_frame = tk.Frame(popup, bg="#f9f9f9")
    btn_frame.pack(pady=(0, 10))

    tk.Button(btn_frame, text="💾 Save as PDF", command=save_pdf,
              bg="#4CAF50", fg="white", font=("Segoe UI", 10, "bold"),
              padx=10, pady=6, bd=0, activebackground="#45A049", cursor="hand2").grid(row=0, column=0, padx=10)

    tk.Button(popup, text="❌ Close", command=popup.destroy,
              bg="#f44336", fg="white", font=("Segoe UI", 10, "bold"),
              padx=10, pady=6, bd=0, activebackground="#d32f2f", cursor="hand2").pack(pady=(0, 10))

# ---------- Image Loader ----------
def load_image(image_source):
    global displayed_image, current_image_path
    try:
        img = Image.open(image_source)
        img.thumbnail((350, 350))
        displayed_image = ImageTk.PhotoImage(img)
        image_label.config(image=displayed_image, text="")
        current_image_path = image_source
        result_label.config(text=f"📂 Image loaded:\n{image_source}")
    except Exception as e:
        result_label.config(text=f"❌ Error loading image: {e}")

# ---------- Drag & Drop ----------
def on_drop(event):
    file_path = event.data.strip('{}')
    if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        load_image(file_path)
    else:
        result_label.config(text="⚠️ Please drop a valid image file (.jpg, .png)")

# ---------- Browse Button ----------
def browse_file():
    file_path = filedialog.askopenfilename(
        filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")]
    )
    if file_path:
        load_image(file_path)

# ---------- Clipboard Paste ----------
def paste_from_clipboard():
    global displayed_image, current_image_path
    try:
        img = ImageGrab.grabclipboard()
        if img:
            img.thumbnail((350, 350))
            displayed_image = ImageTk.PhotoImage(img)
            image_label.config(image=displayed_image, text="")
            current_image_path = "clipboard_image.png"
            img.save(current_image_path)
            result_label.config(text="Image pasted from clipboard")
        else:
            result_label.config(text="No image in clipboard")
    except Exception as e:
        result_label.config(text=f"Clipboard error: {e}")

# ---------- Style Utilities ----------
def styled_button(master, text, command):
    btn = tk.Button(
        master,
        text=text,
        command=command,
        bg="#4CAF50",
        fg="white",
        font=("Segoe UI", 10, "bold"),
        padx=15,
        pady=8,
        bd=0,
        activebackground="#45A049",
        cursor="hand2"
    )
    btn.bind("<Enter>", lambda e: btn.config(bg="#45A049"))
    btn.bind("<Leave>", lambda e: btn.config(bg="#4CAF50"))
    return btn

# ---------- UI Layout ----------

title_label = tk.Label(root, text="🌿 Plant Disease Predictor", font=("Segoe UI", 18, "bold"), bg="#f9f9f9")
title_label.pack(pady=10)

drop_area = tk.Label(
    root, text=" Drag & Drop Image Here", width=45, height=5,
    bg="#e0e0e0", relief="ridge", bd=2, font=("Segoe UI", 12),
    fg="#555", justify="center"
)
drop_area.pack(pady=10)
drop_area.drop_target_register(DND_FILES)
drop_area.dnd_bind("<<Drop>>", on_drop)

image_label = tk.Label(root, bg="#f9f9f9", text="🖼️ Image preview", font=("Segoe UI", 10), fg="#999")
image_label.pack(pady=15)

btn_frame = tk.Frame(root, bg="#f9f9f9")
btn_frame.pack(pady=10)

styled_button(btn_frame, "Browse Image", browse_file).grid(row=0, column=0, padx=10)
styled_button(btn_frame, "Paste Image", paste_from_clipboard).grid(row=0, column=1, padx=10)
styled_button(btn_frame, "Predict", predict_image).grid(row=0, column=2, padx=10)

result_label = tk.Label(
    root, text="", wraplength=500, justify="left",
    font=("Segoe UI", 11), bg="#f9f9f9", fg="#333"
)
result_label.pack(pady=20)

root.mainloop()
