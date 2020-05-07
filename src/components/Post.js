import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { loadPosts } from '../actions/postActions'
import { clearErrors } from '../actions/errorActions';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { CSVLink, CSVDownload } from "react-csv";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Post = (props) => {

  let query = useQuery();
  let queryState = query.get('type');


  const { loadPosts, post, loadCSV, comment } = props;
  const [csvDat, setCSV] = useState([])
  const [pid, setPid] = useState('some');
  // const [csvDat2, setCSV2] = useState([])
  const mounted = useRef();
  let inputRef = React.createRef('csv');


  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevQuery = usePrevious(queryState);
  useEffect(() => {
    // if (!mounted.current) {
    //   mounted.current = true;
    //   loadPosts(query.get('type'))
    // } else {
    // }
    if (prevQuery !== queryState) {
      // console.log(`now: ${queryState}. prev: ${prevQuery}`)
      loadPosts(query.get('type'))
    }

  }, [loadPosts, loadCSV, comment, csvDat, queryState]);


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
  const [data, setData] = useState(post.posts);
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

  const handleLink = (postUrl) => {
    props.history.push('comment', { postUrl });
  }



  // const csvButton = () => {
  // }

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
  const getPosition = (string, subString, index) => {
    return string.split(subString, index).join(subString).length;
  }

  const columns = [
    {
      title: 'Post URL',
      dataIndex: 'postUrl',
      width: '25%',
      editable: true,
      render: (_, rec) => {
        return (<a onClick={() => handleLink(rec.postUrl)}>{rec.postUrl.slice(0, getPosition(rec.postUrl, '/', 4))}</a >)
      }
    },
    {
      title: 'PostedBy',
      dataIndex: 'postedBy',
      width: '25%',
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
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
            <div className="flex">

              <a disabled={editingKey !== ''} onClick={() => edit(record)} >
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
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={post.posts}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  )

}

const mapStateToProps = (state) => {
  return {
    post: state.post,
    comment: state.comment,
    error: state.error
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loadPosts: () => {
      dispatch(loadPosts())
    }
  }
}

export default connect(mapStateToProps, { loadPosts })(Post);