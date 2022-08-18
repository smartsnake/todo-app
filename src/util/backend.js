const endpoint = "https://jsonplaceholder.typicode.com/todos";

export async function getTodoList() {
    return fetch(endpoint).then(res => res.json());
}


export async function getTodoItem(id) {
    return fetch(endpoint + "/" + id).then(res => res.json());
}

export async function createTodoItem(todoItem) {
    console.log(todoItem);
    return fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(todoItem)
    }).then(res => res.json());
}


export async function updateTodoItem(id, todoItem) {
    return fetch(endpoint + "/" + id, {
        method: "PATCH",
        body: JSON.stringify(todoItem)
    }).then(res => res.json());
}

export async function deleteTodoItem(id){
    return fetch(endpoint + "/" + id, {
        method: "DELETE"
    }).then(res => res.json());
}
