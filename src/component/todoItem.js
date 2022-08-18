import React, {useState} from 'react'

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import { updateTodoItem, deleteTodoItem} from '../util/backend';

export default function TodoItem({itemIsSelected, setItemIsSelected, deleteTodo, updateTodo, todoItem}) {

  //isSelected is a boolean that is used to determine if the item is selected or not.
  //If it is selected, the item will allow you to edit its properties.
  const [isSelected, setIsSelected] = useState(false);

  //These are the states that are used to edit the item.
  const [todoUserId, setTodoUserId] = useState(todoItem.userId);
  const [todoTitle, setTodoTitle] = useState(todoItem.title);
  const [todoCompleted, setTodoCompleted] = useState(todoItem.completed);

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
      console.log(res);

      //API doesnt really update the todoItem, so we need to update the state manually
      updateTodo(todoItem.id, updatedTodoItem);

      //Reset form
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

  return (
    <Container onClick={handleSelect}>
    {isSelected ? (
    <ListGroup horizontal as="ul">
            <ListGroup.Item as="li" style={{width:"7%"}}><input style={{width:"80%"}} disabled={true} value={todoItem.id}/></ListGroup.Item>
            
            <ListGroup.Item as="li" style={{width:"7%"}}><input style={{width:"80%"}} onChange={event => setTodoUserId(event.target.value)} value={todoUserId}/></ListGroup.Item>
            
            <ListGroup.Item as="li" style={{width:"75%"}} >
              <input style={{flex:1, width:"80%", paddingRight:"10px"}} onChange={event => setTodoTitle(event.target.value)} value={todoTitle}/>
              Completed: <input type="checkbox" onChange={() => setTodoCompleted(!todoCompleted)} defaultChecked={todoCompleted}/>
            </ListGroup.Item>
            
            {/* <ListGroup.Item as="li">
               
              
            </ListGroup.Item> */}
            <ListGroup.Item as="li" style={{width:"25%"}}>
              <Button variant="primary" onClick={handleUpdate}>Update</Button>
              {" "}
              <Button variant="danger" onClick={handleDelete}>Delete</Button> 
              {" "}
              <Button variant="secondary" onClick={handleDeselect}>Cancel</Button>
            </ListGroup.Item>
      </ListGroup>
      ) : 
      (
      <ListGroup horizontal as="ul">
            <ListGroup.Item as="li" style={{width:"7%"}}>{todoItem.id}</ListGroup.Item>
            <ListGroup.Item as="li" style={{width:"7%"}}>{todoItem.userId}</ListGroup.Item>
              {todoItem.completed ? <ListGroup.Item as="li" style={{width:"100%"}}><strike>{todoItem.title}</strike></ListGroup.Item> :<ListGroup.Item as="li" style={{width:"100%"}}>{todoItem.title}</ListGroup.Item>}
      </ListGroup>
    )}  
    
    </Container>
  )
}
