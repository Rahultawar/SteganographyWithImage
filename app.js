let cv;

function onOpenCvReady() {
    cv = window.cv;
    document.getElementById('encryptButton').addEventListener('click', encryptMessage);
    document.getElementById('decryptButton').addEventListener('click', decryptMessage);
    document.getElementById('encryptImageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('decryptImageUpload').addEventListener('change', handleImageUpload);
    document.getElementById('downloadButton').addEventListener('click', handleDownload);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = new Image();
            imgElement.onload = function() {
                if (event.target.id === 'encryptImageUpload') {
                    document.getElementById('encryptImagePreview').src = e.target.result;
                    document.getElementById('encryptImagePreview').style.display = 'block';
                    document.getElementById('originalImageSection').style.display = 'block';
                    document.getElementById('originalCanvas').style.display = 'block';
                    const canvas = document.getElementById('originalCanvas');
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgElement, 0, 0);
                } else {
                    document.getElementById('decryptImagePreview').src = e.target.result;
                    document.getElementById('decryptImagePreview').style.display = 'block';
                }
            };
            imgElement.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}


function encryptMessage() {
    const message = document.getElementById('secretMessage').value;
    const imgElement = document.getElementById('encryptImagePreview');
    const canvas = document.getElementById('originalCanvas');

    if (!imgElement.src || !message) {
        document.getElementById('encryptErrorMessage').innerText = 'Please provide an image and a message.';
        return;
    } else {
        document.getElementById('encryptErrorMessage').innerText = '';
    }

    let src = cv.imread(imgElement);
    let dst = src.clone();
    let messageIndex = 0;

    for (let i = 0; i < src.rows; i++) {
        for (let j = 0; j < src.cols; j++) {
            if (messageIndex < message.length) {
                const pixel = dst.ucharPtr(i, j);
                const charCode = message.charCodeAt(messageIndex);
                pixel[0] = charCode;
                messageIndex++;
            }
        }
    }

    cv.imshow(canvas, dst);
    const encryptedImageData = canvas.toDataURL();
    document.getElementById('encryptedImage').src = encryptedImageData;
    document.getElementById('encryptedImageContainer').style.display = 'block';
    document.getElementById('downloadButtonContainer').style.display = 'block';
    src.delete();
    dst.delete();
}

function decryptMessage() {
    const imgElement = document.getElementById('decryptImagePreview');

    if (!imgElement.src) {
        document.getElementById('decryptErrorMessage').innerText = 'Please provide an image.';
        return;
    } else {
        document.getElementById('decryptErrorMessage').innerText = '';
    }

    let src = cv.imread(imgElement);
    let decryptedMessage = '';

    for (let i = 0; i < src.rows; i++) {
        for (let j = 0; j < src.cols; j++) {
            const pixel = src.ucharPtr(i, j);
            decryptedMessage += String.fromCharCode(pixel[0]);
        }
    }

    document.getElementById('decryptedMessage').value = decryptedMessage;
    document.getElementById('decryptedMessageContainer').style.display = 'block';
    src.delete();
}

function handleDownload() {
    const encryptedImage = document.getElementById('encryptedImage').src;
    const link = document.createElement('a');
    link.href = encryptedImage;
    link.download = 'Steganography_Encrypted_Image.png';
    link.click();
}
