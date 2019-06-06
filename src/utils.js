import { ages, places } from './data/places'

const convertOptions = (options)=> {
    return options.map((item, index) => {
        return {
            text: item.text,
            value: item.value,
        }
    })
}

export const convertData = (arr) => {
    return arr.map((item, index) => {
        const { number, type, title, other_value, multi, follow, options, required, textarea } = item;
        let obj = {
            number,
            type,
            title,
            required,
        };
        if(type === 'choice') {
            obj.answers = convertOptions(options);
            if(!!other_value) obj.otherValue = other_value;
        }
        if(type === 'selector') {
            obj.answers = ages;
        }
        if(type === 'placepicker') {
            obj.places = places;
        }
        if(type === 'multiselector') {
            obj.options = convertOptions(options);
            if(!!other_value) obj.otherValue = other_value;
            if(multi === 0) obj.multi = true;
            if(!!multi) obj.multi = multi;
        }
        if(type === 'input') {
            if(textarea === 1) obj.textarea = true;
            if(!!follow) obj.follow = follow;
        }
        return obj;
    })
}

export const convertQandaData = (arr) => {
    return arr.map((item, index) => {
        const { number, type, title, multi, multi_answer, other_value, options, required, answer, score } = item;
        let obj = {
            number,
            type,
            title,
            required,
            answer,
            multi_answer,
            score,
        };
        if(type === 'choice') {
            obj.answers = convertOptions(options);
            if(!!other_value) obj.otherValue = other_value;
        }
        if(type === 'multiselector') {
            obj.options = convertOptions(options);
            if(!!other_value) obj.otherValue = other_value;
            if(multi === 0) obj.multi = true;
            if(!!multi) obj.multi = multi;
        }
        return obj;
    })
}