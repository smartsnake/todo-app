import React, {useState} from 'react'

import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { updateTodoItem, deleteTodoItem} from '../util/backend';

export default function TodoItem({itemIsSelected, setItemIsSelected, deleteTodo, updateTodo, todoItem}) {

  //isSelected is a boolean that is used to determine if the item is selected or not.
  //If it is selected, the item will allow you to edit its properties.
  const [isSelected, setIsSelected] = useState(false);

  //These are the states that are used to edit the item.
  const [todoUserId, setTodoUserId] = useState(todoItem.userId);
  const [todoTitle, setTodoTitle] = useState(todoItem.title);
  const [todoCompleted, setTodoCompleted] = useState(todoItem.completed);

  const [displayTitle, setDisplayTitle] = useState(todoItem.title.length > 45 ? todoItem.title.substring(0, 45) + "..." : todoItem.title);

  //Handles the edit state of the item.
  function handleSelect() {
    if(!itemIsSelected){
      setIsSelected(true);
      setItemIsSelected(true);
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
      setItemIsSelected(false);
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

      //API doesnt really update the todoItem, so we need to update the state manually
      updateTodo(todoItem.id, updatedTodoItem);

      //Reset form
      setDisplayTitle(todoTitle.length > 45 ? todoTitle.substring(0, 45) + "..." : todoTitle);
      setIsSelected(false);
      setItemIsSelected(false);
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
      setItemIsSelected(false);
    }).catch(error => {
      console.log(error);
    }
    );
  }

  function handleButtonComplete(){
    setTodoCompleted(!todoCompleted);
    handleUpdate();
  }

  return (
    <Container >
    {isSelected ? (
    <Card style={{ height:"240px", width:"100%", textAlign:"left"}}>
          <Card.Body>
            <Card.Text>ID: <input disabled={true} value={todoItem.id}/></Card.Text>
            
            <Card.Text>User ID: <input onChange={event => setTodoUserId(event.target.value)} value={todoUserId}/></Card.Text>
            
            <Card.Text>Title: <input style={{flex:1, width:"80%"}} onChange={event => setTodoTitle(event.target.value)} value={todoTitle}/></Card.Text>
            
              <Button variant="primary" onClick={handleUpdate}>Update</Button>
              {" "}
              <Button variant="danger" onClick={handleDelete}>Delete</Button> 
              {" "}
              <Button variant="secondary" onClick={handleDeselect}>Cancel</Button>
            
          </Card.Body>
      </Card>
      ) : 
      (
      <Card style={{flex:1, height:"240px", width:"100%", textAlign:"left"}}>
          <Card.Body>
            <Card.Text>ID: {todoItem.id}</Card.Text>
            <Card.Text>User ID: {todoItem.userId}</Card.Text>
              {
              todoCompleted ? 
              <Card.Text><strike>{displayTitle}</strike></Card.Text> :
              <Card.Text>{displayTitle}</Card.Text>}

              <Button variant="primary" onClick={handleButtonComplete}>{todoCompleted ? "Not Complete":"Complete"}</Button>

              <Button style={{margin: 25}} variant="primary" onClick={handleSelect}>Edit</Button>
              
          </Card.Body>
      </Card>
    )}  
    
    </Container>
  )
}
