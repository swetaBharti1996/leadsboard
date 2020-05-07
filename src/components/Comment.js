import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Spin, Modal, Select, Divider } from 'antd';
import { loadComments } from '../actions/commentActions'
import { clearErrors } from '../actions/errorActions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";
import { LoadingOutlined } from '@ant-design/icons';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import Email from './Email';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Comment = (props) => {
  let tempeditorState = BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')

  const { loadComments, comment } = props;
  const [modal1Visible, setVisible] = useState(false);
  const [editorState, setEditorState] = useState(tempeditorState)
  const [data, setData] = useState(comment.comments);
  const [editingKey, setEditingKey] = useState('');
  const [outputHTML, setOutputHTML] = useState('<p></p>')
  const [emails, setEmails] = useState([])
  const [didMount, setDidMount] = useState(false)
  const [postUrlS, setPostUrl] = useState()


  useEffect(() => {
    let postUrl = props.location.state && props.location.state.postUrl ? props.location.state.postUrl : null;
    if (postUrl) {
      setPostUrl(postUrl)
      loadComments(postUrl)
    }
  }, [loadComments]);



  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  const [form] = Form.useForm();



  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const extractEmails = (text) => {
    text = text.toLowerCase()
    let temp = { value: null }
    let formattedEmail = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)
    temp['value'] = formattedEmail;

    return formattedEmail
  }

  const handleEditorChange = (editorState) => {
    setEditorState(editorState);
    setOutputHTML(editorState.toHTML())
  }


  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const setModal1Visible = (modalVisible) => {
    setVisible(modalVisible)
  }
  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      width: '25%',
      editable: true,
      render: (_, rec) => {
        return (<a>{rec.username}</a >)
      }
    },
    {
      title: 'Profile URL',
      dataIndex: 'profileUrl',
      width: '25%',
      render: (_, rec) => {
        return (<p>{rec.profileUrl.slice(0, rec.profileUrl.indexOf('?'))}</p>)
      }
    },
    {
      title: 'Comment',
      dataIndex: 'commentText',
      width: '25%',
    },
    {
      title: 'Email(s)',
      dataIndex: 'commentText',
      width: '25%',
      render: (_, rec) => {
        return (<p>{extractEmails(rec.commentText)}</p>)
      }
    },

    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <div>
              <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                Edit
            </a>

            </div>
          );
      },
    }
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });


  return (
    <div>
      <div className="flex-between">
        <div className="table-operations">
          <Button >Sort age</Button>
          <Button >Clear filters</Button>
          <Button>Clear filters and sorters</Button>
          <Button type="primary" ghost onClick={() => setModal1Visible(true)}>Send email</Button>
        </div>
        <div>
          <CSVLink
            className="csv-download"
            data={comment.comments}
          >
            <Button type="primary" icon={<DownloadOutlined />} size='medium'>
              Download CSV
      </Button>
          </CSVLink>
        </div>
      </div>

      <Form form={form} component={false}>
        <Spin spinning={comment.isLoading}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={comment.comments}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </Spin>
      </Form>

      <Email setModal1Visible={setModal1Visible} modal1Visible={modal1Visible} postUrl={postUrlS} />
    </div>

  )

}

const mapStateToProps = (state) => {
  return {
    comment: state.comment
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadComments: () => {
      dispatch(loadComments())
    }
  }
}

export default connect(mapStateToProps, { loadComments })(Comment);