import React, {useState, useRef} from 'react';
import useFetch from "../hooks/useFetch.js";
import {BASE_URL} from "../hooks/variables.js";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";
import {Button, Empty, notification, Skeleton} from "antd";
import {useNavigate} from "react-router-dom";
import {openModal} from "../redux/features/modalSlice.js";
import {useDispatch} from "react-redux";


const Board = () => {
  const [refetch, setRefetch] = useState(false)
  const {data, loading, error} = useFetch(`${BASE_URL}`, refetch)
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const status = [
    {
      text: "todo",
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list-check"
             viewBox="0 0 16 16">
          <path fillRule="evenodd"
                d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0zm0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0z"/>
        </svg>)
    },
    {
      text: "progress",
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-clock-history" viewBox="0 0 16 16">
        <path
          d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"/>
        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"/>
        <path
          d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"/>
      </svg>)
    },
    {
      text: 'complete',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
             className="bi bi-check-circle-fill" viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      )
    }
  ]


  const handleDragEnd = (result) => {
    const {destination, source, draggableId} = result;
    if (source.droppableId == destination.droppableId) return;
    if (source.droppableId !== destination.droppableId) {
      const oneData = data.filter((j) => j.id == draggableId)[0]
      axios.put(`${BASE_URL}/${draggableId}`, {
        title: oneData.title,
        desc: oneData.desc,
        file: oneData.file,
        date: oneData.date,
        status: destination.droppableId
      })
        .then((res) => {
          if (res.status === 200) {
            notification.open({
              message: 'Task status edited successfully',
            });
            setRefetch(!refetch)
          }
        })
    }
  }
  const addTask = () => {
    navigate('/')
    dispatch(openModal())
  }

  if (loading) {
    return <Skeleton active={true}/>
  }
  return (
    <div className={"tasks"}>
      <Button onClick={()=>addTask()} type={"primary"}>+ Add Task</Button>
      <div className="board_cards">
        {data?.length>=1 && <DragDropContext onDragEnd={handleDragEnd}>
          {status.map((statusItem, statusIndex) => {
            return (
              <Droppable key={statusIndex} droppableId={statusItem.text}>
                {(provided, snapshot) => (
                  <div key={statusIndex}
                       className="board_card"
                       ref={provided.innerRef}
                       {...provided.droppableProps}
                       isDraggingOver={snapshot.isDraggingOver}
                  >
                    <div className={`status_top ${statusItem.text}`}>
                      <h1>{statusItem.text}</h1>
                      {statusItem.svg}
                    </div>
                    {
                      data?.filter((d) => d.status == statusItem.text).map((d, i) => {
                        return (
                          <Draggable draggableId={`${d.id}`} key={i} index={i}>
                            {(provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                isDragging={snapshot.isDragging}
                                className="card_item"
                              >
                                <p className="title">{d.title}</p>
                                {d?.file && <img src={d.file} alt=""/>}
                                <p>{d?.desc}</p>
                                <p className="date">{d?.date?.slice(0, 10)}</p>
                              </div>
                            )}

                          </Draggable>
                        )
                      })
                    }
                  </div>
                )}

              </Droppable>
            )
          })}
        </DragDropContext>}
      </div>
      {
        data?.length==0 && <Empty description={"Task list is empty"}/>
      }

    </div>
  );
};

export default Board;
