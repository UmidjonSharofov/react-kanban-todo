import React, {useState} from 'react';
import useFetch from "../hooks/useFetch.js";
import {useSelector, useDispatch} from 'react-redux'
import {Button, message, Modal, notification, Popconfirm, Skeleton, Space, Table} from 'antd';
import axios from "axios";
import {BASE_URL} from "../hooks/variables.js";
import AddTask from "../components/AddTask.jsx";
import {closeModal, openModal} from "../redux/features/modalSlice.js";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const List = () => {
  const modal = useSelector((state) => state.modal.isOpen)
  const dispatch = useDispatch()
  const [refetch, setRefetch] = useState(false)
  const {data, loading, error} = useFetch(`${BASE_URL}`, refetch)
  const [id, setId] = useState(null)
  const showModal = () => {
    dispatch(openModal())
  };

  const handleCancel = () => {
    dispatch(closeModal())
  };

  const editModal = (id) => {
    setId(id)
    showModal()
  }

  const initialData = data?.map((item, i) => {
    return {
      key: (i + 1).toString(),
      name: item.title,
      desc: item.desc,
      id: item.id,
      file: item.file,
      date: item.date
    }
  })
  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <h6>{text}</h6>,
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
      render: (text) => <h6>{text}</h6>,
    },
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      render: (text) => <>
        {text?<img className="table_img" src={text} alt=""/>:null}
      </>,
    },
    {
      title: 'Due Date',
      dataIndex: 'date',
      key: 'date',
      render: (text,record) => <div className="rounded_picker">{(text && text.length > 4) ?
        <DatePicker onChange={(date) => changeDate(date,record)} selected={new Date(text)}/> : null}</div>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => editModal(record.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 className="bi bi-pencil-fill" viewBox="0 0 16 16">
              <path
                d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
            </svg>
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="danger">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   className="bi bi-trash-fill" viewBox="0 0 16 16">
                <path
                  d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
              </svg>
            </Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  const changeDate = (date,item) => {
    axios.put(`${BASE_URL}/${item.id}`, {
      title:item.name,
      desc:item.desc,
      file:item.file,
      date:date
    })
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          notification.open({
            message: 'Task edited successfully',
          });
          dispatch(closeModal())
          setRefetch(true)
        }
      })

  }

  const confirm = (id) => {
    axios.delete(`${BASE_URL}/${id}`)
      .then((res) => {
        if (res.status === 200) {
          message.success('Task deleted');
          setRefetch(!refetch)
        }

      })
      .catch((err) => {
        console.log(err)
      })

  };


  return (
    <div className='list'>
      <div className="top">
        <h2>List</h2>
        <Button onClick={showModal} type="primary">+ Task</Button>
      </div>
      {loading ?
        <Skeleton
          active={true}
        />
        :
        <Table bordered={true} columns={columns} dataSource={initialData}/>
      }

      <Modal
        destroyOnClose={true}
        title={!id ? "Add Task" : "Edit Task"}
        open={modal}
        okText={"Save"}
        cancelText={"Close"}
        footer={false}
        onCancel={handleCancel}
      >
        <AddTask taskId={id} refetch={refetch} setRefetch={setRefetch}/>
      </Modal>
    </div>
  );
};

export default List;


