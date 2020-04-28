import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import { loadComments } from '../actions/commentActions'
import { clearErrors } from '../actions/errorActions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import { CSVLink, CSVDownload } from "react-csv";


const Comment = (props) => {
  const { loadComments, comment } = props;


  useEffect(() => {
    let postId = props.location.state && props.location.state.postId ? props.location.state.postId : null;
    if (postId) {
      loadComments(postId)
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
  const [data, setData] = useState(comment.comments);
  const [editingKey, setEditingKey] = useState('');


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
    },
    {
      title: 'Comment',
      dataIndex: 'commentText',
      width: '25%',
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
      </Form>
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