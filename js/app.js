const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainerTabs");
const wrapperUkraineEl = document.getElementById("Ukraine");
const wrapperWorldEl = document.getElementById("World");
const keys = ["confirmed", "deaths", "recovered", "existing"];
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
const yestardayTime = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
let ukraineData = [];
let worldData = [];
let abdd = [];
let yestardayConfirmed = 0;
let i = -1, j = -1;

wrapperTabsEl.addEventListener("click", (e) => {
  const tab = e.target.closest("button");
  Array.from(wrapperTabsEl.children).forEach((btn) => btn.classList.remove("active"));
  if (tab) {
    tab.classList.add("active");
    const region = tab.dataset.region;
    Array.from(wrapperContainerTabsEl.children).forEach((tabPage) => tabPage.classList.remove("active_tab"));
    document.getElementById(region).classList.add("active_tab");
  }
});

function currentFetchFromDataCenter() {
  fetch(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
    .then((res) => res.json())
    .then((data) => {
      ukraineData = data.ukraine;
      worldData = data.world;
      yesterdayFetchFromDataCenter(`https://api-covid19.rnbo.gov.ua/data?to=${yestardayTime}`);
    })
    .catch((error) => console.warn(error));
}

currentFetchFromDataCenter();

function yesterdayFetchFromDataCenter(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      yestardayUkraineData = data.ukraine;
      yestardayWorldData = data.world;
      const [confirm, death, recover, existing] = createSmartKeyForDifferenceCount(ukraineData, yestardayUkraineData, keys);
      const abd = createSmartKeyForDifferenceCount(ukraineData, yestardayUkraineData, keys);
      console.log(confirm);
      const bd = createSmartKeyForDifferenceCount(worldData, yestardayWorldData, keys);
      renderCoronaData(wrapperUkraineEl, ukraineData, abd[0]);
      renderCoronaData(wrapperWorldEl, worldData, bd[0]);
    })
    .catch((error) => console.warn(error));
}

// function renderCoronaData(elemForRender, dataArray) {
//   elemForRender.innerHTML = createDataArr(dataArray).join("");
// }

// function createDataArr(dataArray) {
//   return dataArray.map((field) => createDataField(field));
// }

// function createDataField(field) {
//   return `<dl class="wrapper-data">
//             <dt class="wrapper-data__country">${field?.label?.uk}</dt>
//             <dd class="wrapper-data__confirmed">
//               ${field?.confirmed}
//             </dd>
//             <dd class="wrapper-data__deaths">${field?.deaths}</dd>
//             <dd class="wrapper-data__recovered">${field?.recovered}</dd>
//             <dd class="wrapper-data__existing">${field?.existing}</dd>
//           </dl>`;
// }


function renderCoronaData(elemForRender, dataArray, value) {
  elemForRender.innerHTML = createDataArr(dataArray, value).join("");
}

function createDataArr(dataArray, value) {
  return dataArray.map((field) => createDataField(field, value));
}

function createDataField(field, value) {
  i++;
  return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${field?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              ${field?.confirmed}
              ${value[i]}
            </dd>
            <dd class="wrapper-data__deaths">${field?.deaths}</dd>
            <dd class="wrapper-data__recovered">${field?.recovered}</dd>
            <dd class="wrapper-data__existing">${field?.existing}</dd>
          </dl>`;
}
















function createSmartKeyForDifferenceCount(dataArrayFirst, dataArraySecond, smartKeys) {
  return smartKeys.map((smartKey) =>
    createYestardayData(dataArrayFirst, dataArraySecond, smartKey)
  );
}

function createYestardayData(dataArrayFirst, dataArraySecond, smartKey) {
  let arrToday = dataArrayFirst.map((res) => res[smartKey]);
  let arrYesterday = dataArraySecond.map((res) => res[smartKey]);
  let newArr = [];
  for (let i = 0; i < arrYesterday.length; i++) {
    newArr.push(arrToday[i] - arrYesterday[i]);
  }
  return createDifferenceFieldsets(newArr);
}

function createDifferenceFieldsets(fieldsets) {
  return fieldsets.map((field) => createDifferenceField(field));
}

function createDifferenceField(field) {
  return `${field > 0 ? `<p><i class="fas fa-arrow-up"></i> ${field}</p>` : `<p><i class="fas fa-arrow-down"></i> ${field}</p>`}`;
}
