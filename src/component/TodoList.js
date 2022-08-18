import React, {useEffect, useState, useRef} from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import PaginatedItems from './PaginateItem';

import {getTodoList, createTodoItem} from '../util/backend';

export default function TodoList() {

    const [todoList, setTodoList] = useState([]);
    const [searchTodoList, setSearchTodoList] = useState(todoList);

    const [showForm, setShowForm] = useState(false);
    const searchRef = useRef("");

    useEffect(() => {
        getTodoList().then(todoList => {
            setTodoList(todoList);
            setSearchTodoList(todoList);
        }).catch(error => {
            console.log(error);
        }
        );
    } , []);

    useEffect(() =>{
        setSearchTodoList(todoList.filter(todo => () =>{
            if(todo !== null){
                todo.title.includes(searchRef.current.value);
            }
        }));
    }, [todoList]);

    function handleForm(){
        
        setShowForm(!showForm);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;

        //Hangle empty form submission
        if(form.title === "" || form.userid === ""){
            console.log("Empty form submission");
            return;
        }

        const todoItem = {
            "userId": form.elements.userid.value,
            "id": Math.floor(Math.random() * 1000000),
            "title": form.elements.title.value,
            "completed": false
        };
        createTodoItem(todoItem).then(res => {
            setTodoList([...todoList, todoItem]);
        }).catch(error => {
            console.log(error);
        }
        );

        //Reset form
        form.reset();
        handleForm();
    }

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

    function updateTodo(id, todoItem) {
        setTodoList(todoList.map(todo => {
            if(todo.id === id){
                return todoItem;
            }
            return todo;
        }));
    }

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
                            <Form.Label>Todo:</Form.Label>
                            <Form.Control name="title" type="text" placeholder="Enter Todo" />

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
            <Col style={{paddingTop:"15px"}} >
                <Row>
                    

                    <PaginatedItems deleteTodo={deleteTodo} updateTodo={updateTodo} itemsPerPage={9} items={searchTodoList}/>

                </Row>
            </Col>
        </Container>
        
    </div>
  )
}
