function addRightBarIcon() {
    const navbar = document.getElementById('nav-bar');

    const iconDiv = document.createElement('div');
    const rightBarIcon = document.createElement('span');
    const rightBarIconI = document.createElement('i');

    iconDiv.setAttribute('class', "rightbar-icon-div absolute left-0 top-0 bg-gray");

    rightBarIcon.setAttribute('id', "right-bar");
    rightBarIcon.setAttribute('class', "right-bar absolute cursor-pointer w-1/2 p-4 mx-auto text-center");

    rightBarIconI.setAttribute('class', "fa fa-bars font-bold text-[48px]");


    rightBarIcon.appendChild(rightBarIconI);
    iconDiv.appendChild(rightBarIcon);
    navbar.appendChild(iconDiv);
}


function expandRightBar() {
    const rightBarIcon = document.getElementById("right-bar");

}


document.addEventListener('DOMContentLoaded', function() {
    addRightBarIcon();
});