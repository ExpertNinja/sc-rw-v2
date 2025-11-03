# Images Folder

This folder should contain the following images for the Navbar component:

## Required Images:

1. **download.png**
   - Standard Chartered GBS logo
   - Recommended size: 200x40 pixels (or similar aspect ratio)
   - Should be placed at: `src/Data/Images/download.png`

2. **adminIcon.png**
   - Admin profile icon/avatar
   - Recommended size: 36x36 pixels (square)
   - Should be placed at: `src/Data/Images/adminIcon.png`

## Temporary Solution:

Until you add the actual images, you can:

1. **Option 1:** Use placeholder URLs
   - Replace the import statements in `Navbar.js` with placeholder URLs
   - Example: `const download = "https://via.placeholder.com/200x40?text=Logo";`
   - Example: `const adminIcon = "https://via.placeholder.com/36x36?text=Admin";`

2. **Option 2:** Use text/icons instead
   - Replace `<img>` tags with text or icon fonts (Bootstrap Icons)

3. **Option 3:** Add your actual images
   - Place your logo as `download.png` in this folder
   - Place your admin icon as `adminIcon.png` in this folder

## Note:
The Navbar component will show errors until these images are added or the imports are updated to use placeholders.
