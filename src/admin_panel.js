// Import necessary modules
import * as session from './gbl_check_session.js';
const { 
    checkSession
} = session;

import * as ui from './gbl_create_ui.js';
const { 
    createOverlay,
    closeUI
} = ui;

/*
/ Admin fetch functions
*/

import IP from '../appConfig.js';

// Function to fetch users from the server
function fetchUsers() {
    const url = `http://${IP}:3000/api/users/all`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching all users:', error);
            throw error; // Propagate the error to handle it in the calling function
        });
}

// Function to fetch quizzes from the server
function fetchQuizzes() {
    return fetch(`http://${IP}:3000/api/quizzes`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching quizzes:', error);
        });
}

// Function to create the admin control panel
function createAdminControlPanel() {
    const sessionData = checkSession(); // Check session here

    if (sessionData.admin === true) {
        // Create the overlay
        createOverlay();

        // Create the admin control panel container
        const adminControlPanelUI = document.createElement('div');
        adminControlPanelUI.className = 'ui bg-white rounded-lg p-4 w-[1080px] h-[720px] relative overflow-auto'; // Added overflow-auto class

        // Add event listener to close the UI when Escape key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeUI(adminControlPanelUI);
            }
        });

        // Create the tabs
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'flex border-b mb-4 relative';

        const usersTab = document.createElement('button');
        usersTab.className = 'tab-button px-4 py-2 text-gray-500 hover:text-blue-500 relative z-10';
        usersTab.textContent = 'Users';
        usersTab.addEventListener('click', () => showTab('users'));

        const quizzesTab = document.createElement('button');
        quizzesTab.className = 'tab-button px-4 py-2 text-gray-500 hover:text-blue-500 relative z-10';
        quizzesTab.textContent = 'Quizzes';
        quizzesTab.addEventListener('click', () => showTab('quizzes'));

        // Create the underline element
        const underline = document.createElement('div');
        underline.className = 'underline bg-blue-500 h-0.5 absolute bottom-0 left-0 transition-all duration-300 ease-in-out';

        tabsContainer.appendChild(usersTab);
        tabsContainer.appendChild(quizzesTab);
        tabsContainer.appendChild(underline);

        // Create the tab content containers
        const usersContent = document.createElement('div');
        usersContent.className = 'tab-content';
        usersContent.setAttribute('id', 'users');
        
        const quizzesContent = document.createElement('div');
        quizzesContent.className = 'tab-content hidden';
        quizzesContent.setAttribute('id', 'quizzes');
        
        adminControlPanelUI.appendChild(tabsContainer);
        adminControlPanelUI.appendChild(usersContent);
        adminControlPanelUI.appendChild(quizzesContent);

        // Create a container for the delete button (fixed position)
        const deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.className = 'delete-button-container';

        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete records';

        deleteButton.addEventListener('click', function() {
            const selectedRecords = adminControlPanelUI.querySelectorAll('tr.selected');
            selectedRecords.forEach(record => {
                record.remove(); // Remove selected records from DOM
            });
            toggleDeleteButton(); // Toggle delete button visibility
        });

        deleteButtonContainer.appendChild(deleteButton);
        adminControlPanelUI.appendChild(deleteButtonContainer);

        document.body.appendChild(adminControlPanelUI);

        // Show the 'users' tab by default
        showTab('users');

        // Handle tab switching and content loading
        function showTab(tabId) {
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.classList.remove('text-blue-500');
                button.classList.add('text-gray-500');
            });

            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            const activeTabButton = document.querySelector(`.tab-button:nth-child(${tabId === 'users' ? 1 : 2})`);
            const activeTabContent = document.getElementById(tabId);

            activeTabButton.classList.remove('text-gray-500');
            activeTabButton.classList.add('text-blue-500');
            activeTabContent.classList.remove('hidden');

            // Move the underline to the active tab
            underline.style.width = `${activeTabButton.offsetWidth}px`;
            underline.style.transform = `translateX(${activeTabButton.offsetLeft}px)`;

            // Load content if not already loaded
            if (tabId === 'users' && usersContent.children.length === 0) {
                fetchUsers()
                    .then(users => displayUsers(users, usersContent))
                    .catch(error => console.error('Error fetching users:', error));
            } else if (tabId === 'quizzes' && quizzesContent.children.length === 0) {
                fetchQuizzes()
                    .then(quizzes => displayQuizzes(quizzes, quizzesContent))
                    .catch(error => console.error('Error fetching quizzes:', error));
            }
        }
    } else {
        console.log('Tu neesi Admin un es nezinu, kā tu te tiķi.');
    }
}

// Function to display users in the users tab content
function displayUsers(users, container) {
    container.innerHTML = ''; // Clear previous content

    // Create toolbar div
    const toolbar = createToolbar('Users', users, container);

    // Display total count of records
    const totalRecords = document.createElement('div');
    totalRecords.textContent = `Total Users: ${users.length}`;

    // Append toolbar and total records to container
    container.appendChild(toolbar);
    container.appendChild(totalRecords);

    // Create table
    const headersUsers = [
        { key: 'user_id', label: 'User ID' },
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        { key: 'created_at', label: 'Created At' },
        { key: 'profile_image_url', label: 'Profile Image URL' }
    ];
    const table = createTable(users, headersUsers);
    container.appendChild(table);
}

// Function to display quizzes in the quizzes tab content
function displayQuizzes(quizzes, container) {
    container.innerHTML = ''; // Clear previous content

    // Create toolbar div
    const toolbar = createToolbar('Quizzes', quizzes, container);

    // Display total count of records
    const totalRecords = document.createElement('div');
    totalRecords.textContent = `Total Quizzes: ${quizzes.length}`;

    // Append toolbar and total records to container
    container.appendChild(toolbar);
    container.appendChild(totalRecords);

    // Create table
    const headersQuizzes = [
        { key: 'quiz_id', label: 'Quiz ID' },
        { key: 'imgUrl', label: 'Image URL' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'creator_id', label: 'Creator ID' },
        { key: 'created_at', label: 'Created At' },
        { key: 'lastUpdate_at', label: 'Last Updated At' },
        { key: 'play_count', label: 'Play Count' },
        { key: 'likes', label: 'Likes' },
        { key: 'rating', label: 'Rating' }
    ];
    const table = createTable(quizzes, headersQuizzes);
    container.appendChild(table);
}

// Function to create the toolbar for select all and individual record selection
function createToolbar(tabName, data, container) {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';

    const selectAllLabel = document.createElement('label');
    selectAllLabel.textContent = `Select all ${tabName}: `;
    toolbar.appendChild(selectAllLabel);

    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.addEventListener('change', function() {
        const rows = container.querySelectorAll('table tr');
        rows.forEach(row => {
            row.classList.toggle('selected', this.checked);
        });
        toggleDeleteButton(); // Toggle delete button visibility
    });
    toolbar.appendChild(selectAllCheckbox);

    return toolbar;
}

// Function to create total records display
function createTotalRecords(count, label) {
    const totalRecords = document.createElement('div');
    totalRecords.textContent = `Total ${label}: ${count}`;
    return totalRecords;
}

// Function to create a table based on data and headers
function createTable(data, headers) {
    const table = document.createElement('table');
    table.className = 'admin-table';

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header.label;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create data rows
    data.forEach(item => {
        const row = document.createElement('tr');
        row.addEventListener('click', function() {
            this.classList.toggle('selected');
            toggleDeleteButton(); // Toggle delete button visibility
        });

        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = item[header.key];
            row.appendChild(cell);
        });

        table.appendChild(row);
    });

    return table;
}

// Function to toggle the visibility of the delete button
function toggleDeleteButton() {
    const deleteButton = document.querySelector('.delete-button');
    const selectedRecords = document.querySelectorAll('tr.selected');
    deleteButton.style.display = selectedRecords.length > 0 ? 'block' : 'none';
}

export { createAdminControlPanel };