const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainerTabs");
const wrapperUkraineEl = document.getElementById("Ukraine");
const wrapperWorldEl = document.getElementById("World");
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
const yestardayTime = new Date(Date.now()-86400000).toISOString().slice(0, 10);
let ukraineData = [];
let worldData = [];

wrapperTabsEl.addEventListener("click", (e) => {
  const tab = e.target.closest("button");
  Array.from(wrapperTabsEl.children).forEach(btn => btn.classList.remove('active'));
  if (tab) {
    tab.classList.add('active');
    const region = tab.dataset.region;
    Array.from(wrapperContainerTabsEl.children).forEach(tabPage => tabPage.classList.remove('active_tab'));
    document.getElementById(region).classList.add('active_tab');
  }
});

fetch(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
.then(res => res.json())
.then(data => {
  ukraineData = data.ukraine;
  worldData = data.world;
  renderCoronaData(wrapperUkraineEl, ukraineData)
  renderCoronaData(wrapperWorldEl, worldData)
})
.catch(error => console.warn(error));

fetch(`https://api-covid19.rnbo.gov.ua/data?to=${yestardayTime}`)
.then(res => res.json())
.then(data => {
  ukraineData = data.ukraine;
  worldData = data.world;
})
.catch(error => console.warn(error));

function renderCoronaData(elemForRender, dataArray) {
  elemForRender.innerHTML = createDataArr(dataArray).join('');
}

function createDataArr(dataArray) {
  return dataArray.map(field => createDataField(field));
}

function createDataField(field) {
  return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${field?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">${field?.confirmed}</dd>
            <dd class="wrapper-data__deaths">${field?.deaths}</dd>
            <dd class="wrapper-data__recovered">${field?.recovered}</dd>
            <dd class="wrapper-data__existing">${field?.existing}</dd>
          </dl>`
}
