import React, {useEffect, useState, useRef} from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import PaginatedItems from './PaginateItem';

import {getTodoList, createTodoItem} from '../util/backend';

export default function TodoList() {

    const [todoList, setTodoList] = useState([]);
    const [searchTodoList, setSearchTodoList] = useState(todoList);

    const [showForm, setShowForm] = useState(false);
    const searchRef = useRef("");

    //Get the todo list from the database and filter it by the search term.
    //This is called when the component is first rendered.
    useEffect(() => {
        getTodoList().then(todoList => {
            //Get the todo list from the database.
            setTodoList(todoList);
            //Filter the todo list by the search term.
            setSearchTodoList(todoList);
        }).catch(error => {
            console.log(error);
        }
        );
    } , []);

    //Filter the todo list by the search term.
    useEffect(() =>{
        setSearchTodoList(todoList.filter(todo => () =>{
            if(todo !== null){
                todo.title.includes(searchRef.current.value);
            }
        }));
    }, [todoList]);

    //Show/hide form that allows you to create new todo item.
    function handleForm(){
        
        setShowForm(!showForm);
    }

    //Create a new todo item in the database.
    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;

        //Hangle empty form submission
        if(form.title === "" || form.userid === ""){
            console.log("Empty form submission");
            return;
        }

        //Create a new todo item.
        //The id is randomly generated because the API always returns {id:201}
        const todoItem = {
            "userId": form.elements.userid.value,
            "id": Math.floor(Math.random() * (1000 - todoList.length + 1) + todoList.length),
            "title": form.elements.title.value,
            "completed": false
        };
        //Create the item in the database.
        createTodoItem(todoItem).then(res => {
            //Add the item to the state.
            console.log(res);

            setTodoList([todoItem,...todoList]);
        }).catch(error => {
            console.log(error);
        }
        );

        //Reset form
        form.reset();
        handleForm();
    }

    //Anytime the search term changes, filter the todo list by the search term.
    function handleSearch(event) {
        event.preventDefault();
        const search = event.target.value;

        //If search is empty, reset todoList
        if(search === ""){
            setSearchTodoList(todoList);
            return;
        }
        const filteredList = todoList.filter(todoItem => todoItem.title.includes(search));
        setSearchTodoList(filteredList);
    }

    //Updates the todo item in the state.
    function updateTodo(id, todoItem) {
        setTodoList(todoList.map(todo => {
            if(todo.id === id){
                return todoItem;
            }
            return todo;
        }));
    }

    //Delete the todo item from the state.
    function deleteTodo(id) {
        setTodoList(todoList.filter(todo => todo.id !== id));
    }


  return (
    <div>
        <div><h1>Todo List</h1></div>
        <Container>
            <Row style={{paddingLeft:"25px"}}>
                <Row style={{paddingBottom:"15px"}}>
                    {showForm ? (
                    <Card style={{padding:"25px", width:"100%" , textAlign:"left"}}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEditTodo" />
                            <Form.Label>Title:</Form.Label>
                            <Form.Control name="title" type="text" placeholder="Enter Title" />

                            <Form.Label>User ID:</Form.Label>
                            <Form.Control name="userid" type="text" placeholder="Enter user ID" />
                            
                            <div style={{paddingTop:"25px"}}>
                                <Button type="submit">Add ToDo</Button>
                            </div>

                        </Form>
                    </Card>) : null}
                </Row>
                <Col xs={2}>
                    <Button style={{flex:1, width:"100%", height:"100%"}} variant={showForm ? "secondary" : "primary"} onClick={() => handleForm()}>{showForm ? "Cancel" : "Create ToDo"}</Button>
                </Col>
                <Col>
                    <input style={{flex:1, width:"100%", height:"100%", borderRadius: 15 }} ref={searchRef} onChange={handleSearch} placeholder='Search'/>
                </Col>
            </Row>
            <Col style={{paddingTop:"15px", alignItems:"center", alignContent:"center", alignSelf:"center"}} >
                <ListGroup horizontal as="ul">
                    <ListGroup.Item as="li" style={{width:"7%", backgroundColor:"lightgrey"}}>ID</ListGroup.Item>
                    <ListGroup.Item as="li" style={{width:"7%", backgroundColor:"lightgrey"}}>UserID</ListGroup.Item>
                    <ListGroup.Item as="li" style={{width:"100%", backgroundColor:"lightgrey"}}>Title</ListGroup.Item>
                </ListGroup>
                    
                    <PaginatedItems deleteTodo={deleteTodo} updateTodo={updateTodo} itemsPerPage={16} items={searchTodoList}/>

            </Col>
        </Container>
        
    </div>
  )
}
