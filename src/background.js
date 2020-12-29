"use strict"

chrome.runtime.onInstalled.addListener((details) => {
  if (["install", "update"].includes(details.reason)) {
    const query = new URLSearchParams({
      event: details.reason,
      version: chrome.runtime.getManifest().version,
    })

    chrome.tabs.create({
      url: `${chrome.runtime.getURL("options.html")}?${query.toString()}`,
    })
  }

  ;[
    "features-assignments-coloring",
    "features-autosave-reports",
    "features-deadline-highlighting",
    "features-remove-confirmation",
    "features-filter-courses",
  ].map((key) => {
    chrome.storage.sync.get([key], (result) => {
      if (result[key] === undefined) {
        chrome.storage.sync.set({ [key]: true })
      }
    })
  })

  chrome.contextMenus.create({
    id: "respon",
    type: "normal",
    contexts: ["selection"],
    title: "Open this code in Respon",
  })
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "openOptionsPage") {
    chrome.runtime.openOptionsPage()
  }
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (
    info.menuItemId === "respon" &&
    tab.url.includes("manaba.tsukuba.ac.jp")
  ) {
    chrome.tabs.sendMessage(tab.id, { kind: "open-in-respon" })
  }
})

chrome.commands.onCommand.addListener((cmd, tab) => {
  switch (cmd) {
    case "manaba-enhanced:open-in-respon": {
      chrome.tabs.sendMessage(tab.id, { kind: "open-in-respon" })
      break
    }
  }
})
