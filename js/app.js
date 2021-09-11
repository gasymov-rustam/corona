const wrapperTabsEl = document.getElementById("wrapperTabs");
const wrapperContainerTabsEl = document.getElementById("wrapperContainerTabs");

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
