const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainerTabs");
const wrapperUkraineEl = document.getElementById("Ukraine");
const wrapperWorldEl = document.getElementById("World");
const searchFormEl = document.getElementById("searchFormEl");
const generalInformationUkraineEl = document.getElementById("generalInformationUkraine")
const generalInformationWorldEl = document.getElementById("generalInformationWorld")
const keys = ["confirmed", "deaths", "recovered", "existing"];
const currentTime = new Date(Date.now()).toISOString().slice(0, 10);
const yestardayTime = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
let ukraineData = [];
let worldData = [];
let yestardayUkraineData = [];
let yestardayWorldData = [];
let newUkraineSearchFilter = [];
let newWorldSearchFilter = [];
let newUkraineYesterdaySearchFilter = [];
let newWorldYesterdaySearchFilter = [];
let yestardayConfirmed = 0;

wrapperTabsEl.addEventListener("click", (e) => {
  const tab = e.target.closest("button");
  Array.from(wrapperTabsEl.children).forEach((btn) => btn.classList.remove("active"));
  if (tab) {
    tab.classList.add("active");
    const region = tab.dataset.region;
    Array.from(wrapperContainerTabsEl.children).forEach((tabPage) => tabPage.classList.remove("active_tab"));
    document.getElementById(region).classList.add("active_tab");
    renderCoronaData(wrapperUkraineEl, ukraineData, yestardayUkraineData);
    renderCoronaData(wrapperWorldEl, worldData, yestardayWorldData);
  }
});

function currentFetchFromDataCenter() {
  fetch(`https://api-covid19.rnbo.gov.ua/data?to=${currentTime}`)
    .then((res) => res.json())
    .then((data) => {
      ukraineData = data.ukraine;
      worldData = data.world;
      yesterdayFetchFromDataCenter(`https://api-covid19.rnbo.gov.ua/data?to=${yestardayTime}`);
      // renderCoronaData(wrapperUkraineEl, ukraineData, yestardayUkraineData);
      // renderCoronaData(wrapperWorldEl, worldData, yestardayWorldData);
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
      renderCoronaData(wrapperUkraineEl, ukraineData, yestardayUkraineData);
      renderCoronaData(wrapperWorldEl, worldData, yestardayWorldData);
      renderToHtmlGeneralInformation(generalInformationUkraineEl, ukraineData, yestardayUkraineData)
      renderToHtmlGeneralInformation(generalInformationWorldEl, worldData, yestardayWorldData)
    })
    .catch((error) => console.warn(error));
}

function renderToHtmlGeneralInformation(element, dataArrayFirst, dataArraySecond){
  element.insertAdjacentHTML('afterbegin', createHtmlGeneralInformation(dataArrayFirst, dataArraySecond));
}

function createHtmlGeneralInformation(dataArrayFirst, dataArraySecond){
  return `<div class="general-information__confirmed">
                <p>Виявлено:</p>
                <p>${createGeneralInformation(dataArrayFirst, 'confirmed')}</p>
                ${createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'confirmed') ? createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'confirmed') : ''}
            </div>
            <div class="general-information__deaths">
                <p>Померло:</p>
                <p>${createGeneralInformation(dataArrayFirst, 'deaths')}</p>
                ${createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'deaths') ? createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'deaths'): ''}
            </div>
            <div class="general-information__recovered">
                <p>Одужали:</p>
                <p>${createGeneralInformation(dataArrayFirst, 'recovered')}</p>
                ${createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'recovered') ? createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'recovered'): ''}
            </div>
            <div class="general-information__existing">
                <p>Выздровили:</p>
                <p>${createGeneralInformation(dataArrayFirst, 'existing')}</p>
                ${createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'existing') ? createGeneralInformationDifference(dataArrayFirst, dataArraySecond, 'existing') : ''}
            </div>`
}

function createGeneralInformationDifference(dataArrayFirst, dataArraySecond, smartKey) {
  let fieldHtml = '';
  if (createGeneralInformation(dataArrayFirst, [smartKey]) > createGeneralInformation(dataArraySecond, [smartKey])){
    fieldHtml = `<p class="general-information__differnce"><i class="fas fa-arrow-up"></i> ${(createGeneralInformation(dataArrayFirst, [smartKey])) - (createGeneralInformation(dataArraySecond, [smartKey]))}</p>`
  }
  if (createGeneralInformation(dataArrayFirst, [smartKey]) < createGeneralInformation(dataArraySecond, [smartKey])) {
    fieldHtml = `<p class="general-information__differnce"><i class="fas fa-arrow-down"></i> ${(createGeneralInformation(dataArrayFirst, [smartKey])) - (createGeneralInformation(dataArraySecond, [smartKey]))}</p>`
  }
  if (createGeneralInformation(dataArrayFirst, [smartKey]) - createGeneralInformation(dataArraySecond, [smartKey]) === 0) {
    fieldHtml = '<p class="general-information__differnce">-</p>';
  }
  return fieldHtml;
}

function createGeneralInformation(dataArray, smartKey){
  return dataArray.reduce((total, item) => {
    total += item[smartKey]
    return total;
  }, 0)
}

function renderCoronaDataFirst(elemForRender, dataArray) {
  elemForRender.insertAdjacentHTML('beforeend', createDataArrFirst(dataArray).join(''));
}

function createDataArrFirst(dataArray) {
  return dataArray.map((field) => createDataFieldFirst(field));
}

function createDataFieldFirst(field) {
  return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${field?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              ${field?.confirmed}
            </dd>
            <dd class="wrapper-data__deaths">${field?.deaths}</dd>
            <dd class="wrapper-data__recovered">${field?.recovered}</dd>
            <dd class="wrapper-data__existing">${field?.existing}</dd>
          </dl>`;
}

function renderCoronaData(elemForRender, dataArray, dataArrayYestarday) {
  if (dataArrayYestarday.length === 0) renderCoronaDataFirst(elemForRender, dataArray)
  else elemForRender.insertAdjacentHTML('beforeend', createDataArr(dataArray, dataArrayYestarday));
}

function createDataArr(dataArray, dataArrayYestarday) {
  let fieldHtml = '';
  for (let i = 0; i < dataArrayYestarday.length; i++) {
    fieldHtml += createDataField(dataArray[i], dataArrayYestarday[i])
  }
  return fieldHtml;
}

function createDataField(field, fieldYestarday) {
  return `<dl class="wrapper-data">
            <dt class="wrapper-data__country">${field?.label?.uk}</dt>
            <dd class="wrapper-data__confirmed">
              <p>${field?.confirmed}</p>
               ${fieldYestarday ? createArrows(field, fieldYestarday, 'confirmed') : ''}
            </dd >
            <dd class="wrapper-data__deaths">
              <p>${field?.deaths}</p>
               ${fieldYestarday ? createArrows(field, fieldYestarday, 'deaths') : ''}
            </dd >
            <dd class="wrapper-data__recovered">
              <p>${field?.recovered}</p>
               ${fieldYestarday ? createArrows(field, fieldYestarday, 'recovered') : ''}
              </dd >
            <dd class="wrapper-data__existing">
              <p>${field?.existing}</p>
              ${fieldYestarday ? createArrows(field, fieldYestarday, 'existing'):''}
              </dd >
          </dl > `;
}

function createArrows(field, fieldYestarday, smartKey) {
  let confirmed = '';
  if (field[smartKey] > fieldYestarday[smartKey]) {
    confirmed = `<p><i class="fas fa-arrow-up"></i>${(field[smartKey] - fieldYestarday[smartKey])}</p>`
  }
  if (field[smartKey] < fieldYestarday[smartKey]) {
    confirmed = `<p><i class="fas fa-arrow-down"></i>${(field[smartKey] - fieldYestarday[smartKey])}</p>`
  }
  if ((field[smartKey] - fieldYestarday[smartKey]) === 0) {
    // confirmed = `<p>${(field[smartKey] - fieldYestarday[smartKey])}</p>`
    confirmed = '<p>-</p>';
  }
  return confirmed;
}

searchFormEl.addEventListener('keyup', e=> {
  const query = e.target.value.trim().toLowerCase().split(' ').filter(word=>!!word);
  const searchField = ['uk', 'en'];
  newUkraineSearchFilter = ukraineData.filter(country => {
    return query.every(word => {
      return searchField.some(field => {
        return String(country.label[field]).toLowerCase().includes(word)
      })
    })
  })

  newUkraineYesterdaySearchFilter = yestardayUkraineData.filter(country => {
    return query.every(word => {
      return searchField.some(field => {
        return String(country.label[field]).toLowerCase().includes(word)
      })
    })
  })

  newWorldSearchFilter = worldData.filter(country => {
    return query.every(word => {
      return searchField.some(field => {
        return String(country.label[field]).toLowerCase().includes(word)
      })
    })
  })

  newWorldYesterdaySearchFilter = yestardayWorldData.filter(country => {
    return query.every(word => {
      return searchField.some(field => {
        return String(country.label[field]).toLowerCase().includes(word)
      })
    })
  })
})

searchFormEl.addEventListener('submit', e => {
  e.preventDefault();
  renderCoronaData(wrapperUkraineEl, newUkraineSearchFilter, newUkraineYesterdaySearchFilter);
  renderCoronaData(wrapperWorldEl, newWorldSearchFilter, newWorldYesterdaySearchFilter);
  e.target.reset();
})

















// function createSmartKeyForDifferenceCount(dataArrayFirst, dataArraySecond, smartKeys) {
//   return smartKeys.map((smartKey) =>
//     createYestardayData(dataArrayFirst, dataArraySecond, smartKey)
//   );
// }

// function createYestardayData(dataArrayFirst, dataArraySecond, smartKey) {
//   let arrToday = dataArrayFirst.map((res) => res[smartKey]);
//   let arrYesterday = dataArraySecond.map((res) => res[smartKey]);
//   let newArr = [];
//   for (let i = 0; i < arrYesterday.length; i++) {
//     newArr.push(arrToday[i] - arrYesterday[i]);
//   }
//   return createDifferenceFieldsets(newArr);
// }

// function createDifferenceFieldsets(fieldsets) {
//   return fieldsets.map((field) => createDifferenceField(field));
// }

// function createDifferenceField(field) {
//   return `${field > 0 ? `<p><i class="fas fa-arrow-up"></i> ${field}</p>` : `<p><i class="fas fa-arrow-down"></i> ${field}</p>`} `;
// }
