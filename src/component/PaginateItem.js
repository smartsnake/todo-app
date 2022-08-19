import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Col from 'react-bootstrap/Col';

import TodoItem from './todoItem';

export default function PaginatedItems({itemIsSelected, setItemIsSelected, deleteTodo, updateTodo, itemsPerPage, items }) {
    // We start with an empty list of items.
    const [currentItems, setCurrentItems] = useState(items);
    const [pageCount, setPageCount] = useState(0);
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);
  
    useEffect(() => {
      // Fetch items from another resources.
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }, [itemOffset, itemsPerPage, items]);
  
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      console.log(
        `User requested page number ${event.selected}, which is offset ${newOffset}`
      );
      setItemIsSelected(false);
      setItemOffset(newOffset);
    };
  
    return (
        <>
        {currentItems.map(todoItem => (
              todoItem == null ? null : (
                        <Col lg={4} md={6} sm={12} xs={12} key={todoItem.id}>
                            <TodoItem 
                            itemIsSelected={itemIsSelected}
                            setItemIsSelected={setItemIsSelected}
                            deleteTodo={deleteTodo} 
                            updateTodo={updateTodo} 
                            todoItem={todoItem}/>
                        </Col>
                        )
                    ))}
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          activeClassName="page-active"
          previousLabel="< previous"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          renderOnZeroPageCount={null}
        />

        </>
    );
  }