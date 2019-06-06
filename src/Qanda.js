import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useState, useEffect } from 'react';

import { host, dhost } from './config';
import { convertQandaData } from './utils';

import QandaWrapper from './components/qanda';
import Header from './components/qanda/header';
import Footer from './components/qanda/footer';
import Choice from './components/qanda/Choice';
import Modal from './components/qanda/modal';
import Message from './components/qanda/message';
import MultiSelector from './components/qanda/MultiSelector';

const parsed = queryString.parse(window.location.search);
const { uid } = parsed;

function App() {
    const [ableToSubmit, setAbleToSubmit] = useState(false);
    const [items, setItems] = useState({});
    const [verify, setVerify] = useState(false);
    const [issue, setIssue] = useState({});
    const [questions, setQuestions] = useState([]);
    const [counter, setCounter] = useState(540);
    const [canClick, setCanClick] = useState(true);

    const [msg, setMsg] = useState({
        show: false,
        info: '',
    })

    const [modal, setModal] = useState({
        show: false,
        info: '',
    })

    const [tab, setTab] = useState(1);

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        let { issue_id } = parsed;
        issue_id = issue_id || '5c4d7945fc28bea4987603dd';
        axios({
            method: 'get',
            url: `${host}/api/question/topic/list?issue_id=${issue_id}`,
        }).then(r => {
            const { code, data } = r.data;
            if (code === 0) {
                setQuestions(convertQandaData(data.list));
                setIssue(data.issue);
            }
        }).catch(e => {
            console.log('获取问卷出错', e);
        })
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (counter <= 0) {
                clearTimeout(timer);
                setCanClick(false);
                setModal({
                    show: true,
                    info: '超时，星主考试未通过！'
                })
            } else {
                setCounter(counter - 1);
            }
        }, 1000)
        return () => { clearTimeout(timer) }
    }, [counter])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (msg.show) {
                setMsg({
                    show: false,
                    info: '',
                })
            } else {
                clearTimeout(timer);
            }
        }, 2000)
    }, [msg])
    // 单选题
    const handleChoiceChange = (number) => (value) => (e) => {

        items[number] = items[number] || {};
        items[number]['value'] = value;
        const follow = questions[number] && questions[number].follow; // questions is an array, so number no need to plus 1.
        if (!!follow && follow.value !== value) delete items[number + 1];
        setItems({
            ...items,
        })
    }

    // 多选题
    const handleMultiSelectorChange = (number, multi) => (value) => (e) => {
        items[number] = items[number] || {};
        items[number]['value'] = items[number]['value'] || [];
        const existIndex = items[number]['value'].indexOf(value);
        if (existIndex > -1) items[number]['value'].splice(existIndex, 1);
        else if (typeof multi === 'number' && items[number]['value'].length < multi) items[number]['value'].push(value);
        else if (typeof multi === 'boolean') items[number]['value'].push(value);
        setItems({
            ...items,
        })
    }

    const handleNext = () => {
        const canSubmit = verifyItems();
        if (canSubmit) {
            if (ableToSubmit) {
                return handleSubmit();
            }
            setVerify(false);
            setTab(tab + 1);
            if (questions.length - (tab + 1) * 4 <= 0) {
                setAbleToSubmit(true);
            }
            document.documentElement.scrollTop = 0;
        }
    }

    const handleSubmit = () => {
        axios({
            method: 'post',
            url: `${dhost}/api/dance/holder/answer`,
            data: {
                uid,
            }
        }).then(r => {
            const { code, data } = r.data;
            if (code === 0) {
                window.location.href = "guji://becomeDanceStartHolder";
            }
        }).catch(e => {
            console.log('error', e);
        })
    }

    const verifyItems = () => {
        setVerify(true)
        let canSubmit = true;
        const toRender = questions.slice((tab - 1) * 4, tab * 4);
        toRender.some((item, index) => {
            const { type, number, required, answer, multi_answer } = item;
            const valueObj = items[number];
            if (required === 1 && type === 'choice') {
                if (!valueObj || !valueObj['value']) {
                    setMsg({
                        show: true,
                        info: '有题目尚未回答',
                    })
                    canSubmit = false;
                }
                if (valueObj && valueObj['value'] !== answer) {
                    setMsg({
                        show: true,
                        info: '有题目答错啦',
                    })
                    canSubmit = false;
                }
            }
            if (required === 1 && type === 'multiselector') {
                if(!valueObj || !valueObj['value'] || valueObj['value'].length === 0){
                    setMsg({
                        show: true,
                        info: '有题目尚未回答',
                    })
                    canSubmit = false;
                }
                if(valueObj && valueObj['value']){
                    const curAnswer = valueObj['value'];
                    const multiAnswer = multi_answer.split(',').map(_item => parseInt(_item));
                    if(curAnswer.length !== multiAnswer.length) {
                        setMsg({
                            show: true,
                            info: '有题目答错啦',
                        })
                        canSubmit = false;
                    }else if(curAnswer.sort().join('') !== multiAnswer.sort().join('')) {
                        setMsg({
                            show: true,
                            info: '有题目答错啦',
                        })
                        canSubmit = false;
                    }
                }
            }
        })
        return canSubmit;
    }

    const _renderQuestions = () => {
        const toRender = questions.slice((tab - 1) * 4, tab * 4);
        const nodes = toRender.map((item, index) => {
            const { type } = item;
            if (type === 'choice') {
                const {
                    number,
                    required,
                    title,
                    answers,
                    otherValue,
                    answer,
                } = item;
                return <Choice
                    key={index}
                    number={number}
                    required={required}
                    title={title}
                    answers={answers}
                    answer={answer}
                    otherValue={otherValue}
                    valueObj={items[number]}
                    onChange={handleChoiceChange}
                    verify={verify}
                />
            }
            if (type === 'multiselector') {
                const {
                    number,
                    required,
                    title,
                    multi,
                    options,
                    otherValue,
                    multi_answer
                } = item;
                return <MultiSelector
                    key={index}
                    number={number}
                    required={required}
                    title={title}
                    multi={multi}
                    options={options}
                    valueObj={items[number]}
                    multiAnswer={multi_answer.split(',').map(_item => parseInt(_item))}
                    otherValue={otherValue}
                    verify={verify}
                    onChange={handleMultiSelectorChange}
                />
            }
            return '';
        })
        return nodes;
    }

    return (
        <div className="qanda">
            <Header
                counter={counter}
                tab={tab}
                total={questions.length}
            />
            <QandaWrapper>
                {
                    _renderQuestions()
                }
            </QandaWrapper>
            <Footer
                ableToSubmit={ableToSubmit}
                handleNext={canClick ? handleNext : () => { setModal({ show: true, info: '超时，星主考试未通过！' }) }}
            />
            <Modal
                modal={modal}
                onCancel={() => {
                    setModal({
                        show: false,
                        info: '',
                    })
                }}
            />
            <Message
                show={msg.show}
                info={msg.info}
            />
        </div>
    )
}

export default App;