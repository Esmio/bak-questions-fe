import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import {useState, useEffect} from 'react';

// import questions from './data/questions';
import { host } from './config';
import { convertData } from './utils';

import Selector from './components/Selector';
import Choice from './components/Choice';
import PlacePicker from './components/PlacePicker';
import Input from './components/Input';
import MultiSelector from './components/MultiSelector';


function App() {
  const [ items, setItems ] = useState({});
  const [ verify, setVerify ] = useState(false);
  const [ questions, setQuestions ] = useState([]);
  const [ issue, setIssue ] = useState({});
  const [ modal, setModal ] = useState({
    show: false,
    info: '',
  })

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    let { issue_id } = parsed;
    issue_id = issue_id || '5c4d7945fc28bea4987603dd';
    axios({
      method: 'get',
      url: `${host}/api/question/topic/list?issue_id=${issue_id}`,
    }).then(r => {
      const { code, data } = r.data;
      if(code === 0) {
        setQuestions(convertData(data.list));
        setIssue(data.issue);
      }
    }).catch(e => {
      console.log('获取问卷出错', e);
    })
  }, [])

  // 单选题
  const handleChoiceChange = (number) => (value) => (e) => {
    
    items[number] = items[number] || {};
    items[number]['value'] = value;
    const follow = questions[number] && questions[number].follow ; // questions is an array, so number no need to plus 1.
    if(!!follow && follow.value !== value ) delete items[number + 1];
    setItems({
      ...items,
    })
  }
  // 多选题
  const handleMultiSelectorChange = (number, multi) => (value) => (e) => {
    items[number] = items[number] || {};
    items[number]['value'] = items[number]['value'] || [];
    const existIndex = items[number]['value'].indexOf(value);
    if(existIndex > -1) items[number]['value'].splice(existIndex, 1);
    else if(typeof multi === 'number' && items[number]['value'].length < multi) items[number]['value'].push(value);
    else if(typeof multi === 'boolean') items[number]['value'].push(value);
    setItems({
      ...items,
    })
  }
  // 单选题选择其他
  const handleOtherValueChange = (number) => (e) => {
    items[number] = items[number] || {};
    items[number]['other'] = e.target.value;
    setItems({
      ...items,
    })
  }
  // 下拉选择 
  const handleSelectorChange = (number) => (e) => {
    items[number] = items[number] || {};
    const value = parseInt(e.target.value);
    if(value === 0) delete items[number];
    else items[number]['value'] = value;
    setItems({
      ...items,
    })
  }
  // 选择省市
  const handlePlacePickerChange = (number) => (place) => {
    items[number] = place;
    setItems({
      ...items,
    })
  }
  // 输入文本
  const handleInputChange = (number) => (e) => {
    items[number] = items[number] || {};
    items[number]['value'] = e.target.value.trim();
    setItems({
      ...items,
    })
  }
  // 
  const verifyItems = () => {
    setVerify(true)
    let canSubmit = true;
    questions.some((item, index) => {
      const {type, number, required} = item;
      const valueObj = items[number];
      if(required === 1 && type === 'choice' && (!valueObj || !valueObj['value'])) {
        canSubmit = false;
        return true;
      }
      if(required === 1 && type === 'selector' && (!valueObj || !valueObj['value'])) {
        canSubmit = false;
        return true;
      }
      if(required === 1 && type === 'placepicker' && (!valueObj || valueObj['prov'] === undefined || valueObj['city'] === undefined)) {
        canSubmit = false;
        return true;
      }
      if(required === 1 && type === 'multiselector' && (!valueObj || !valueObj['value'] || valueObj['value'].length === 0)) {
        canSubmit = false;
        return true;
      }
      if(required === 1 && type === 'input') {
        const { follow } = item;
        if(!valueObj || !valueObj['value']){
          if(!follow || items[follow.number]['value'] === follow.value) {
            canSubmit = false;
            return true;
          }
        }
      }
    })
    return canSubmit;
  }
  // 提交问券
  const submit = () => {
    const canSubmit = verifyItems();
    if(!canSubmit) {
      setModal({
        modal: true,
        info: '您还有未回答的题目哦！'
      })
      return false;
    }
    const parsed = queryString.parse(window.location.search);
    const {uid, issue_id} = parsed;
    const itmesStr = JSON.stringify(items);
    const id = issue_id || '5c4d7945fc28bea4987603dd';
    if(!uid) return false;
    axios({
      method: 'post',
      url: `${host}/api/question/submit`,
      data: {
        uid,
        items: itmesStr,
        issue_id: id,
      }
    }).then(r => {
      const { code, data } = r.data;
      if(code === 0) {
        setModal({
          show: true,
          type: 1,
          info: '问卷提交成功！'
        })
      }
    }).catch(e => {
      console.log('e', e);
      if(!e.response) setModal({show: false, info: e.message});
      else {
        const {data} = e.response;
        if(data.code === 20002) {
          setModal({
            show: true,
            info: '您已经提交过问卷'
          })
        }else {
          setModal({
            show: true,
            info: data.msg,
          })
        }
      }
    })
  }

  const _renderQuestions = () => {
    const nodes = questions.map((item, index) => {
        const {type} = item;
        if(type === 'choice') {
            const {
                number,
                required,
                title,
                answers,
                otherValue,
            } = item;
            return <Choice
                key={index}
                number={number}
                required={required}
                title={title}
                answers={answers}
                otherValue={otherValue}
                valueObj={items[number]}
                onChange={handleChoiceChange}
                handleOtherValueChange={handleOtherValueChange}
                verify={verify}
            />
        }
        if(type === 'selector') {
            const {
                number,
                required,
                title,
                answers,
            } = item;
            return <Selector
                key={index}
                number={number}
                required={required}
                title={title}
                answers={answers}
                onChange={handleSelectorChange}
                valueObj={items[number]}
                verify={verify}
            />
        } 
        if(type === 'placepicker') {
            const {
                number,
                required,
                title,
                places,
            } = item;
            return <PlacePicker 
                key={index}
                number={number}
                required={required}
                title={title}
                places={places}
                valueObj={items[number]}
                onChange={handlePlacePickerChange}
                verify={verify}
            />
        }
        if(type === 'input') {
            const {
                number,
                required,
                title,
                follow,
                textarea,
            } = item;
            let show = true;
            if(!!follow) show = items[follow.number] && items[follow.number]['value'] === follow.value;
            return <Input
                key={index}
                number={number}
                required={required}
                title={title}
                show={show}
                valueObj={items[number]}
                textarea={textarea}
                verify={verify}
                onChange={handleInputChange}
            />
        }
        if(type === 'multiselector') {
            const {
                number,
                required,
                title,
                multi,
                options,
                otherValue,
            } = item;
            return <MultiSelector
                key={index}
                number={number}
                required={required}
                title={title}
                multi={multi}
                options={options}
                valueObj={items[number]}
                otherValue={otherValue}
                verify={verify}
                onChange={handleMultiSelectorChange}
                handleOtherValueChange={handleOtherValueChange}
            />
        }
        return '';
    })
    return nodes;
  }

  return (
    <div 
      style={{
        width: '100vw',
        backgroundColor: '#fff',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        overflowX: 'hidden',
        height: 'auto',
        WebkitOverflowScroll: 'touch',
      }}
    >
      <div
        style={{
          fontSize: '.32rem',
          color: '#19a8ee',
          fontWeight: 'bolder',
          height: '.6rem',
          paddingTop: '.1rem',
          paddingBottom: '.1rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {issue.title}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '.24rem',
            color: '#666',
            borderBottom: '.01rem solid #f2f2f2',
            padding: '.1rem 0',
            textAlign: 'left',
            width: 'calc(100vw - .6rem)'
          }}
        >
          感谢您的参与，请认真填写喔
        </div>
        <div
          style={{
            fontSize: '.28rem',
            boxSizing: 'border-box',
          }}
        >
            {
              _renderQuestions()
            }
        </div>
        <div
          style={{
            height: '1.6rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {
            !!questions.length > 0 ? 
            <div
              style={{
                width: '2rem',
                height: '.6rem',
                fontSize: '.28rem',
                fontWeight: 'bolder',
                color: '#fff',
                backgroundColor: '#19a8ee',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '.1rem'
              }}
              onClick={submit}
            >
              提交问券
            </div> : ''
          }
        </div>
      </div>
      { 
        modal.show ? 
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0, .8)',
            color: '#fff',
            fontSize: '.32rem',
            fontWeight: 'bolder',
            overflow: 'hidden',
          }}
          onClick={() => {setModal({show: false, info:''})}}
        >
          <span style={{color: modal.type === 1 ? 'green' : 'red'}}>{modal.info}</span>
          <div
            style={{
              width: '1.6rem',
              height: '.6rem',
              borderRadius: '.05rem',
              backgroundColor: '#fff',
              fontSize: '.28rem',
              color: '#000',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '.8rem',
            }}
            onClick={() => {setModal({show: false, info:''})}}
          >
            关闭
          </div>
        </div> :
        ''
      }
    </div>
  )
}

export default App;
