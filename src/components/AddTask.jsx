import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL} from "../hooks/variables.js";
import {Button, Form, Input, notification} from "antd";
import useFetch from "../hooks/useFetch.js";
import {closeModal} from "../redux/features/modalSlice.js";
import {useDispatch} from "react-redux";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


const AddTask = ({taskId: id, setRefetch,refetch}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [file, setFile] = useState(null)
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false)
  const {data, loading, error} = useFetch(`${BASE_URL}/${id}`)
  const [status,setStatus]=useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        desc: data.desc,
      });
      setFile(data.file)
      if (data.date && data.date.length>4){
        setStartDate(new Date(data.date))
      }
      if (data.status){
        setStatus(data.status)
      }
    }
  }, [data])

  const changeFile = (e) => {
    let files = e.target.files;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);

    fileReader.onload = (event) => {
      setFile(event.target.result)
    }
  }

  const onFinish = (values) => {
    setLoad(true)
    if (!id) {
      axios.post(`${BASE_URL}`, {
        title: values.title,
        desc: values.desc,
        file: file ? file : "",
        date:startDate,
        status:"todo"
      })
        .then((res) => {
          if (res.status === 201) {
            notification.open({
              message: 'Task added successfully',
            });
            dispatch(closeModal())
            setRefetch(!refetch)
          }
        })
        .finally(() => {
          setLoad(false)

        })
    } else {
      axios.put(`${BASE_URL}/${id}`, {
        title: values.title,
        desc: values.desc,
        file: file ? file : "",
        date:startDate,
        status:status
      })
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            notification.open({
              message: 'Task edited successfully',
            });
            dispatch(closeModal())
            setRefetch(!refetch)
          }
        })
        .finally(() => {
          setLoad(false)
        })
    }
  };

  return (
    <>
      <Form
        name="basic"
        layout={"vertical"}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input your title!',
            },
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="Description"
          name="desc"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          label="File (Only Image)"
          name="file"
        >
          <>
            <label className="label_input" htmlFor="file">Upload Image</label>
            <input id="file" accept="image/*" className="none_input" type="file" onChange={changeFile}/>
          </>
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
        >
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
        </Form.Item>

        <Form.Item>
          <Button disabled={load} loading={load} style={{width: "100%", minHeight: "40px"}} htmlType="submit"
                  type="primary">{id ? "Edit Task" : "Add Task"}</Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddTask;
