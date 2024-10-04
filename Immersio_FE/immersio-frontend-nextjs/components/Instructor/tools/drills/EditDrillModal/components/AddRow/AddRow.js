import React from 'react';
import { Space, Row } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import styles from './AddRow.module.css';


export const AddRow = (props) => {
    const { addRowHandler, text } = props;

    return(
        <>
            <Row align="middle" className={styles.itemStyle} onClick={addRowHandler} >
                <Space>
                    <PlusCircleFilled className={styles.iconStyle}  /> 
                    <p className={styles.paragraphStyle}>{text}</p>
                </Space>
            </Row>
        </>
    );
}
