import React from 'react';
import Radio from './Radio';
import Question from './Question';

function Choice({title, required, number, answers, answer, onChange, otherValue, handleOtherValueChange, valueObj, hint, verify}) {
    let hintText = hint || '答案不能为空';
    const isEmpty = !valueObj || !valueObj.value || valueObj.value !== answer;
    const _renderOptions = () => answers.map((item, index) => (
      <Radio
        key={index}
        selected={!!valueObj && valueObj.value === item.value}
        text={item.text}
        value={item.value}
        onChange={onChange(number)}
        isOther={!!otherValue && otherValue === item.value}
        handleOtherValueChange={!!handleOtherValueChange ? handleOtherValueChange(number) : null}
      />
    ))
    return (
        <Question
            title={title}
            required={required}
            number={number}
            hint={hintText}
            showHint={isEmpty && verify}
        >
            {_renderOptions()}
        </Question>
    )
}

export default Choice;