const input = document.querySelector("#input");
const screenshot = document.querySelector("#screenshot");
const submit = document.querySelector("#submit");
const urlInput = document.querySelector("#url");
const downloadLink = document.querySelector("#downloadLink");


const FullPage = true;
const width = 1280; //1280
const height = 720; //720


submit.addEventListener("click", async (e) => {
    e.preventDefault();
    let url = urlInput.value;

    if (!url.startsWith("http://")) {
        if (!url.startsWith("https://")) {
            url = "http://" + url;
        }
        //throw new Error("invalid url");
        //alert("Invalid URL, make sure to include protocol in URL as well!");
    }

    try {
        new URL(url)
    } catch (e) {
      throw new Error("invalid url");
      alert("Invalid URL");
    }

    submit.disabled = true;
    screenshot.style.border = "";
    screenshot.src = "assets/placeholder.png";
    screenshot.alt = `Capturing screenshot for ${url}`;
    downloadLink.style.display = "none";
    document.title = "Capturing - JK Website Screenshot";
    
    try {
        const res = await fetch("/api/screenshot", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({ url, FullPage, width, height  })
        });

        const blob = await res.blob();
        const objectURL = URL.createObjectURL(blob);

        screenshot.src = objectURL;
        screenshot.style.border = "2px solid #4CAF50";
        screenshot.alt = `Screenshot of ${url}`;
        screenshot.scrollIntoView({ behavior: "smooth", block: "center" });
        downloadLink.href = objectURL;
        downloadLink.download = "screenshot.png";
        downloadLink.style.display = "flex";
        document.title = "JK Website Screenshot";
        submit.disabled = false;
    } catch {
        screenshot.style.border = "";
        screenshot.src = "assets/placeholder.png";
        screenshot.alt = "Error capturing screenshot, please make sure that entered URL is correct!";
        document.title = "Capturing - JK Website Screenshot";
        document.title = "JK Website Screenshot";
        submit.disabled = false;
        console.log("Error capturing screenshot, please make sure that entered URL is correct!");
    }
});

