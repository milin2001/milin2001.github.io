const imageSelector = document.getElementById('image-selector');
const canvas = document.getElementById('output');
const ctx = canvas.getContext('2d');

// Load the COCO-SSD model
cocoSsd.load().then(model => {
    // When the user selects an image
    imageSelector.addEventListener('change', () => {
        const reader = new FileReader();
        reader.onload = async () => {
            // Load the image into a HTMLImageElement
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                // Display the image on the canvas
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Wait for 3 seconds
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Preprocess the image and run it through the model
                const tensor = tf.browser.fromPixels(img);
                const predictions = await model.detect(tensor);

                // Draw the predicted bounding boxes on the canvas
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 2;
                ctx.font = 'bold 16px Arial';
                for (let i = 0; i < predictions.length; i++) {
                    const bbox = predictions[i].bbox;
                    const score = predictions[i].score;
                    const classLabel = predictions[i].class;

                    ctx.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);
                    ctx.fillStyle = 'yellow';
                    ctx.fillText(`${classLabel} (${Math.round(score * 100)}%)`, bbox[0], bbox[1] - 5);
                }

                // Dispose of the tensor to free up memory
                tensor.dispose();
            };
        };
        reader.readAsDataURL(imageSelector.files[0]);
    });
});
