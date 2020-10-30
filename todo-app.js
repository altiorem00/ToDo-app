(function () {
	function createAppTitle(title) {
		let appTitle = document.createElement("h2");
		appTitle.innerHTML = title;
		return appTitle;
	}

	function createTodoItemForm() {
		let form = document.createElement("form");
		let input = document.createElement("input");
		let buttonWrapper = document.createElement("div");
		let button = document.createElement("button");

		form.classList.add("input-group", "mb-3");
		input.classList.add("form-control");
		input.placeholder = "Что на сегодня?";
		buttonWrapper.classList.add("input-group-append");
		button.classList.add("btn", "btn-primary");
		button.textContent = "Добавить дело";

		if (!input.value.length) {
			button.disabled = true;
		} else {
			button.disabled = false;
		}

		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		return {
			form,
			input,
			button,
		};
	}

	function createTodoList() {
		let list = document.createElement("ul");
		list.classList.add("list-group");
		return list;
	}

	function createTodoItem(obj) {
		let item = document.createElement("li");
		let buttonGroup = document.createElement("div");
		let doneButton = document.createElement("button");
		let deleteButton = document.createElement("button");

		item.classList.add(
			"list-group-item",
			"d-flex",
			"justify-content-between",
			"align-items-center"
		);
		if (typeof obj !== "object") {
			item.textContent = obj;
		} else {
			item.textContent = obj.name;
			if (obj.done === true) {
				item.classList.toggle("list-group-item-success");
			}
		}

		buttonGroup.classList.add("btn-group", "btn-group-sm");
		doneButton.classList.add("btn", "btn-success");
		doneButton.textContent = "Готово";
		deleteButton.classList.add("btn", "btn-danger");
		deleteButton.textContent = "Удалить";

		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(buttonGroup);

		return {
			item,
			doneButton,
			deleteButton,
		};
	}

	function createTodoApp(container, title = "Список дел", obj) {
		let todoTitle = createAppTitle(title);
		let todoItemForm = createTodoItemForm();
		let TodoList = createTodoList();

		let storageItemArray = localStorage.getItem(title)
			? JSON.parse(localStorage.getItem(title))
			: [];

		localStorage.setItem(title, JSON.stringify(storageItemArray));
		let data = JSON.parse(localStorage.getItem(title));

		function addToStorage() {
			storageItemArray.push(todoItemForm.input.value);
			localStorage.setItem(title, JSON.stringify(storageItemArray));
		}

		container.append(todoTitle);
		container.append(todoItemForm.form);
		container.append(TodoList);

		if (obj !== undefined) {
			let firstItem = createTodoItem(obj);

			firstItem.doneButton.addEventListener("click", function () {
				firstItem.item.classList.toggle("list-group-item-success");
			});
			firstItem.deleteButton.addEventListener("click", function () {
				if (confirm("Вы уверены?")) {
					firstItem.item.remove();
				}
			});

			TodoList.append(firstItem.item);
		}

		data.forEach((obj) => {
			let dataItem = createTodoItem(obj);

			dataItem.doneButton.addEventListener("click", function () {
				dataItem.item.classList.toggle("list-group-item-success");
			});
			dataItem.deleteButton.addEventListener("click", function () {
				if (confirm("Вы уверены?")) {
					dataItem.item.remove();

					i = data.indexOf(obj);
					if (i >= 0) {
						storageItemArray.splice(i, 1);
						localStorage.setItem(
							title,
							JSON.stringify(storageItemArray)
						);
						data = JSON.parse(localStorage.getItem(title));
					}
				}
			});

			TodoList.append(dataItem.item);
		});

		todoItemForm.form.addEventListener("submit", function (e) {
			e.preventDefault();

			if (!todoItemForm.input.value) {
				return;
			}

			let todoItem = createTodoItem(todoItemForm.input.value);

			todoItem.doneButton.addEventListener("click", function () {
				todoItem.item.classList.toggle("list-group-item-success");
			});
			todoItem.deleteButton.addEventListener("click", function () {
				if (confirm("Вы уверены?")) {
					todoItem.item.remove();
				}
			});

			TodoList.append(todoItem.item);
			addToStorage();

			todoItemForm.input.value = "";
			todoItemForm.button.disabled = true;
		});

		todoItemForm.input.addEventListener("keyup", function () {
			if (!todoItemForm.input.value.length) {
				todoItemForm.button.disabled = true;
			} else {
				todoItemForm.button.disabled = false;
			}
		});
	}

	window.createTodoApp = createTodoApp;
})();
