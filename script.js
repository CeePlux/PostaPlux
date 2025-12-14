// DOM Elements
const postContent = document.getElementById('postContent');
const authorName = document.getElementById('authorName');
const showTimestamp = document.getElementById('showTimestamp');
const customTimestamp = document.getElementById('customTimestamp');
const decreaseFont = document.getElementById('decreaseFont');
const increaseFont = document.getElementById('increaseFont');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const boldText = document.getElementById('boldText');

let currentFontSize = 16;
let isBold = false;

const previewContainer = document.getElementById('previewContainer');
const previewAuthor = document.getElementById('previewAuthor');
const previewText = document.getElementById('previewText');
const previewTime = document.getElementById('previewTime');
const previewProfilePic = document.getElementById('previewProfilePic');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Hamburger Menu Elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sideMenu = document.getElementById('sideMenu');
const closeMenu = document.getElementById('closeMenu');
const menuOverlay = document.getElementById('menuOverlay');

// Profile Upload Elements
const profileUpload = document.getElementById('profileUpload');
const uploadBtn = document.getElementById('uploadBtn');
const removeBtn = document.getElementById('removeBtn');
const profilePreview = document.getElementById('profilePreview');

let uploadedImage = null;

// MOBILE RESIZE HANDLER
function handleWindowResize() {
    const container = document.querySelector('.container');
    const panels = document.querySelectorAll('.controls-panel, .preview-panel');
    
    if (window.innerWidth < 768) {
        if (container) container.style.flexDirection = 'column';
        panels.forEach(panel => {
            panel.style.width = '100%';
            panel.style.maxWidth = '100%';
        });
    } else {
        if (container) container.style.flexDirection = 'row';
        panels.forEach(panel => {
            panel.style.width = '';
            panel.style.maxWidth = '';
        });
    }
}

// Initialize
function init() {
    updatePreview();
    attachEventListeners();
    initMenu();
    initProfileUpload();
    handleWindowResize();
    
    window.addEventListener('resize', handleWindowResize);
}

// Initialize Hamburger Menu
function initMenu() {
    if (!hamburgerMenu || !sideMenu) return;
    
    hamburgerMenu.addEventListener('click', () => {
        sideMenu.classList.toggle('active');
        if (menuOverlay) menuOverlay.classList.toggle('active');
    });

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }
}

// Initialize Profile Upload
function initProfileUpload() {
    if (!profileUpload) return;
    
    // Click on the upload button triggers file input
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileUpload.click();
        });
    }
    
    // Handle file selection
    profileUpload.addEventListener('change', handleImageUpload);
    
    // Handle remove button
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            removeUploadedImage();
        });
    }
}

// Handle Image Upload with Auto-Cropping
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG, GIF, etc.).');
        profileUpload.value = '';
        return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB for best performance.');
        profileUpload.value = '';
        return;
    }
    
    // Show loading state
    if (profilePreview) {
        profilePreview.innerHTML = '<i class="fas fa-spinner fa-spin" style="font-size:2rem;color:#1a6dff;"></i>';
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageDataUrl = e.target.result;
        
        // Create image to get dimensions
        const img = new Image();
        
        img.onload = function() {
            try {
                // Create canvas for cropping to square
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas to square (400x400 for high quality)
                const canvasSize = 400;
                canvas.width = canvasSize;
                canvas.height = canvasSize;
                
                // Calculate crop and center
                const sourceSize = Math.min(img.width, img.height);
                const sourceX = (img.width - sourceSize) / 2;
                const sourceY = (img.height - sourceSize) / 2;
                
                // Draw cropped and centered image
                ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, canvasSize, canvasSize);
                
                // Convert to data URL
                uploadedImage = canvas.toDataURL('image/jpeg', 0.9);
                
                // Update previews
                updateProfileDisplays(uploadedImage);
                
                // Show remove button
                if (removeBtn) removeBtn.style.display = 'block';
                
                // Reset file input
                profileUpload.value = '';
            } catch (err) {
                console.error('Canvas processing error:', err);
                alert('Failed to process the image. Please try a different image.');
                if (profilePreview) {
                    profilePreview.innerHTML = '<i class="fas fa-user default-avatar"></i>';
                }
                profileUpload.value = '';
            }
        };
        
        img.onerror = function() {
            alert('Could not load the image. Please try a different file.');
            if (profilePreview) {
                profilePreview.innerHTML = '<i class="fas fa-user default-avatar"></i>';
            }
            profileUpload.value = '';
        };
        
        img.src = imageDataUrl;
    };
    
    reader.onerror = function() {
        alert('Failed to read the file. Please try again.');
        if (profilePreview) {
            profilePreview.innerHTML = '<i class="fas fa-user default-avatar"></i>';
        }
        profileUpload.value = '';
    };
    
    reader.readAsDataURL(file);
}

// Update Profile Displays
function updateProfileDisplays(imageData) {
    // Update upload preview
    if (profilePreview) {
        profilePreview.innerHTML = '<img src="' + imageData + '" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
    }
    
    // Update live preview
    if (previewProfilePic) {
        previewProfilePic.innerHTML = '<img src="' + imageData + '" alt="Profile" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">';
    }
}

// Remove Uploaded Image
function removeUploadedImage() {
    uploadedImage = null;
    if (profileUpload) profileUpload.value = '';
    
    // Reset to default avatar
    if (profilePreview) {
        profilePreview.innerHTML = '<i class="fas fa-user default-avatar"></i>';
    }
    if (previewProfilePic) {
        previewProfilePic.innerHTML = '<i class="fas fa-user default-avatar"></i>';
    }
    
    if (removeBtn) {
        removeBtn.style.display = 'none';
    }
}

// Update Live Preview
function updatePreview() {
    if (previewAuthor) {
        previewAuthor.textContent = authorName.value || 'Cyril John';
    }
    
    // PRESERVE LINE BREAKS
    if (previewText) {
        const content = postContent.value || "What's on your mind?";
        previewText.innerHTML = content.replace(/\n/g, '<br>');
    }
    
    if (previewTime) {
        if (showTimestamp.checked) {
            previewTime.textContent = customTimestamp.value || 'Just now';
        } else {
            previewTime.textContent = '';
        }
    }
}

// Event Listeners
function attachEventListeners() {
    postContent.addEventListener('input', updatePreview);
    authorName.addEventListener('input', updatePreview);
    showTimestamp.addEventListener('change', updatePreview);
    customTimestamp.addEventListener('input', updatePreview);
    
    if (decreaseFont) {
        decreaseFont.addEventListener('click', () => {
            if (currentFontSize > 12) {
                currentFontSize -= 2;
                updateFontSize();
            }
        });
    }
    
    if (increaseFont) {
        increaseFont.addEventListener('click', () => {
            if (currentFontSize < 32) {
                currentFontSize += 2;
                updateFontSize();
            }
        });
    }
    
    if (boldText) {
        boldText.addEventListener('change', () => {
            isBold = boldText.checked;
            updateBoldStyle();
        });
    }
    
    generateBtn.addEventListener('click', generateScreenshot);
    resetBtn.addEventListener('click', resetToDefault);
}

function updateFontSize() {
    if (fontSizeDisplay) {
        fontSizeDisplay.textContent = currentFontSize + 'px';
    }
    if (previewText) {
        previewText.style.fontSize = currentFontSize + 'px';
    }
}

function updateBoldStyle() {
    if (previewText) {
        previewText.style.fontWeight = isBold ? 'bold' : 'normal';
    }
}

// Generate Screenshot
async function generateScreenshot() {
    try {
        console.log('Starting screenshot generation...');
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        generateBtn.disabled = true;
        
        // Update preview with current text and line breaks
        const content = postContent.value || "What's on your mind?";
        if (previewText) {
            previewText.innerHTML = content.replace(/\n/g, '<br>');
        }
        
        // Wait for DOM update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Light theme colors (fixed - no dark mode)
        const postBackground = 'white';
        const textColorValue = '#333';
        const profileBg = '#ddd';
        const iconColor = '#666';
        const watermarkColor = 'black';
        
        // Create the Facebook post element
        const postElement = document.createElement('div');
        postElement.id = 'capturePost';
        postElement.style.cssText = 
            'width: 500px;' +
            'max-width: 100%;' +
            'background: ' + postBackground + ';' +
            'border-radius: 12px;' +
            'padding-top: 80px;' +
            'padding-bottom: 100px;' +
            'padding-left: 28px;' +
            'padding-right: 25px;' +
            'color: ' + textColorValue + ';' +
            'position: relative;' +
            'font-family: Segoe UI, sans-serif;' +
            'box-sizing: border-box;' +
            'box-shadow: none;' +
            'margin: 0;' +
            'border: none;';
        
        // Add watermark
        const watermark = document.createElement('div');
        watermark.textContent = 'PostaPlux';
        watermark.style.cssText = 
            'position: absolute;' +
            'top: 85px;' +
            'right: 35px;' +
            'font-style: italic;' +
            'opacity: 0.3;' +
            'color: ' + watermarkColor + ';' +
            'font-size: 13px;' +
            'pointer-events: none;' +
            'z-index: 1000;';
        postElement.appendChild(watermark);
        
        // Create post header
        const postHeader = document.createElement('div');
        postHeader.style.cssText = 
            'display: flex;' +
            'align-items: center;' +
            'gap: 12px;' +
            'margin-bottom: 15px;';
        
        // Profile picture
        const profileDiv = document.createElement('div');
        profileDiv.style.cssText = 
            'width: 40px;' +
            'height: 40px;' +
            'min-width: 40px;' +
            'border-radius: 50%;' +
            'background: ' + profileBg + ';' +
            'display: flex;' +
            'align-items: center;' +
            'justify-content: center;' +
            'overflow: hidden;';
        
        if (uploadedImage) {
            const profileImg = document.createElement('img');
            profileImg.src = uploadedImage;
            profileImg.style.cssText = 'width:100%; height:100%; object-fit:cover;';
            profileDiv.appendChild(profileImg);
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-user';
            icon.style.cssText = 'font-size:20px; color:' + iconColor;
            profileDiv.appendChild(icon);
        }
        
        postHeader.appendChild(profileDiv);
        
        // Author info
        const authorDiv = document.createElement('div');
        authorDiv.style.cssText = 'display:flex; flex-direction:column;';
        
        const authorText = document.createElement('strong');
        authorText.textContent = authorName.value || 'Cyril John';
        authorText.style.cssText = 'font-size:15px; font-weight:600;';
        
        const timestampEl = document.createElement('span');
        timestampEl.textContent = showTimestamp.checked ? (customTimestamp.value || 'Just now') : '';
        timestampEl.style.cssText = 'font-size:13px; opacity:0.7; color:inherit; margin-top:2px;';
        
        authorDiv.appendChild(authorText);
        authorDiv.appendChild(timestampEl);
        postHeader.appendChild(authorDiv);
        
        postElement.appendChild(postHeader);
        
        // Post content
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 
            'font-size: 18px;' +
            'line-height: 1.4;' +
            'margin-bottom: 10px;' +
            'word-wrap: break-word;';
        
        const textDiv = document.createElement('div');
        textDiv.innerHTML = content.replace(/\n/g, '<br>');
        textDiv.style.cssText = 
            'white-space: pre-wrap;' +
            'word-break: break-word;' +
            'color: #000000;' +
            'text-align: left;' +
            'font-family: inherit;' +
            'font-size: ' + currentFontSize + 'px;' +
            'font-weight: ' + (isBold ? 'bold' : 'normal') + ';';
        
        contentDiv.appendChild(textDiv);
        postElement.appendChild(contentDiv);
        
        // Position off-screen for capture
        postElement.style.position = 'fixed';
        postElement.style.left = '-9999px';
        postElement.style.top = '0';
        document.body.appendChild(postElement);
        
        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            throw new Error('Screenshot library not loaded. Please refresh the page.');
        }
        
        console.log('Capturing post element...');
        
        // Capture the post element
        const canvas = await html2canvas(postElement, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            logging: false,
            allowTaint: true,
            width: postElement.offsetWidth,
            height: postElement.offsetHeight,
            removeContainer: true
        });
        
        console.log('Canvas created successfully');
        
        // Clean up
        document.body.removeChild(postElement);
        
        // Convert to data URL
        const imageData = canvas.toDataURL('image/png');
        
        // Update download button
        downloadBtn.disabled = false;
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'postaplux-' + Date.now() + '.png';
            link.href = imageData;
            link.click();
        };
        
        // Show preview
        const outputArea = document.getElementById('outputArea');
        outputArea.innerHTML = 
            '<div style="text-align:center;">' +
                '<div style="display: inline-block; background: #f5f7fa; padding: 20px; border-radius: 10px; margin: 0 auto;">' +
                    '<img src="' + imageData + '" style="max-width: 300px; border-radius: 12px; display: block;">' +
                '</div>' +
                '<p style="margin-top:15px; color:#666; font-size:0.9rem;">Screenshot ready!</p>' +
            '</div>';
        
        console.log('Screenshot generated successfully');
        
    } catch (error) {
        console.error('Screenshot generation failed:', error);
        
        // Show user-friendly error
        const outputArea = document.getElementById('outputArea');
        outputArea.innerHTML = 
            '<div style="text-align:center; color: #ff4757; padding: 20px;">' +
                '<i class="fas fa-exclamation-triangle" style="font-size: 48px;"></i>' +
                '<h4>Generation Failed</h4>' +
                '<p>' + error.message + '</p>' +
                '<button onclick="location.reload()" style="background: #1a6dff; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 10px; cursor: pointer;">Refresh Page</button>' +
            '</div>';
        
        alert('Failed to generate screenshot: ' + error.message);
    } finally {
        generateBtn.innerHTML = '<i class="fas fa-camera"></i> Generate Screenshot';
        generateBtn.disabled = false;
    }
}

// Reset to Default
function resetToDefault() {
    if (confirm('Reset all settings to default?')) {
        console.log('Resetting to default...');
        
        // Reset form values
        postContent.value = "What's on your mind?";
        authorName.value = 'Cyril John';
        customTimestamp.value = '';
        showTimestamp.checked = true;
        currentFontSize = 16;
        updateFontSize();
        isBold = false;
        if (boldText) boldText.checked = false;
        updateBoldStyle();
        
        // Reset profile picture
        removeUploadedImage();
        
        // Update the preview
        updatePreview();
        
        // Reset download button and output area
        downloadBtn.disabled = true;
        const outputArea = document.getElementById('outputArea');
        if (outputArea) {
            outputArea.innerHTML = 'Your generated image will appear here';
            outputArea.className = 'output-placeholder';
        }
        
        console.log('Reset complete');
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);