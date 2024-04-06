const API_KEY = "3a838078ed6ec853b1b21af2cb50ca8c";
const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";
const TODO_KEY = "todos";
const clock = document.querySelector("#clock");
const images = ["image1.jpg","image2.jpg","image3.jpg","image4.jpg","image5.jpeg"];
const chosenImage = images[Math.floor(Math.random()*images.length)];
const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-form input");
const todoList = document.querySelector("#todo-list");
let todos = [];

const getClock = () => {
	const date = new Date();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	clock.innerText = `${hours}:${minutes}:${seconds}`;
}
const onGeoOk = (position) => {
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	const url =  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
	fetch(url)
	.then(res => res.json()
	.then(data=>{
		const weather = document.querySelector("#weather span:first-child");
		const city = document.querySelector("#weather span:last-child");
		city.innerText = data.name;
		weather.innerText = data.weather[0].main;
	}));
}
const onGeoError = () => {
	alert("Can't find you. No weather for you.")
}
const onLoginSubmit = (e) => {
	e.preventDefault();
	loginForm.classList.add(HIDDEN_CLASSNAME);
	const username = loginInput.value;
	localStorage.setItem(USERNAME_KEY, username);
	printGreetings(username);
}
const printGreetings = (name) => {
	greeting.innerText = `Hello, ${name}!`;
	greeting.classList.remove(HIDDEN_CLASSNAME);
}
const saveTodos = () => {
	localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}
const deleteTodos = (e) => {
	const li = e.target.parentElement;
	li.remove();
	todos = todos.filter((todo) => todo.id !== parseInt(li.id));
	saveTodos();
}
const paintTodo = (newTodo) => {
	const li = document.createElement("li");
	li.id = newTodo.id;
	const span = document.createElement("span");
	span.innerText = newTodo.text;
	const button = document.createElement("button");
	button.innerText = "❌";
	button.addEventListener("click", deleteTodos);
	li.appendChild(span);
	li.appendChild(button);
	todoList.appendChild(li);
}
const handleTodoSubmit = (e) => {
	e.preventDefault();
	const newTodo = todoInput.value;
	todoInput.value = "";
	const newTodoObj = {
		text: newTodo,
		id: Date.now(),
	};
	todos.push(newTodoObj);
	paintTodo(newTodoObj);
	saveTodos();
}

//배경 랜덤이미지
document.body.style.backgroundImage = `url('src/img/${chosenImage}')`;

//시계
getClock();
setInterval(getClock, 1000);

//위치,날씨
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);

//로그인
const savedUsername = localStorage.getItem(USERNAME_KEY);
if(savedUsername === null) {
	loginForm.classList.remove(HIDDEN_CLASSNAME);
	loginForm.addEventListener("submit", onLoginSubmit);
} else {
	printGreetings(savedUsername);
}

//투두리스트
todoForm.addEventListener("submit", handleTodoSubmit);
const savedTodos = localStorage.getItem(TODO_KEY);
if(savedTodos !== null) {
	const parsedTodos = JSON.parse(saveTodos);
	todos = parsedTodos;
	parsedTodos.forEach(paintTodo);
}