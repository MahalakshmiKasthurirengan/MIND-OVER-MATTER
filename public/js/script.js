let menu = document.querySelector('#menu-icons');
let topbar_list = document.querySelector('.topbar_list');

// Toggle menu display on click
menu.onclick = () => {
    menu.classList.toggle('bx-x'); // Toggle icon change
    topbar_list.classList.toggle('open'); // Toggle the menu visibility
};

// Select all side icons
let sideIcons = document.querySelectorAll('.side-icon');

// Add click event to each side icon to show a list of items
sideIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior

        // Create a dropdown list
        let dropdownList = document.createElement('ul');
        dropdownList.classList.add('dropdown-list');

        // Sample items to be shown in the list
        let items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
        items.forEach(item => {
            let listItem = document.createElement('li');
            listItem.textContent = item;
            dropdownList.appendChild(listItem);
        });

        // Toggle display of dropdown list
        if (icon.nextSibling && icon.nextSibling.classList.contains('dropdown-list')) {
            icon.nextSibling.remove(); // Remove if already open
        } else {
            icon.parentNode.insertBefore(dropdownList, icon.nextSibling);
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("myVideo");

    // Ensure autoplay settings are enabled
    video.muted = true; // Required for autoplay in modern browsers
    video.loop = true;

    // Programmatic playback attempt
    video.play()
        .then(() => {
            console.log("Autoplay successful!");
        })
        .catch((error) => {
            console.error("Autoplay blocked by browser. Trying fallback:", error);

            // Fallback: Add play button if autoplay fails
            const button = document.createElement("button");
            button.textContent = "Play Video";
            button.style.display = "block";
            button.style.margin = "20px auto";
            button.onclick = () => video.play();
            document.body.appendChild(button);
        });
});