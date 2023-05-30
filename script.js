const headWrapper = document.querySelector('.head-wrapper'),
switchBtn = document.querySelector('.icon-toggler'),
inputField = document.querySelector('.input-field'),
newTodoBtn = document.querySelector('.check-new-todo'),
newTodo = document.querySelector('.new-todo'),
todoList = document.querySelector('.todos-list'),
leftItemsNum = document.querySelector('.left-items'),
leftItemsNumDesk = document.querySelector('.d-left-items'),
clearCompletedBtn = document.querySelector('.clear-completed-todo'),
clearCompletedDeskBtn = document.querySelector('.d-clear-completed-todo'),
allBtn = document.querySelector('.all-btn');
activeBtn = document.querySelector('.active'),
completedBtn = document.querySelector('.completed');


let todosNum = localStorage.getItem('itemLeft')||0;
let switchFlag =JSON.parse(localStorage.getItem('switchFlag'))|| false;
let draggedElem;

const todosArr = JSON.parse(localStorage.getItem('todosArr')) || [];


clearCompletedDeskBtn.addEventListener('click', ()=>{
    clearCompletedBtn.click();
})

newTodoBtn.addEventListener('change', (e)=>{
    if(e.currentTarget.checked){
        newTodo.disabled=false;
        newTodo.focus();
    }else{
        newTodo.disabled=true;
    }
})

if(todosArr.length){
    for (let i = 0; i <todosArr.length; i++) {
        let idV = `li${i+1}`;
        addNewTodo(idV, todosArr[i].task, todosArr[i].isChecked);
    }
};

if(switchFlag){
    switchedFun(switchBtn);
}

switchBtn.addEventListener('click', ()=>{
    switchFlag = !switchFlag;
    switchedFun(switchBtn);
})

function switchedFun(btn){
    btn.classList.toggle('icon-switch');
    document.querySelector('body').classList.toggle('switch');
    headWrapper.classList.toggle('head-src');
    localStorage.setItem('switchFlag', JSON.stringify(switchFlag));
}

todoList.addEventListener("drag", (dragEvent) => {
    draggedElem = dragEvent.target.closest(".todos-list > [draggable]");
    });

    todoList.addEventListener("dragover", (event) => {
    event.preventDefault();
    });

    todoList.addEventListener("drop", (dropEvent) => {
    dropEvent.preventDefault();
    const target = dropEvent.target.closest(".todos-list > [draggable]");
    const temp = new Text("");
    target.before(temp);
    draggedElem.replaceWith(target);
    temp.replaceWith(draggedElem);

    const firstIdx = Array.from(
        todoList.children
    ).indexOf(draggedElem);

    const secondIdx = Array.from(
        todoList.children
    ).indexOf(target);

    [todosArr[todosArr.length -1- firstIdx], todosArr[todosArr.length -1-secondIdx]]=
    [todosArr[todosArr.length -1-secondIdx], todosArr[todosArr.length -1-firstIdx]];

    
    localStorage.setItem('todosArr', JSON.stringify(todosArr));
});


allBtn.addEventListener('click', ()=>{
    todosTypesFn(allBtn);
})

activeBtn.addEventListener('click', ()=>{
    todosTypesFn(activeBtn);
})

completedBtn.addEventListener('click', ()=>{
    todosTypesFn(completedBtn);
})

function todosTypesFn(btn){
    allBtn.style.color='hsl(234, 11%, 52%)';
    activeBtn.style.color='hsl(234, 11%, 52%)';
    completedBtn.style.color='hsl(234, 11%, 52%)';

    btn.style.color = 'hsl(220, 98%, 61%)';

    if(btn === allBtn){
        document.querySelectorAll('.todo').forEach(li=>{
            li.style.display='flex';
        })
    }
    else if(btn === activeBtn){
        document.querySelectorAll('.todo').forEach(li=>{
            li.style.display='flex';
        })

        document.querySelectorAll('.completed-task').forEach(li=>{
            li.style.display='none';
        })
    }

    else if(btn === completedBtn){
        document.querySelectorAll('.todo').forEach(li=>{
            if(!li.classList.contains('completed-task') && li.classList.contains('todo')&& li.classList.length<2){
                li.style.display='none';
            }else{
                li.style.display='flex';
            }
        })
    }
}

clearCompletedBtn.addEventListener('click', ()=>{
    const completedTasks = document.getElementsByClassName('completed-task');


    leftItemsNum.textContent = todosNum;
    leftItemsNumDesk.textContent = todosNum;

    while(completedTasks[0]){
        const indx = Array.from(
            todoList.children
        ).indexOf(completedTasks[0]);


        todosArr[indx].isChecked=false;
        todosArr.splice(todosArr.length-1-indx,1)
        localStorage.setItem('todosArr', JSON.stringify(todosArr))

        completedTasks[0].parentNode.removeChild(completedTasks[0]);
    }
})

todoList.addEventListener('change', (e)=>{
    if(e.target.classList.contains('check-todo')){
        const indx = Array.from(
            todoList.children
        ).indexOf(e.target.parentElement.parentElement);

        if(e.target.checked){
            todosNum--;
            leftItemsNum.textContent = todosNum;
            leftItemsNumDesk.textContent = todosNum;

            e.target.parentElement.parentElement.classList.add('completed-task');

            e.target.nextElementSibling.classList.toggle('local-todo-msg')

            todosArr[todosArr.length -1 -indx].isChecked=true;
            localStorage.setItem('itemLeft',`${todosNum}`);
        }else{
            todosNum++;
            leftItemsNum.textContent = todosNum;
            leftItemsNumDesk.textContent = todosNum;

            e.target.parentElement.parentElement.classList.remove('completed-task');

            e.target.nextElementSibling.classList.toggle('local-todo-msg')

            todosArr[todosArr.length - 1-indx].isChecked=false;
            localStorage.setItem('itemLeft',`${todosNum}`);
        }

        localStorage.setItem('todosArr',JSON.stringify(todosArr));
    }
})

todoList.addEventListener('click', (e)=>{
    if(e.target.classList.contains('remove-todo')){
        const indx = Array.from(
            todoList.children
        ).indexOf(e.target.parentElement);


        todosArr[indx].isChecked=false;
        todosArr.splice(todosArr.length-1-indx,1)
        localStorage.setItem('todosArr', JSON.stringify(todosArr));

        todoList.removeChild(e.target.parentElement);

        if(!e.target.previousElementSibling.firstElementChild.checked){
            if(todosNum) todosNum--;
        }
        localStorage.setItem('itemLeft', `${todosNum}`);
        leftItemsNum.textContent = todosNum;
        leftItemsNumDesk.textContent = todosNum;
    }
})

inputField.addEventListener('keyup', (e)=>{
    e.preventDefault();

    if(e.keyCode === 13 ){
        todosNum++;
        const saveTodos = {};
        saveTodos.task = newTodo.value;
        saveTodos.isChecked = false;

        addNewTodo('', newTodo.value);

        todosArr.push(saveTodos);

        localStorage.setItem('todosArr', JSON.stringify(todosArr));
        localStorage.setItem('itemLeft',`${todosNum}`);
    }
})


function addNewTodo(idVal, todoVal, isChecked){
    if(todoVal=='')return;
    const li = document.createElement('li');
    li.classList.add('todo');
    li.draggable = 'true';
    li.id= idVal || `li${todosNum}`;

    if(isChecked){
        li.classList.add('completed-task');
        li.innerHTML=`
        <div>
            <input type="checkbox" class="check-todo" name='check-todo'
            checked>
            <p class="todo-msg local-todo-msg">
                ${todoVal}
            </p>
        </div>
        <img src="images/icon-cross.svg" alt="remove todo" class="remove-todo">
    `;
    }else{
        li.innerHTML=`
        <div>
            <input type="checkbox" class="check-todo" name='check-todo'>
            <p class="todo-msg">
                ${todoVal}
            </p>
        </div>
        <img src="images/icon-cross.svg" alt="remove todo" class="remove-todo">
    `;
    }


    todoList.prepend(li);
    newTodo.value = '';

    leftItemsNum.textContent = todosNum;
    leftItemsNumDesk.textContent = todosNum;
}