import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

export const TextInputRow = (props) => {
    const { placeholder, id, value} = props;
    const [txtValue, setTxtValue] = useState();

    useEffect(() => {
        setTxtValue(value);
    }, []);

    const handleChange = (e) => {
        props.inputRowOnChange(e, id);
        setTxtValue(e.target.value);
    }
    
    return (
        <Input 
            placeholder={placeholder} 
            style={{marginBottom: '10px'}}
            onChange={handleChange} 
            value={txtValue}
        />
    );
}
