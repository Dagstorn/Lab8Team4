const wrapper = document.querySelector(".searchAndSelect"),
selectBtn = wrapper.querySelector(".selectBtn"),
searchInp = wrapper.querySelector("input"),
options = wrapper.querySelector(".options");
collapseArea = wrapper.querySelector(".collapse");
let searchElements = Array.from(options.children).map(el => {
    return {
        "id": el.id,
        "name": el.innerText
    }
});


function addCountry(selectedOpt) {
    options.innerHTML = "";
    searchElements.forEach(searchOptionObj => {
        let isSelected = searchOptionObj.name == selectedOpt ? "selected" : "";
        let li = `<li onclick="updateName(this)" id="${searchOptionObj.id}" class="${isSelected}">${searchOptionObj.name}</li>`;
        options.insertAdjacentHTML("beforeend", li);
    });
}
addCountry();

function updateName(selectedLi) {
    document.querySelector('#selectedDriver').value = selectedLi.id;
    searchInp.value = "";
    addCountry(selectedLi.innerText);
    wrapper.classList.remove("active");
    collapseArea.classList.toggle('show');
    selectBtn.firstElementChild.innerText = selectedLi.innerText;
}

searchInp.addEventListener("keyup", () => {
    console.log('dd')
    let arr = [];
    let searchWord = searchInp.value.toLowerCase();
    arr = searchElements.filter(data => {
        return data.name.toLowerCase().startsWith(searchWord);
    }).map(data => {
        let isSelected = data.name == selectBtn.firstElementChild.innerText ? "selected" : "";
        return `<li onclick="updateName(this)" id="${data.id}" class="${isSelected}">${data.name}</li>`;
    }).join("");
    options.innerHTML = arr ? arr : `<p style="margin-top: 10px;">Oops! Driver not found</p>`;
});

selectBtn.addEventListener("click", () => wrapper.classList.toggle("active"));