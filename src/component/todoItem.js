import React, {useState} from 'react'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { updateTodoItem, deleteTodoItem} from '../util/backend';

export default function TodoItem({deleteTodo, updateTodo, todoItem}) {

  const [isSelected, setIsSelected] = useState(false);

  const [todoUserId, setTodoUserId] = useState(todoItem.userId);
  const [todoTitle, setTodoTitle] = useState(todoItem.title);
  const [todoCompleted, setTodoCompleted] = useState(todoItem.completed);


  function handleSelect() {
    if(!isSelected){
      setIsSelected(true);
    }
  }
  function handleDeselect() {

    //Reset form
    setTodoUserId(todoItem.userId);
    setTodoTitle(todoItem.title);
    setTodoCompleted(todoItem.completed);
    if(isSelected){
      setIsSelected(false);
    }
  }
  function handleUpdate() {
    const updatedTodoItem = {
      "userId": todoUserId,
      "id": todoItem.id,
      "title": todoTitle,
      "completed": todoCompleted
    };
    updateTodoItem(todoItem.id, updatedTodoItem).then(res => {
      console.log(res);


      //API doesnt really update the todoItem, so we need to update the state manually
      updateTodo(todoItem.id, updatedTodoItem);
      setIsSelected(false);
    }).catch(error => {
      console.log(updatedTodoItem);
      console.log("ID: " + todoItem.id + " ERROR: " + error);
    }
    );
  }
  function handleDelete() {
    deleteTodoItem(todoItem.id).then(res => {
      console.log(res);
      deleteTodo(todoItem.id);
    }).catch(error => {
      console.log(error);
    }
    );
  }

  return (
    <Container onClick={handleSelect}>
    {isSelected ? (
    <Card style={{ height:"240px", width:"100%", textAlign:"left"}}>
          <Card.Body>
            <Card.Text>ID: <input disabled={true} value={todoItem.id}/></Card.Text>
            
            <Card.Text>User ID: <input onChange={event => setTodoUserId(event.target.value)} value={todoUserId}/></Card.Text>
            
            <Card.Text>Title: <input style={{flex:1, width:"80%"}} onChange={event => setTodoTitle(event.target.value)} value={todoTitle}/></Card.Text>
            
            <Card.Text>Completed: 
              <input type="checkbox" onChange={() => setTodoCompleted(!todoCompleted)} defaultChecked={todoCompleted}/> 
              {" "}
              <Button variant="primary" onClick={handleUpdate}>Update</Button>
              {" "}
              <Button variant="danger" onClick={handleDelete}>Delete</Button> 
              {" "}
              <Button variant="secondary" onClick={handleDeselect}>Cancel</Button>
            </Card.Text>
            
          </Card.Body>
      </Card>
      ) : 
      (
      <Card style={{flex:1, height:"240px", width:"100%", textAlign:"left"}}>
          <Card.Body>
            <Card.Text>ID: {todoItem.id}</Card.Text>
            <Card.Text>User ID: {todoItem.userId}</Card.Text>
              {todoItem.completed ? <Card.Text><strike>{todoItem.title}</strike></Card.Text> :<Card.Text>{todoItem.title}</Card.Text>}
          </Card.Body>
      </Card>
    )}  
    
    </Container>
  )
}
