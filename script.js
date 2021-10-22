const searchInput = document.querySelector("#search");
const colorInput = document.querySelector("#colors");

const searchButton = document.querySelector("#searchButton");
const next = document.querySelector("#next");
const previous = document.querySelector("#previous");

let pageCounter = 1;

let currentSearchWord = "";
let currentSearchColor = "";

// Get pictures
async function searchPixabay(pageCounter, isSearchButtonClicked) {
  const form = document.querySelector("form");
  const divPictures = document.querySelector("#pictures");

  if (isSearchButtonClicked) {
    currentSearchWord = searchInput.value;
    currentSearchColor = colorInput.value;
  }

  const params = new URLSearchParams({
    key: "23526215-76924afeb19a47964152a6b12",
    q: currentSearchWord,
    page: pageCounter, // Default is 1
    per_page: 10, // Default is 20
    colors: currentSearchColor,
  });

  const url = form.action + "?" + params.toString();
  const response = await fetch(url);
  const searchResult = await response.json();

  next.hidden = false;
  previous.hidden = false;

  // When no more than 10 pictures are found, then disable the next button
  if (searchResult.hits.length < 10) {
    next.disabled = true;
  } else {
    next.disabled = false;
  }

  // Only make the previous button avalible when not on the first page
  if (pageCounter > 1) {
    previous.disabled = false;
  } else {
    previous.disabled = true;
  }

  // Empties the element
  removeAllChildren(document.querySelector("#pictures"));

  searchResult.hits.forEach((element) => {
    const figure = document.createElement("figure");
    const anchor = document.createElement("a");
    const img = document.createElement("img");
    const figCaption = document.createElement("figcaption");
    const tag = document.createElement("p");
    const user = document.createElement("p");

    divPictures.append(figure);
    img.src = element.webformatURL;
    img.alt = element.tags;
    figure.append(anchor);

    anchor.href = element.pageURL;
    anchor.append(img);

    user.textContent = "📷: " + element.user;
    figCaption.append(user);
    figure.append(figCaption);

    replaceSpace = element.tags.replaceAll(" ", "");
    tagSplit = replaceSpace.split(",");
    tag.textContent = `#${tagSplit[0]} #${tagSplit[1]} #${tagSplit[2]}`;
    figCaption.append(tag);
  });
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Search button
searchButton.onclick = (event) => {
  event.preventDefault();
  searchPixabay(pageCounter, true);
};

// Next button
next.onclick = (event) => {
  pageCounter++;
  event.preventDefault();
  searchPixabay(pageCounter, false);
};

// Previous button
previous.onclick = (event) => {
  pageCounter--;
  event.preventDefault();
  searchPixabay(pageCounter, false);
};
