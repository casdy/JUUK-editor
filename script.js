// Get the reference to the image element in the DOM
const imgEl = document.querySelector("img");

// Get references to all filter input elements in the DOM
const filtersEl = document.querySelectorAll("input");

// Get references to all rotation/flip elements in the DOM
const anglesEl = document.querySelectorAll("li");

// Get references to the file input and buttons in the DOM
const fileEl = document.querySelector(".file");
const chooseBtnEl = document.querySelector(".chooseBtn");
const saveBtnEl = document.querySelector(".saveBtn");
const resetBtnEl = document.querySelector(".resetBtn");

// Initialize variables for filter values and rotation/flip angles
let saturation = "100",
    blur = "0",
    brightness = "100",
    contrast = "100";
let rotate = 0,
    flipH = 1,
    flipV = 1;

// Function to set all filter input values to their initial values
const loadEl = () => {
    filtersEl[0].value = saturation;
    filtersEl[1].value = blur;
    filtersEl[2].value = brightness;
    filtersEl[3].value = contrast;

    // Update the variables with the current filter values
    saturation = filtersEl[0].value;
    blur = filtersEl[1].value;
    brightness = filtersEl[2].value;
    contrast = filtersEl[3].value;
};

// Function to generate and apply the image preview based on filter and rotation/flip values
const generateResult = () => {
    imgEl.style.filter = `saturate(${saturation}%) blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%)`;
    imgEl.style.transform = `rotate(${rotate}deg) scale(${flipH}, ${flipV})`;
};

// Event listeners for the rotation/flip buttons
anglesEl.forEach(element => {
    element.addEventListener("click", () => {
        // Update the rotation/flip values based on the clicked button
        if (element.id === "vertical") {
            flipV = flipV === 1 ? -1 : 1;
        } else if (element.id === "horizontal") {
            flipH = flipH === 1 ? -1 : 1;
        } else if (element.id === "left") {
            rotate = rotate - 90;
        } else {
            rotate = rotate + 90;
        }
        // Generate and apply the image preview after rotation/flip
        generateResult();
    });
});

// Event listeners for the filter input elements
filtersEl.forEach(element => {
    element.addEventListener("input", () => {
        // Update the filter values based on the input change
        if (element.id === "saturation") {
            saturation = filtersEl[0].value;
        } else if (element.id === "blur") {
            blur = filtersEl[1].value;
        } else if (element.id === "brightness") {
            brightness = filtersEl[2].value;
        } else {
            contrast = filtersEl[3].value;
        }
        // Generate and apply the image preview after filter change
        generateResult();
    });
});

// Event listener for the reset button to restore all values to their initial state
resetBtnEl.addEventListener("click", () => {
    saturation = "100", blur = "0", brightness = "100", contrast = "100";
    rotate = 0, flipH = 1, flipV = 1;
    // Generate and apply the image preview after reset
    generateResult();
    loadEl();
});

// Event listener for the file input to load a new image for editing
fileEl.addEventListener("change", () => {
    let file = fileEl.files[0];
    if (!file) return;
    // Display the chosen image as the new source for the image element
    imgEl.src = URL.createObjectURL(file);
    imgEl.addEventListener("load", () => {
        // Reset the image editing when the new image is loaded
        resetBtnEl.click();
    });
});

// Event listener for the "Choose" button to trigger the file input click
chooseBtnEl.addEventListener("click", () => {
    fileEl.click();
});

// Event listener for the "Save" button to save the edited image
saveBtnEl.addEventListener("click", () => {
    // Create a canvas to draw the edited image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;

    // Apply filters and transformations to the canvas
    ctx.filter = `saturate(${saturation}%) blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipH, flipV);
    ctx.drawImage(imgEl, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Create a link to download the canvas as an image file
    const link = document.createElement("a");
    link.download = "JUUK_pic.jpg";
    link.href = canvas.toDataURL();
    link.click();
});

// Call the loadEl function at the beginning when the website is opened to set initial values
loadEl();