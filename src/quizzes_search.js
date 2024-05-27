document.addEventListener('DOMContentLoaded', function() {

    document.getElementById("searchBtn").addEventListener("click", function() {
        // Call your function here
        yourFunction();
    });

    document.querySelector('.search-bar-input').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            enterPressedFunction();
        }
    });

    function yourFunction() {
        // Define your function logic here
        alert("Icon pressed!");
    }

    function enterPressedFunction() {
        alert("Enter pressed");
    }

});