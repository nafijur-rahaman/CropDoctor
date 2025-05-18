import tkinter as tk
from tkinterdnd2 import DND_FILES, TkinterDnD
from PIL import Image, ImageTk, ImageGrab
from tkinter import filedialog
import requests

# ---------- App Setup ----------
root = TkinterDnD.Tk()
root.attributes('-fullscreen', True)
root.title("🌿 Plant Disease Predictor")
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
    if not current_image_path:
        result_label.config(text="⚠️ No image uploaded or pasted.")
        return

    try:
        response = requests.post(
            "http://127.0.0.1:8000/predict/",
            files={"image": open(current_image_path, "rb")}
        )
        data = response.json()
        label = data["label"]
        solution = data["solution"]
        confidence = data["confidence"]

        result_label.config(
            text=f"✅ Prediction Result:\n\n🌱 Disease: {label}\n🎯 Confidence: {confidence:.2f}%\n💡 Solution: {solution}"
        )
    except Exception as e:
        result_label.config(text=f"❌ Error during prediction:\n{e}")


# ---------- Image Loader ----------
def load_image(image_source):
    global displayed_image, current_image_path
    try:
        img = Image.open(image_source)
        img.thumbnail((350, 350))
        displayed_image = ImageTk.PhotoImage(img)
        image_label.config(image=displayed_image, text="")
        current_image_path = image_source
        result_label.config(text=f"✅ Image loaded:\n{image_source}")
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
            result_label.config(text="📋 Image pasted from clipboard")
        else:
            result_label.config(text="⚠️ No image in clipboard")
    except Exception as e:
        result_label.config(text=f"❌ Clipboard error: {e}")


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

# Drop zone
drop_area = tk.Label(
    root, text="📂 Drag & Drop Image Here", width=45, height=5,
    bg="#e0e0e0", relief="ridge", bd=2, font=("Segoe UI", 12),
    fg="#555", justify="center"
)
drop_area.pack(pady=10)
drop_area.drop_target_register(DND_FILES)
drop_area.dnd_bind("<<Drop>>", on_drop)

# Image preview
image_label = tk.Label(root, bg="#f9f9f9", text="🖼️ Image preview", font=("Segoe UI", 10), fg="#999")
image_label.pack(pady=15)

# Buttons section
btn_frame = tk.Frame(root, bg="#f9f9f9")
btn_frame.pack(pady=10)

styled_button(btn_frame, "📁 Browse Image", browse_file).grid(row=0, column=0, padx=10)
styled_button(btn_frame, "📋 Paste Image", paste_from_clipboard).grid(row=0, column=1, padx=10)
styled_button(btn_frame, "🔍 Predict", predict_image).grid(row=0, column=2, padx=10)

# Results label
result_label = tk.Label(
    root, text="", wraplength=500, justify="left",
    font=("Segoe UI", 11), bg="#f9f9f9", fg="#333"
)
result_label.pack(pady=20)

# Run app
root.mainloop()
