
# Gesture-Controlled PDF Viewer 📖🖐️

An interactive, in-browser PDF viewer that allows users to read and scroll through documents hands-free using computer vision gesture controls. Built with **TensorFlow.js**, **Handpose**, and **PDF.js**.

---

## 🚀 Live Site

* [**Try Now!**](https://el-8248.github.io/pdf-cv)

---

## 🛠️ How It Works

The application uses your webcam to track hand landmarks and counts how many fingers are extended to determine your scrolling intent:

| Hand Gesture | Action | Description |
| --- | --- | --- |
| **Open Hand (4–5 fingers)** | 🔽 **Scroll Down** | Continuous downward scrolling through pages |
| **Index Finger (1 finger)** | 🔼 **Scroll Up** | Continuous upward scrolling through pages |
| **Anything Else** | **Nothing** | Pauses scrolling and does nothing |

---

**Client Side ONLY:** All machine learning inference and PDF rendering happen locally in your browser.

**No video or data is sent to a server**.

---

## 🏗️ Technology Stack

* **Front-End:** HTML5, CSS3 (Flexbox Layout)
* **Computer Vision:** [TensorFlow.js](https://www.tensorflow.org/js) & [@tensorflow-models/handpose](https://github.com/tensorflow/tfjs-models/tree/master/handpose)
* **Document Engine:** [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla

---

## 💻 Getting Started Locally

Since the project uses vanilla JavaScript and CDN imports, it requires zero installation or heavy dependencies.

Because of browser security rules surrounding webcams (`MediaDevices.getUserMedia`), **you must run this project via a local development server** rather than double-clicking the HTML file.

### Step 1: Clone the Repository

```bash
git clone https://github.com/el-8248/pdf-cv.git
cd pdf-cv

```

### Step 2: Spin up a Local Server

You can use any basic static server utility:

* **Using VS Code:** Right-click `index.html` and select **"Open with Live Server"**.
* **Using Python 3:**
```bash
python -m http.server 8080

```


* **Using Node.js (`npx`):**
```bash
npx serve .

```



### Step 3: Open and Run

Navigate to `http://localhost:8080` (or the port provided by your server), grant webcam permissions when prompted, drop in a PDF, and try it out!
