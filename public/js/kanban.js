function addTask() {
  const taskTitle = prompt("Digite o título da nova tarefa:");
  if (taskTitle === null) return; // Verifica se o usuário clicou em "Cancelar"

  const taskDescription = prompt("Digite a descrição da nova tarefa:");
  if (taskDescription === null) return; // Verifica se o usuário clicou em "Cancelar"

  const today = new Date();
  const formattedToday = today.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  let taskDate = prompt(`Digite a data de vencimento da nova tarefa (ex: ${formattedToday}):`);
  if (taskDate === null) return; // Verifica se o usuário clicou em "Cancelar"

  while (!isValidFutureDate(taskDate)) {
    alert("Data inválida ou anterior à data atual. Use o formato DD/MM/AAAA.");
    taskDate = prompt(`Digite a data de vencimento da nova tarefa (ex: ${formattedToday}):`);
    if (taskDate === null) return; // Verifica se o usuário clicou em "Cancelar"
  }

  let taskAssignee = prompt("Digite as iniciais do responsável pela nova tarefa (máximo de 3 caracteres):");
  if (taskAssignee === null) return; // Verifica se o usuário clicou em "Cancelar"
  taskAssignee = taskAssignee.slice(0, 3); // Limita as iniciais a 3 caracteres

  const newTask = document.createElement("div");
  newTask.classList.add("scrum-task", "overflow");
  newTask.setAttribute("draggable", "true");
  newTask.setAttribute("ondragstart", "dragstart(event)");
  newTask.setAttribute("ondragend", "dragEnd(event)");
  newTask.id = Date.now().toString();

  newTask.innerHTML = `
    <span>${taskTitle}</span>
    <div class="scrum-task-description">${taskDescription}</div>
    <div class="scrum-task-date">Due ${taskDate}</div>
    <div class="scrum-task-assignee">
      <span class="assignee">${taskAssignee}</span>
    </div>
    <button onclick="confirmDelete('${newTask.id}')">Excluir</button>
  `;

  document.getElementById("backlog").appendChild(newTask);
}

function isValidFutureDate(dateString) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const [, day, month, year] = dateString.match(regex);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ajusta a hora para garantir comparação correta
  const inputDate = new Date(year, month - 1, day); // Mês no JavaScript é 0-indexado
  
  return inputDate > today;
}

function confirmDelete(taskId) {
  const task = document.getElementById(taskId);
  if (task) {
    const confirmDelete = confirm("Tem certeza de que deseja excluir esta tarefa?");
    if (confirmDelete) {
      task.remove();
    }
  }
}

function dragover(evt) {
  evt.preventDefault();
  evt.dataTransfer.dropEffect = "move";
  evt.target.closest('.scrum-board-column').classList.add('drag-over');
}

function dragLeave(evt) {
  evt.target.closest('.scrum-board-column').classList.remove('drag-over');
}

function dragEnd(evt) {
  document.querySelectorAll('.scrum-board-column').forEach(column => column.classList.remove('drag-over'));
}

function dragstart(evt) {
  evt.dataTransfer.setData("text/plain", evt.target.id);
  evt.dataTransfer.effectAllowed = "move";
}

function drop(evt) {
  evt.preventDefault();
  var data = evt.dataTransfer.getData("text");
  evt.target.closest('.scrum-board-column').appendChild(document.getElementById(data));
  evt.target.closest('.scrum-board-column').classList.remove('drag-over');
}
