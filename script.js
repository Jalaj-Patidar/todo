let list = [];
let id = 0;

var inp = document.getElementById("inp");
var todolist = document.getElementById("todolist");
var dueDateInput = document.getElementById("dueDate");
var prioritySelect = document.getElementById("prioritySelect");

window.addEventListener("DOMContentLoaded", function () {
  const savedList = localStorage.getItem("todoList");
  if (savedList) {
    list = JSON.parse(savedList);
    showList();
  }
});

document.getElementById("btn").addEventListener("click", function () {
  const taskName = inp.value;
  const category = document.getElementById("categorySelect").value;
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("prioritySelect").value;
  const tags = document.getElementById("tagsInput").value;

  if (taskName === "") {
    alert("Please write something.");
  } else {
    list.push({
      task: taskName,
      done: false,
      category: category,
      dueDate: dueDate,
      priority: priority,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to an array
    });
    inp.value = "";
    tags.innerHTML = "";
    showList();
    saveListToLocalStorage();
  }
});

document
  .getElementById("applyFilterBtn")
  .addEventListener("click", function () {
    applyDateFilter();
  });
document.getElementById("sortBtn").addEventListener("click", function () {
  sortTasks();
});

document
  .getElementById("applyStatusFilterBtn")
  .addEventListener("click", function () {
    applyStatusFilter();
  });

document.getElementById("searchBtn").addEventListener("click", function () {
  searchTask();
});

document.getElementById("tagsSearchBtn").addEventListener("click", function () {
  searchByTags();
});

function searchByTags() {
  const tagsQuery = document.getElementById("tagsSearchInput").value.trim();

  if (tagsQuery !== "") {
    const searchResult = list.filter((item) => hasTags(item.tags, tagsQuery));
    todolist.innerHTML = "";
    searchResult.forEach(function (item, i) {
      todolist.innerHTML +=
        "<div class='task'>" +
        "<input type='checkbox' onclick='markAsDone(" +
        i +
        ")'" +
        (item.done ? " checked" : "") +
        ">" +
        "<span" +
        (item.done ? " style='text-decoration: line-through;'" : "") +
        ">" +
        item.task +
        "</span>" +
        "<span style='margin-left: 10px;'>Category: " +
        item.category +
        "</span>" +
        "<span style='margin-left: 10px;'>Due date: " +
        item.dueDate +
        "</span>" +
        "<span style='margin-left: 10px;'>Priority: " +
        item.priority +
        "</span>" +
        "<span style='margin-left: 10px;'>Tags: " +
        item.tags.join(", ") +
        "</span>" +
        "<a onClick='editItem(" +
        i +
        ")'>edit</a> " +
        "<a onClick='deleteItem(" +
        i +
        ")'>&times;</a>" +
        "</div>";
    });
  } else {
    showList(list);
  }
}

function searchTask() {
  const searchQuery = document.getElementById("searchInput").value.trim();

  if (searchQuery !== "") {
    const searchResult = list.filter((item) =>
      isSimilarWord(item.task.toLowerCase(), searchQuery.toLowerCase())
    );
    todolist.innerHTML = "";
    searchResult.forEach(function (item, i) {
      todolist.innerHTML +=
        "<div class='task'>" +
        "<input type='checkbox' onclick='markAsDone(" +
        i +
        ")'" +
        (item.done ? " checked" : "") +
        ">" +
        "<span" +
        (item.done ? " style='text-decoration: line-through;'" : "") +
        ">" +
        item.task +
        "</span>" +
        "<span style='margin-left: 10px;'>Category: " +
        item.category +
        "</span>" +
        "<span style='margin-left: 10px;'>Due date: " +
        item.dueDate +
        "</span>" +
        "<span style='margin-left: 10px;'>Priority: " +
        item.priority +
        "</span>" +
        "<span style='margin-left: 10px;'>Tags: " +
        item.tags.join(", ") +
        "</span>" +
        "<a onClick='editItem(" +
        i +
        ")'>edit</a> " +
        "<a onClick='deleteItem(" +
        i +
        ")'>&times;</a>" +
        "</div>";
    });
  } else {
    showList(list);
  }
}

function applyDateFilter() {
  const dueDateFrom = new Date(
    document.getElementById("filterDueDateFrom").value
  );
  const dueDateTo = new Date(document.getElementById("filterDueDateTo").value);
  const categoryFilter = document.getElementById("filterCategory").value;
  const priorityFilter = document.getElementById("filterPriority").value;

  // If the date range inputs are empty, set them to null for no filtering
  const startDate = dueDateFrom ? new Date(dueDateFrom) : null;
  const endDate = dueDateTo ? new Date(dueDateTo) : null;

  // Apply date filter
  const filteredByDate = list.filter((item) => {
    if (!startDate && !endDate) {
      return true; // No date filter
    }
    const dueDate = new Date(item.dueDate);
    return (
      (!startDate || dueDate >= startDate) && (!endDate || dueDate <= endDate)
    );
  });

  // Apply category filter
  const filteredByCategory =
    categoryFilter === "all"
      ? filteredByDate
      : filteredByDate.filter((item) => item.category === categoryFilter);

  // Apply priority filter
  const filteredList =
    priorityFilter === "all"
      ? filteredByCategory
      : filteredByCategory.filter((item) => item.priority === priorityFilter);

  todolist.innerHTML = "";
  filteredList.forEach(function (item, i) {
    todolist.innerHTML +=
      "<div class='task'>" +
      "<input type='checkbox' onclick='markAsDone(" +
      i +
      ")'" +
      (item.done ? " checked" : "") +
      ">" +
      "<span" +
      (item.done ? " style='text-decoration: line-through;'" : "") +
      ">" +
      item.task +
      "</span>" +
      "<span style='margin-left: 10px;'>Category: " +
      item.category +
      "</span>" +
      "<span style='margin-left: 10px;'>Due date: " +
      item.dueDate +
      "</span>" +
      "<span style='margin-left: 10px;'>Priority: " +
      item.priority +
      "</span>" +
      "<span style='margin-left: 10px;'>Tags: " +
      item.tags.join(", ") +
      "</span>" +
      "<a onClick='editItem(" +
      i +
      ")'>edit</a> " +
      "<a onClick='deleteItem(" +
      i +
      ")'>&times;</a>" +
      "</div>";
  });
}

function applyStatusFilter() {
  const statusFilter = document.getElementById("statusFilter").value;
  let filteredList = [];

  switch (statusFilter) {
    case "all":
      filteredList = list;
      break;
    case "pending":
      filteredList = list.filter(
        (item) => !item.done && new Date(item.dueDate) >= new Date()
      );
      break;
    default:
      break;
  }

  todolist.innerHTML = "";
  filteredList.forEach(function (item, i) {
    todolist.innerHTML +=
      "<div class='task'>" +
      "<input type='checkbox' onclick='markAsDone(" +
      i +
      ")'" +
      (item.done ? " checked" : "") +
      ">" +
      "<span" +
      (item.done ? " style='text-decoration: line-through;'" : "") +
      ">" +
      item.task +
      "</span>" +
      "<span style='margin-left: 10px;'>Category: " +
      item.category +
      "</span>" +
      "<span style='margin-left: 10px;'>Due date: " +
      item.dueDate +
      "</span>" +
      "<span style='margin-left: 10px;'>Priority: " +
      item.priority +
      "</span>" +
      "<span style='margin-left: 10px;'>Tags: " +
      item.tags.join(", ") +
      "</span>" +
      "<a onClick='editItem(" +
      i +
      ")'>edit</a> " +
      "<a onClick='deleteItem(" +
      i +
      ")'>&times;</a>" +
      "</div>";
  });
}

function sortTasks() {
  const sortOption = document.getElementById("sortOptions").value;

  switch (sortOption) {
    case "dueDate":
      list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "priority":
      list.sort((a, b) => a.priority.localeCompare(b.priority));
      break;
    case "category":
      list.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "task":
      list.sort((a, b) => a.task.localeCompare(b.task));
      break;
    default:
      break;
  }
  showList();
}

function showList() {
  const todolist = document.getElementById("todolist");

  todolist.innerHTML = "";
  list.forEach(function (item, i) {
    todolist.innerHTML +=
      "<div class='task'>" +
      "<input type='checkbox' onclick='markAsDone(" +
      i +
      ")'" +
      (item.done ? " checked" : "") +
      ">" +
      "<span" +
      (item.done ? " style='text-decoration: line-through;'" : "") +
      ">" +
      item.task +
      "</span>" +
      "<span style='margin-left: 10px;'>Category: " +
      item.category +
      "</span>" +
      "<span style='margin-left: 10px;'>Due date: " +
      item.dueDate +
      "</span>" +
      "<span style='margin-left: 10px;'>Priority: " +
      item.priority +
      "</span>" +
      "<span style='margin-left: 10px;'>Tags: " +
      item?.tags?.join(",") +
      "</span>" +
      "<a onClick='editItem(" +
      i +
      ")'>edit</a> " +
      "<a onClick='deleteItem(" +
      i +
      ")'>&times;</a>" +
      "</div>";
  });
}

function deleteItem(i) {
  list.splice(i, 1);
  showList();
  saveListToLocalStorage();
}

function editItem(i) {
  var newValue = prompt("please insert you new value");
  list.splice(i, 1, newValue);
}
function isSimilarWord(word, searchTerm) {
  return word.includes(searchTerm);
}
function hasTags(taskTags, searchTags) {
  const searchTagArray = searchTags
    .split(",")
    .map((tag) => tag.trim().toLowerCase());
  return searchTagArray.some((tag) => taskTags.includes(tag));
}
function saveListToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(list));
}
