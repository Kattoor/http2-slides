const pTag = document.createElement("p");
const text = document.createTextNode("Another hello");
pTag.appendChild(text);

const div = document.getElementById("some-div");

div.appendChild(text);
