import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button, Spin, Modal, Select, Divider } from 'antd';
import { loadEmails } from '../actions/postActions'
import { collectEmails, bulkEmailSend } from '../actions/commentActions'
import { connect } from 'react-redux';
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'


const Email = (props) => {
 let tempeditorState = BraftEditor.createEditorState('<p>Hello <b>World!</b></p>')
 const { post, setModal1Visible, modal1Visible, loadEmails, postUrl, collectEmails, emailCollection, bulkEmailSend, isEmailSending } = props;
 



 const [editorState, setEditorState] = useState(tempeditorState)
 const [outputHTML, setOutputHTML] = useState('<p></p>')



 useEffect(() => {
  if (postUrl) {
   loadEmails(postUrl)
  }

 }, [loadEmails, postUrl, emailCollection, isEmailSending]);


 const handleEditorChange = (editorState) => {
  setEditorState(editorState);
  setOutputHTML(editorState.toHTML())
 }

 const handleSelectChange = (value) => {
  collectEmails(value)
 }




 return (
  <div>
   <Modal
    title="Email editor"
    width={900}
    style={{ top: 20 }}
    visible={modal1Visible}
    onOk={() => {
     // setModal1Visible(false)
     bulkEmailSend(outputHTML)
    }
    }
    okText="Send mail"
    onCancel={() => setModal1Visible(false)}
   >
    <Spin spinning={isEmailSending}>

     <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="Please select email(s) to send"
      onChange={handleSelectChange}
      options={post.emails}
     />

     <Divider />
     <BraftEditor
      language="en"
      value={editorState}
      onChange={handleEditorChange}
     />
    </Spin>

   </Modal>

  </div>

 )

}

const mapStateToProps = (state) => {
 return {
  post: state.post,
  emailCollection: state.comment.emailCollection,
  isEmailSending: state.comment.isEmailSending
 }
}


export default connect(mapStateToProps, { loadEmails, collectEmails, bulkEmailSend })(Email);