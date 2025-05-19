import tkinter as tk
from tkinter import filedialog, messagebox
from fpdf import FPDF

# Function to save PDF
def save_as_pdf():
    text_content = text_area.get("1.0", tk.END).strip()
    if not text_content:
        messagebox.showwarning("Empty", "Text area is empty.")
        return

    file_path = filedialog.asksaveasfilename(
        defaultextension=".pdf",
        filetypes=[("PDF files", "*.pdf")],
        title="Save as PDF"
    )
    if file_path:
        try:
            pdf = FPDF()
            pdf.add_page()
            pdf.set_auto_page_break(auto=True, margin=15)
            pdf.set_font("Arial", size=12)

            for line in text_content.split('\n'):
                pdf.cell(0, 10, txt=line, ln=True)

            pdf.output(file_path)
            messagebox.showinfo("Success", f"Saved PDF:\n{file_path}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Setup GUI
root = tk.Tk()
root.title("📝 Save Text as PDF")
root.geometry("500x400")

tk.Label(root, text="Enter your content below:", font=("Segoe UI", 12)).pack(pady=5)

text_area = tk.Text(root, wrap="word", font=("Segoe UI", 11))
text_area.pack(expand=True, fill="both", padx=10, pady=10)

tk.Button(
    root,
    text="💾 Save as PDF",
    command=save_as_pdf,
    bg="#4CAF50", fg="white",
    font=("Segoe UI", 10, "bold"),
    padx=10, pady=6,
    bd=0,
    activebackground="#45A049",
    cursor="hand2"
).pack(pady=10)

root.mainloop()
