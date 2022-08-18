import React, {useState} from 'react'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { updateTodoItem, deleteTodoItem} from '../util/backend';

export default function TodoItem({deleteTodo, updateTodo, todoItem}) {

  //isSelected is a boolean that is used to determine if the item is selected or not.
  //If it is selected, the item will allow you to edit its properties.
  const [isSelected, setIsSelected] = useState(false);

  //These are the states that are used to edit the item.
  const [todoUserId, setTodoUserId] = useState(todoItem.userId);
  const [todoTitle, setTodoTitle] = useState(todoItem.title);
  const [todoCompleted, setTodoCompleted] = useState(todoItem.completed);

  //Handles the edit state of the item.
  function handleSelect() {
    if(!isSelected){
      setIsSelected(true);
    }
  }
  //Handles the cancel state of the item.
  function handleDeselect() {

    //Reset form
    setTodoUserId(todoItem.userId);
    setTodoTitle(todoItem.title);
    setTodoCompleted(todoItem.completed);
    if(isSelected){
      setIsSelected(false);
    }
  }

  //Handles the update state of the item.
  function handleUpdate() {
    const updatedTodoItem = {
      "userId": todoUserId,
      "id": todoItem.id,
      "title": todoTitle,
      "completed": todoCompleted
    };
    //Update the item in the database.
    updateTodoItem(todoItem.id, updatedTodoItem).then(res => {
      console.log(res);


      //API doesnt really update the todoItem, so we need to update the state manually
      updateTodo(todoItem.id, updatedTodoItem);
      //Reset form
      setIsSelected(false);
    }).catch(error => {
      console.log("ID: " + todoItem.id + " ERROR: " + error);
    }
    );
  }
  //Handles the delete state of the item.
  function handleDelete() {
    //Delete the item in the database.
    deleteTodoItem(todoItem.id).then(res => {
      console.log(res);
      //Delete the item from the state.
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
