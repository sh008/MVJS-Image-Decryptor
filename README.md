# MVJS Image Decryptor

This is a simple Node.js application that decrypts image files (`*.png_`) from games made with MVJS. The decrypted images will be saved in the `output_img` folder within the game's root directory.

## 🚀 How It Works
1. **Input:** The user selects the root directory of the MVJS game.
2. **Process:** The application searches for all encrypted image files (`*.png_`) in the `data` folder, decrypts them, and saves the decrypted `.png` files to the `output_img` directory.
3. **Output:** Decrypted images are stored in `output_img` at the root of the selected directory.

---

## 🛠️ Requirements
- Node.js
- npm

---

## 💻 How to Use

1. **Clone the repository:**
```bash
git clone https://github.com/YourUsername/MVJS-Image-Decryptor.git
cd MVJS-Image-Decryptor
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run the application:**
```bash
npm start
```

4. **Select the Game's Root Directory:**
When prompted, enter the path to the root directory of the MVJS game.

5. **Decryption Process:**
The app will automatically search for encrypted images and decrypt them to `output_img`.

6. **Check the Results:**
Open the `output_img` folder to view the decrypted `.png` files.

---

## 📂 Example Directory Structure

Before:
```
MVJS-Game/
│
├─ data/
│    ├─ image1.png_
│    └─ image2.png_
└─ other_folders/
```

After running the app:
```
MVJS-Game/
│
├─ data/
│    ├─ image1.png_
│    └─ image2.png_
├─ output_img/
│    ├─ image1.png
│    └─ image2.png
└─ other_folders/
```

---

## 📝 Notes
- Make sure you have the necessary permissions to decrypt and use the images.
- The application only processes files with the `.png_` extension.

---

## 📧 Support
For any issues, please create an issue on the GitHub repository or contact me at [Hero0008@proton.me].

